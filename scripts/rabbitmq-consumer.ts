/**
 * RabbitMQ Consumer Script
 *
 * This script connects to RabbitMQ and listens for wallet transaction events
 * that are published by the wallet-radar service.
 *
 * Usage:
 * - Run with ts-node: ts-node scripts/rabbitmq-consumer.ts
 * - Press Ctrl+C to stop the script
 */

import * as amqp from 'amqplib';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// RabbitMQ connection string from env or use default
const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const queueName = 'wallet_radar_queue';

interface WalletTransaction {
  wallet_address: string;
  token_address: string;
  blockchain_network: string;
  transaction_hash: string;
  amount: string;
  from: string;
  to: string;
  timestamp: string;
  block_number: number;
}

async function consumeMessages(): Promise<void> {
  console.log('Starting RabbitMQ consumer...');
  console.log(`Connecting to RabbitMQ: ${rabbitmqUrl}`);

  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(rabbitmqUrl);
    console.log('Connected to RabbitMQ successfully');

    // Create a channel
    const channel = await connection.createChannel();
    console.log('Channel created');

    // Make sure the queue exists
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Queue "${queueName}" is ready`);

    // Bind the queue to the exchange with the routing key 'wallet-transaction'
    const exchange = 'amq.topic';
    await channel.assertExchange(exchange, 'topic', { durable: true });
    await channel.bindQueue(queueName, exchange, 'wallet-transaction');
    console.log(
      `Bound queue to exchange with routing key 'wallet-transaction'`,
    );

    console.log(
      ' [*] Waiting for wallet transaction messages. To exit press CTRL+C',
    );

    // Set up consumer
    channel.consume(queueName, (msg: amqp.ConsumeMessage | null) => {
      if (msg !== null) {
        const content = msg.content.toString();
        const data = JSON.parse(content) as WalletTransaction;
        console.log('🚀 ~ channel.consume ~ data:', data);

        console.log('\n=== New Transaction Received ===');
        console.log(`Time: ${new Date().toISOString()}`);
        console.log(`Wallet Address: ${data.wallet_address}`);
        console.log(`Blockchain: ${data.blockchain_network}`);
        console.log(`Transaction Hash: ${data.transaction_hash}`);
        console.log(`Token: ${data.token_address || 'Native token'}`);
        console.log(`Amount: ${data.amount}`);
        console.log(`From: ${data.from}`);
        console.log(`To: ${data.to}`);
        console.log(`Block Number: ${data.block_number}`);
        console.log(`Timestamp: ${data.timestamp}`);
        console.log('=================================\n');

        // Acknowledge the message
        channel.ack(msg);
      }
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      console.log('Closing connection to RabbitMQ...');
      await channel.close();
      await connection.close();
      process.exit(0);
    });
  } catch (error: unknown) {
    console.error(
      'Error connecting to RabbitMQ:',
      error instanceof Error ? error.message : String(error),
    );
    setTimeout(consumeMessages, 5000); // Try to reconnect after 5 seconds
  }
}

// Start the consumer
consumeMessages().catch((err: unknown) => {
  console.error(
    'Fatal error in consumer:',
    err instanceof Error ? err.message : String(err),
  );
  process.exit(1);
});
