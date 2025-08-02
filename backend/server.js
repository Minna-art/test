const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage (use database in production)
const users = [];

// Helper functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

const findUserById = (id) => {
  return users.find(user => user.id === id);
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Regular registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Tất cả các trường đều bắt buộc'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Check if user exists
    if (findUserByEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Email đã được sử dụng'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      provider: 'local'
    };

    users.push(user);

    // Generate token
    const token = generateToken(user);

    // Return response (don't include password)
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      status: 'success',
      message: 'Đăng ký thành công',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server'
    });
  }
});

// Regular login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email và mật khẩu là bắt buộc'
      });
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user || user.provider !== 'local') {
      return res.status(401).json({
        status: 'error',
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return response (don't include password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      status: 'success',
      message: 'Đăng nhập thành công',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server'
    });
  }
});

// Google OAuth
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token, user: googleUser } = req.body;

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Google token is required'
      });
    }

    // Verify Google token
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      console.error('Google token verification failed:', error);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid Google token'
      });
    }

    const payload = ticket.getPayload();
    const email = payload.email;

    // Check if user already exists
    let user = findUserByEmail(email);
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      user = {
        id: users.length + 1,
        username: googleUser.name || payload.name,
        email: email,
        picture: googleUser.picture || payload.picture,
        provider: 'google',
        googleId: payload.sub,
        createdAt: new Date()
      };
      users.push(user);
    }

    // Generate JWT token
    const jwtToken = generateToken(user);

    res.json({
      status: 'success',
      message: isNewUser ? 'Đăng ký thành công bằng Google' : 'Đăng nhập thành công bằng Google',
      user,
      token: jwtToken,
      isNewUser
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server'
    });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  const { password, ...userWithoutPassword } = user;
  res.json({
    status: 'success',
    user: userWithoutPassword
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({
    status: 'success',
    message: 'Đăng xuất thành công'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;