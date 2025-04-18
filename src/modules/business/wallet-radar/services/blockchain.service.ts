import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ethers from 'ethers';

// ABI cho ERC20 token (chỉ phần cần thiết cho Transfer event)
const ERC20_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function decimals() view returns (uint8)',
];

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private readonly providers: Record<string, ethers.providers.Provider> = {};

  constructor(private configService: ConfigService) {
    // Khởi tạo providers cho các mạng
    const networks = {
      base: this.configService.get<string>('BASE_RPC_URL'),
      ethereum: this.configService.get<string>('ETH_RPC_URL'),
      // Thêm các mạng khác khi cần
      'base-sepolia': this.configService.get<string>('BASE_SEPOLIA_RPC_URL'),
    };

    for (const [network, rpcUrl] of Object.entries(networks)) {
      if (rpcUrl) {
        try {
          this.providers[network] = new ethers.providers.StaticJsonRpcProvider(
            rpcUrl,
          );
          this.logger.log(`Initialized provider for ${network}`);
        } catch (error) {
          this.logger.error(
            `Failed to initialize provider for ${network}: ${error.message}`,
          );
        }
      }
    }
  }

  async getNewTransactions(
    walletAddress: string,
    tokenAddress: string | null,
    network: string,
    fromBlock: number,
  ) {
    const provider = this.providers[network];
    if (!provider) {
      throw new Error(`Network ${network} not supported`);
    }

    // Lấy block hiện tại
    const currentBlock = await provider.getBlockNumber();

    // Giới hạn số lượng block để query để tránh timeout
    const toBlock = Math.min(fromBlock + 10000, currentBlock);

    // Lấy transactions cho native token (ETH, BASE, v.v.)
    if (!tokenAddress) {
      return this.getNativeTokenTransactions(
        walletAddress,
        network,
        fromBlock,
        toBlock,
      );
    } else {
      // Lấy transactions cho tokens (ERC20, v.v.)
      return this.getTokenTransactions(
        walletAddress,
        tokenAddress,
        network,
        fromBlock,
        toBlock,
      );
    }
  }

  private async getNativeTokenTransactions(
    walletAddress: string,
    network: string,
    fromBlock: number,
    toBlock: number,
  ) {
    const provider = this.providers[network];
    const transactions = [];

    try {
      // Lấy history của blocks từ fromBlock đến toBlock
      for (let i = fromBlock; i <= toBlock; i += 10) {
        const endBlock = Math.min(i + 9, toBlock);

        const blockBatch = await Promise.all(
          Array.from({ length: endBlock - i + 1 }, (_, idx) =>
            provider.getBlockWithTransactions(i + idx),
          ),
        );

        for (const block of blockBatch) {
          if (block && block.transactions) {
            for (const tx of block.transactions) {
              if (
                (tx.from.toLowerCase() === walletAddress.toLowerCase() ||
                  tx.to?.toLowerCase() === walletAddress.toLowerCase()) &&
                tx.value.gt(0)
              ) {
                transactions.push({
                  hash: tx.hash,
                  blockNumber: block.number,
                  from: tx.from,
                  to: tx.to,
                  tokenAddress: null, // Native token
                  amount: tx.value.toString(),
                  formattedAmount: ethers.utils.formatEther(tx.value), // Format native token với 18 decimals
                  timestamp: block.timestamp,
                });
              }
            }
          }
        }
      }

      return transactions;
    } catch (error) {
      this.logger.error(
        `Error getting native token transactions: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async getTokenTransactions(
    walletAddress: string,
    tokenAddress: string,
    network: string,
    fromBlock: number,
    toBlock: number,
  ) {
    const provider = this.providers[network];
    const transactions = [];

    try {
      // Tạo contract instance
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

      // Lấy số decimals của token
      let decimals;
      try {
        decimals = Number(await contract.decimals());
      } catch (error) {
        this.logger.warn(
          `Could not get decimals for token ${tokenAddress}: ${error.message}`,
        );
        decimals = 18; // Default to 18 if unable to get decimals
      }

      // Filter cho Transfer events từ địa chỉ ví
      // const sentFilter = contract.filters.Transfer(walletAddress, null);

      // Filter cho Transfer events đến địa chỉ ví
      const receivedFilter = contract.filters.Transfer(null, walletAddress);

      // Query logs
      const [sentLogs, receivedLogs] = await Promise.all([
        [], // contract.queryFilter(sentFilter, fromBlock, toBlock), // @dev: only receive received logs
        contract.queryFilter(receivedFilter, fromBlock, toBlock),
      ]);

      // Process sent transactions
      for (const log of sentLogs) {
        const block = await provider.getBlock(log.blockNumber);
        const amount = log.args[2];
        transactions.push({
          hash: log.transactionHash,
          blockNumber: log.blockNumber,
          from: log.args[0],
          to: log.args[1],
          tokenAddress,
          amount: amount.toString(),
          formattedAmount: ethers.utils.formatUnits(amount, decimals),
          timestamp: block.timestamp,
        });
      }

      // Process received transactions
      for (const log of receivedLogs) {
        const block = await provider.getBlock(log.blockNumber);
        const amount = log.args[2];
        transactions.push({
          hash: log.transactionHash,
          blockNumber: log.blockNumber,
          from: log.args[0],
          to: log.args[1],
          tokenAddress,
          amount: amount.toString(),
          formattedAmount: ethers.utils.formatUnits(amount, decimals),
          timestamp: block.timestamp,
        });
      }

      return transactions;
    } catch (error) {
      this.logger.error(
        `Error getting token transactions: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
