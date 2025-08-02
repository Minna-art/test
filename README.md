# Library App với Google OAuth

Ứng dụng thư viện với chức năng đăng ký/đăng nhập bằng Google OAuth.

## Tính năng

- ✅ Đăng ký/đăng nhập thường
- ✅ Đăng ký/đăng nhập bằng Google OAuth
- ✅ Xác thực JWT
- ✅ UI/UX hiện đại
- ✅ Responsive design

## Cài đặt

### 1. Frontend Setup

```bash
# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Cấu hình Google Client ID trong .env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 2. Backend Setup

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Cấu hình trong .env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. Cấu hình Google OAuth

#### Bước 1: Tạo Google Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Kích hoạt Google+ API

#### Bước 2: Tạo OAuth 2.0 Client ID
1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Chọn **Web application**
4. Thêm **Authorized JavaScript origins**:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Thêm **Authorized redirect URIs**:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
6. Copy **Client ID** và paste vào file `.env`

#### Bước 3: Cấu hình Domain Verification (Production)
1. Vào **APIs & Services** > **Domain verification**
2. Add domain của bạn
3. Verify ownership

## Chạy ứng dụng

### Development

```bash
# Terminal 1: Chạy backend
cd backend
npm run dev

# Terminal 2: Chạy frontend
npm start
```

### Production

```bash
# Build frontend
npm run build

# Chạy backend
cd backend
npm start
```

## Cấu trúc thư mục

```
library-app/
├── src/
│   ├── components/
│   │   └── RegisterModal.jsx     # Modal đăng ký với Google OAuth
│   ├── lib/
│   │   ├── api.js               # API service
│   │   └── googleAuth.js        # Google OAuth service
│   ├── store/
│   │   └── authStore.js         # Zustand store cho authentication
│   └── ...
├── backend/
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env.example
├── package.json
├── .env.example
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký thường
- `POST /api/auth/login` - Đăng nhập thường
- `POST /api/auth/google` - Đăng nhập/đăng ký Google OAuth
- `GET /api/auth/profile` - Lấy thông tin user
- `POST /api/auth/logout` - Đăng xuất

### Health Check
- `GET /api/health` - Kiểm tra server status

## Sử dụng

1. **Đăng ký thường**: Nhập username, email, password
2. **Đăng ký Google**: Click nút "Tiếp tục với Google"
3. **Chuyển đổi**: Click "Đăng nhập" để chuyển sang modal đăng nhập

## Troubleshooting

### Lỗi Google OAuth
1. **"redirect_uri_mismatch"**: Kiểm tra authorized URIs trong Google Console
2. **"invalid_client"**: Kiểm tra Google Client ID
3. **"access_blocked"**: Kiểm tra domain verification

### Lỗi Backend
1. **CORS Error**: Kiểm tra CORS configuration
2. **Token Error**: Kiểm tra JWT_SECRET
3. **Database Error**: Kiểm tra database connection (nếu sử dụng)

## Security Notes

- Không commit file `.env` vào git
- Sử dụng HTTPS trong production
- Thường xuyên rotate JWT secret
- Validate tất cả input từ client
- Sử dụng rate limiting cho API

## Contributing

1. Fork project
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License