# Thư Viện Web - Library Web App

Ứng dụng web quản lý thư viện với tính năng đăng ký/đăng nhập bằng Google.

## Tính năng

- ✅ Đăng ký tài khoản với email/mật khẩu
- ✅ Đăng nhập bằng Google OAuth
- ✅ Giao diện đẹp với Tailwind CSS
- ✅ Quản lý trạng thái với Zustand
- ✅ Responsive design
- ✅ Form validation

## Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd library-web-app
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Google OAuth

#### Bước 1: Tạo Google Cloud Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo một project mới hoặc chọn project hiện có
3. Bật Google+ API và Google Identity API

#### Bước 2: Tạo OAuth 2.0 Client ID
1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Chọn **Web application**
4. Thêm các Authorized JavaScript origins:
   - `http://localhost:3000` (cho development)
   - Domain production của bạn
5. Copy **Client ID**

#### Bước 3: Cấu hình Environment Variables
```bash
# Copy file .env.example thành .env
cp .env.example .env

# Chỉnh sửa file .env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Cấu trúc dự án

```
src/
├── components/
│   ├── GoogleLoginButton.jsx    # Component đăng nhập Google
│   └── RegisterModal.jsx        # Modal đăng ký
├── store/
│   └── authStore.js            # Zustand store quản lý auth
├── lib/
│   └── api.js                  # API service
├── App.jsx                     # Component chính
├── App.css                     # CSS styles
├── index.js                    # Entry point
└── index.css                   # Tailwind imports
```

## Cách sử dụng

### Đăng ký với Email
1. Click nút "Đăng ký"
2. Điền thông tin: tên đăng nhập, email, mật khẩu
3. Click "Tạo tài khoản"

### Đăng nhập với Google
1. Click nút "Đăng ký" để mở modal
2. Click "Tiếp tục với Google"
3. Chọn tài khoản Google và xác nhận

## Tính năng của GoogleLoginButton

- **Tự động load Google SDK**: Component tự động tải Google Sign-In SDK nếu chưa có
- **Handle authentication**: Xử lý toàn bộ quy trình đăng nhập Google
- **Error handling**: Xử lý lỗi và hiển thị thông báo phù hợp
- **Responsive**: Giao diện responsive trên mọi thiết bị
- **Customizable**: Có thể custom className và callback functions

### Props của GoogleLoginButton

```jsx
<GoogleLoginButton 
  onSuccess={handleGoogleSuccess}    // Callback khi đăng nhập thành công
  onError={handleGoogleError}        // Callback khi có lỗi
  className="custom-class"           // CSS class tùy chỉnh
/>
```

## Customization

### Thay đổi giao diện
Chỉnh sửa Tailwind classes trong các component hoặc thêm custom CSS trong `App.css`

### Thêm API thật
Trong `src/lib/api.js`, uncomment các phần API thật và comment các phần mock:

```javascript
// Thay đổi từ mock thành API thật
async register(userData) {
  return this.request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}
```

### Thêm tính năng mới
- Tạo component mới trong `src/components/`
- Thêm state mới vào `authStore.js`
- Thêm API endpoint mới vào `api.js`

## Troubleshooting

### Lỗi Google Client ID
- Kiểm tra file `.env` có đúng REACT_APP_GOOGLE_CLIENT_ID
- Verify domain trong Google Cloud Console
- Restart development server sau khi thay đổi .env

### Lỗi CORS
- Thêm domain vào Authorized origins trong Google Cloud Console
- Kiểm tra API_URL trong .env

### Style không hiển thị
- Kiểm tra Tailwind CSS đã được cài đặt
- Verify file `tailwind.config.js`
- Restart development server

## Technologies

- **React 18** - UI library
- **Tailwind CSS** - Styling framework
- **Zustand** - State management
- **Lucide React** - Icons
- **Google Identity Services** - OAuth authentication

## License

MIT License