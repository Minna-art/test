import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Regular registration
  async register(userData) {
    try {
      const response = await this.client.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }

  // Regular login
  async login(credentials) {
    try {
      const response = await this.client.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }

  // Google OAuth registration/login
  async googleAuth(googleData) {
    try {
      const response = await this.client.post('/auth/google', {
        token: googleData.token,
        user: googleData.user
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng nhập Google thất bại');
    }
  }

  // Get user profile
  async getUserProfile() {
    try {
      const response = await this.client.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
  }

  // Logout
  async logout() {
    try {
      await this.client.post('/auth/logout');
      localStorage.removeItem('authToken');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('authToken');
      return { success: true }; // Always succeed locally
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await this.client.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Xác thực email thất bại');
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const response = await this.client.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gửi email reset mật khẩu thất bại');
    }
  }
}

export default new ApiService();