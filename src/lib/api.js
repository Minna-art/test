const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  }

  // Auth endpoints
  async register(userData) {
    // Simulate API call for demo purposes
    // In production, replace this with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate registration validation
        if (userData.email === 'test@example.com') {
          reject(new Error('Email đã được sử dụng'));
          return;
        }

        const user = {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          avatar: null,
          createdAt: new Date().toISOString(),
        };

        const token = 'mock_token_' + Date.now();

        resolve({
          status: 'success',
          user,
          token,
          message: 'Đăng ký thành công',
        });
      }, 1000); // Simulate network delay
    });

    // Uncomment this for actual API calls:
    // return this.request('/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify(userData),
    // });
  }

  async login(credentials) {
    // Simulate API call for demo purposes
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock login validation
        if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
          const user = {
            id: 1,
            username: 'Admin User',
            email: credentials.email,
            avatar: null,
          };

          const token = 'mock_token_' + Date.now();

          resolve({
            status: 'success',
            user,
            token,
            message: 'Đăng nhập thành công',
          });
        } else {
          reject(new Error('Email hoặc mật khẩu không đúng'));
        }
      }, 1000);
    });

    // Uncomment this for actual API calls:
    // return this.request('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify(credentials),
    // });
  }

  async googleAuth(credential) {
    // Handle Google authentication
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Other API methods can be added here
  async getBooks() {
    return this.request('/books');
  }

  async getBook(id) {
    return this.request(`/books/${id}`);
  }
}

const apiService = new ApiService();
export default apiService;