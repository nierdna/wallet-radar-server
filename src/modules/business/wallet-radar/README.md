# Wallet Radar System

Wallet Radar là hệ thống theo dõi giao dịch blockchain và gửi thông báo khi phát hiện giao dịch mới từ một địa chỉ ví được chỉ định.

## Features

- Theo dõi địa chỉ ví trên nhiều blockchain khác nhau (Ethereum, Base, BSC, v.v.)
- Theo dõi giao dịch của token cụ thể hoặc tất cả tokens
- Gửi thông báo qua webhook và email khi phát hiện giao dịch mới
- API để quản lý các subscription
- Background workers để theo dõi blockchain liên tục và hiệu quả
- Queue system để xử lý bất đồng bộ các tác vụ nặng

## Cài đặt

### Yêu cầu

- Node.js v16+
- PostgreSQL
- Redis

### Cài đặt dependencies

```bash
pnpm install
```

### Cấu hình môi trường

Sao chép file `.env.sample` sang `.env` và cấu hình các biến môi trường:

```bash
cp .env.sample .env
```

Cấu hình các giá trị sau:
- Thông tin database (DB_HOST, DB_PORT, v.v.)
- Thông tin Redis (REDIS_HOST, REDIS_PORT)
- RPC URLs cho các blockchain (BASE_RPC_URL, ETH_RPC_URL, v.v.)
- Thông tin SMTP cho gửi email (nếu cần)

### Tạo database và chạy migrations

```bash
# Tạo database
createdb wallet_radar

# Chạy migrations
pnpm migration:run
```

## Khởi chạy ứng dụng

### Chế độ development

```bash
# Chạy API server
IS_API=1 pnpm start:dev

# Chạy worker
IS_WORKER=1 pnpm start:dev

# Chạy cả API và worker
IS_API=1 IS_WORKER=1 pnpm start:dev
```

### Chế độ production

```bash
# Build ứng dụng
pnpm build

# Chạy API server
IS_API=1 NODE_ENV=production pnpm start:prod

# Chạy worker
IS_WORKER=1 NODE_ENV=production pnpm start:prod
```

## API Endpoints

### Tạo subscription mới

```
POST /wallet-radar/subscribe
```

Body:
```json
{
  "wallet_address": "0x1234...5678",
  "token_address": "0xabcd...ef00", // optional
  "blockchain_network": "base",
  "webhook_url": "https://example.com/webhook", // optional
  "email": "user@example.com" // optional
}
```

### Lấy danh sách subscriptions

```
GET /wallet-radar/subscriptions
```

Query params:
- `wallet_address`: Lọc theo địa chỉ ví
- `blockchain_network`: Lọc theo mạng blockchain
- `active`: Lọc theo trạng thái active
- `user_id`: Lọc theo user ID

### Lấy subscription theo ID

```
GET /wallet-radar/subscriptions/:id
```

### Xóa subscription

```
DELETE /wallet-radar/subscriptions/:id
```

## Mở rộng hệ thống

### Thêm blockchain mới

1. Thêm RPC URL vào file `.env`:
```
NEW_NETWORK_RPC_URL=https://rpc-endpoint-url
```

2. Cập nhật file `blockchain.service.ts` để thêm network mới:
```typescript
constructor(private configService: ConfigService) {
  // Khởi tạo providers cho các mạng
  const networks = {
    base: this.configService.get<string>('BASE_RPC_URL'),
    ethereum: this.configService.get<string>('ETH_RPC_URL'),
    new_network: this.configService.get<string>('NEW_NETWORK_RPC_URL'), // Thêm network mới
  };
  // ...
}
```

### Thêm phương thức thông báo mới

1. Cập nhật entity `WalletSubscription` để thêm trường mới:
```typescript
@Column({ nullable: true })
new_notification_method: string;
```

2. Cập nhật DTO `CreateSubscriptionDto`:
```typescript
@IsOptional()
@IsString()
new_notification_method?: string;
```

3. Cập nhật `NotificationService` để thêm logic gửi thông báo mới. 