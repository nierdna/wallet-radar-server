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
