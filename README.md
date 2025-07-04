# Wallet Radar Server

Blockchain transaction monitoring system that sends notifications when new transactions are detected from a specified wallet address.

## Key Features

- **Blockchain Wallet Monitoring**: Listen for transactions from specified wallet addresses across multiple blockchain networks.
- **Token Filtering**: Ability to track transactions for a specific token or all tokens.
- **Multi-channel Notifications**: Send alerts via webhook, email, and other expandable notification channels.
- **Asynchronous Processing**: Use queue system for efficient listening and notification processing.
- **RESTful API**: Manage subscriptions through API endpoints.

## System Architecture

The system includes these main components:

1. **API Module**: Handles HTTP requests to create/manage subscriptions
2. **Worker Module**: Runs cron jobs to check for new transactions
3. **Queue System**: Processes transaction checking and notifications asynchronously
4. **Blockchain Service**: Interacts with blockchain networks to retrieve transaction information
5. **Notification Service**: Sends notifications through various channels

## Installation and Running

### Requirements

- Node.js v16+
- PostgreSQL
- Redis

### Installation

1. Clone repository:
```bash
git clone https://github.com/your-username/wallet-radar-server.git
cd wallet-radar-server
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment:
```bash
cp .env.sample .env
# Update information in .env file
```

4. Create database and run migrations:
```bash
createdb wallet_radar  # Or create in PostgreSQL UI
pnpm migration:run
```

### Running the Application

#### Development:
```bash
# Run API server
IS_API=1 pnpm start:dev

# Run worker
IS_WORKER=1 pnpm start:dev

# Run both API and worker
IS_API=1 IS_WORKER=1 pnpm start:dev
```

#### Production:
```bash
# Build the application
pnpm build

# Run server
IS_API=1 IS_WORKER=1 NODE_ENV=production pnpm start:prod
```

## API Documentation

View detailed API in the Swagger documentation at: `http://localhost:3000/api`

### Main Endpoints:

- `POST /wallet-radar/subscribe` - Create new subscription
- `GET /wallet-radar/subscriptions` - Get list of subscriptions
- `GET /wallet-radar/subscriptions/:id` - Get subscription by ID
- `DELETE /wallet-radar/subscriptions/:id` - Delete subscription

## Detailed Documentation

See more detailed documentation at: [src/modules/business/wallet-radar/README.md](src/modules/business/wallet-radar/README.md)

## RabbitMQ Integration

The application now supports sending wallet transaction alerts via RabbitMQ. This allows other services to subscribe to these events for further processing.

### Configuration

1. Make sure RabbitMQ is running and accessible
2. Set the `RABBITMQ_URL` environment variable in your `.env` file:

```
RABBITMQ_URL=amqp://username:password@localhost:5672
```

### Testing the RabbitMQ Integration

1. Start the consumer script to listen for events:

```bash
# Start the RabbitMQ consumer script
npx ts-node scripts/rabbitmq-consumer.ts
```

2. In another terminal, call the test endpoint:

```bash
curl http://localhost:3000/wallet-radar/test-rabbitmq
```

3. You should see the transaction data in the consumer terminal.

### Event Structure

The RabbitMQ events are published with the pattern `wallet-transaction` and contain the following data structure:

```json
{
  "wallet_address": "0xb16C8828E41651cCD3131B10AF7E0bCF1c48E397",
  "token_address": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", 
  "blockchain_network": "base",
  "transaction_hash": "0x2afc0f21e172a7077c49fb250971834190a2dd05ae70f17d563def35360da28f",
  "amount": "0",
  "from": "0x32a001d721Fa3826E5A92AF6D029beb44D2ede16",
  "to": "0xb16C8828E41651cCD3131B10AF7E0bCF1c48E397",
  "timestamp": "2024-07-18T12:34:56.789Z",
  "block_number": 29045127
}
```
