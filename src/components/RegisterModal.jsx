import React, { useState } from "react";
import useAuthStore from "../store/authStore";
import apiService from "../lib/api";
import googleAuthService from "../lib/googleAuth";
import { X, Eye, EyeOff, UserPlus, User, Lock, Mail, BookOpen } from "lucide-react";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, setLoading, setError, clearError, isLoading: authLoading, error: authError } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Vui lòng nhập email hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await apiService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (response.status === "success") {
        login(response.user, response.token);
        onClose();
        // Clear form
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
        alert("Đăng ký thành công! Chào mừng đến với Thư Viện Web!");
      }
    } catch (error) {
      setError(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
    
    try {
      // Sign in with Google
      const googleResult = await googleAuthService.signIn();
      
      if (!googleResult.success) {
        throw new Error(googleResult.error);
      }

      // Send Google data to backend for registration/login
      const response = await apiService.googleAuth(googleResult);
      
      if (response.status === "success") {
        login(response.user, response.token);
        onClose();
        
        // Show different message based on whether it's new user or existing
        const message = response.isNewUser 
          ? "Đăng ký thành công bằng Google! Chào mừng đến với Thư Viện Web!"
          : "Đăng nhập thành công bằng Google!";
        alert(message);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error.message || "Đăng nhập Google thất bại. Vui lòng thử lại.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-8 border-b border-gray-100">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-t-3xl"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Tạo tài khoản</h2>
                <p className="text-sm text-gray-500">Tham gia cộng đồng thư viện của chúng tôi</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Google Sign In Button - Moved to top */}
          <button 
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || authLoading}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98] mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Tiếp tục với Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">hoặc</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tên đăng nhập
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${
                    errors.username 
                      ? 'border-red-500 focus:ring-red-100 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-green-100 focus:border-green-500'
                  }`}
                  placeholder="Chọn tên đăng nhập"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">•</span>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-100 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-green-100 focus:border-green-500'
                  }`}
                  placeholder="Nhập email của bạn"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">•</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Mật khẩu
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-100 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-green-100 focus:border-green-500'
                  }`}
                  placeholder="Tạo mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">•</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-100 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-green-100 focus:border-green-500'
                  }`}
                  placeholder="Xác nhận mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">•</span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start space-x-3">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Tôi đồng ý với{" "}
                <button type="button" className="text-green-600 hover:text-green-800 font-medium transition-colors">
                  Điều khoản sử dụng
                </button>{" "}
                và{" "}
                <button type="button" className="text-green-600 hover:text-green-800 font-medium transition-colors">
                  Chính sách bảo mật
                </button>
              </label>
            </div>

            {/* Error display */}
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {authError}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={authLoading || isGoogleLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {authLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Tạo tài khoản</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to login */}
          <p className="text-center mt-8 text-gray-600">
            Đã có tài khoản?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-green-600 hover:text-green-800 font-semibold transition-colors"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;