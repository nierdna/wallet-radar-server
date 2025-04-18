# Wallet Radar Server

Hệ thống theo dõi giao dịch blockchain và gửi thông báo khi phát hiện giao dịch mới từ một địa chỉ ví được chỉ định.

## Tính năng chính

- **Theo dõi ví blockchain**: Lắng nghe các giao dịch từ địa chỉ ví được chỉ định trên nhiều mạng blockchain.
- **Lọc token**: Có thể theo dõi giao dịch của một token cụ thể hoặc tất cả các tokens.
- **Thông báo đa kênh**: Gửi alert qua webhook, email, và có thể mở rộng thêm các kênh thông báo khác.
- **Xử lý bất đồng bộ**: Sử dụng queue system để xử lý hiệu quả việc lắng nghe và thông báo.
- **RESTful API**: Quản lý subscriptions thông qua API endpoints.

## Kiến trúc hệ thống

Hệ thống bao gồm các thành phần chính:

1. **API Module**: Xử lý các yêu cầu HTTP để tạo/quản lý subscriptions
2. **Worker Module**: Chạy cron job để kiểm tra giao dịch mới
3. **Queue System**: Xử lý bất đồng bộ việc kiểm tra và thông báo giao dịch
4. **Blockchain Service**: Tương tác với các mạng blockchain để lấy thông tin giao dịch
5. **Notification Service**: Gửi thông báo qua các kênh khác nhau

## Cài đặt và chạy

### Yêu cầu

- Node.js v16+
- PostgreSQL
- Redis

### Cài đặt

1. Clone repository:
```bash
git clone https://github.com/your-username/wallet-radar-server.git
cd wallet-radar-server
```

2. Cài đặt dependencies:
```bash
pnpm install
```

3. Cấu hình môi trường:
```bash
cp .env.sample .env
# Cập nhật các thông tin trong file .env
```

4. Tạo database và chạy migrations:
```bash
createdb wallet_radar  # Hoặc tạo trong PostgreSQL UI
pnpm migration:run
```

### Chạy ứng dụng

#### Development:
```bash
# Chạy API server
IS_API=1 pnpm start:dev

# Chạy worker
IS_WORKER=1 pnpm start:dev

# Chạy cả API và worker
IS_API=1 IS_WORKER=1 pnpm start:dev
```

#### Production:
```bash
# Build ứng dụng
pnpm build

# Chạy server
IS_API=1 IS_WORKER=1 NODE_ENV=production pnpm start:prod
```

## API Documentation

Xem chi tiết API trong tài liệu Swagger tại: `http://localhost:3000/api`

### Endpoints chính:

- `POST /wallet-radar/subscribe` - Tạo subscription mới
- `GET /wallet-radar/subscriptions` - Lấy danh sách subscriptions
- `GET /wallet-radar/subscriptions/:id` - Lấy subscription theo ID
- `DELETE /wallet-radar/subscriptions/:id` - Xóa subscription

## Tài liệu chi tiết

Xem thêm tài liệu chi tiết tại: [src/modules/business/wallet-radar/README.md](src/modules/business/wallet-radar/README.md)

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
