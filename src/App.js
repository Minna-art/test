import React, { useState, useEffect } from 'react';
import RegisterModal from './components/RegisterModal';
import useAuthStore from './store/authStore';
import { BookOpen, LogOut, User } from 'lucide-react';
import './App.css';

function App() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAuthenticated, logout, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    initializeAuth();
  }, [initializeAuth]);

  const handleLogout = () => {
    logout();
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Thư Viện Web</h1>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user?.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.username} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User size={16} />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      Xin chào, {user?.username}!
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <BookOpen size={48} className="text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chào mừng đến với Thư Viện Web
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Khám phá thế giới kiến thức với hàng nghìn cuốn sách điện tử, tài liệu học tập và nhiều tài nguyên hữu ích khác.
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Bắt đầu ngay
              </button>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-xl hover:bg-green-50 transition-all duration-200 font-semibold text-lg"
              >
                Đã có tài khoản
              </button>
            </div>
          )}

          {isAuthenticated && (
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tài khoản của bạn
              </h2>
              <div className="space-y-3 text-left">
                <div>
                  <span className="text-sm font-medium text-gray-500">Tên:</span>
                  <p className="text-gray-900">{user?.username}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Phương thức đăng nhập:</span>
                  <p className="text-gray-900 capitalize">
                    {user?.provider === 'google' ? 'Google' : 'Email/Password'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Thư viện phong phú</h3>
            <p className="text-gray-600">Hàng nghìn cuốn sách và tài liệu học tập chất lượng cao</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Đăng nhập dễ dàng</h3>
            <p className="text-gray-600">Đăng nhập bằng Google hoặc tạo tài khoản nhanh chóng</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Trải nghiệm tốt</h3>
            <p className="text-gray-600">Giao diện hiện đại, responsive trên mọi thiết bị</p>
          </div>
        </div>
      </main>

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* Simple Login Modal (you can create a similar LoginModal component) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng nhập</h2>
            <p className="text-gray-600 text-center mb-6">
              Tính năng đăng nhập sẽ được triển khai tương tự RegisterModal
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={handleSwitchToRegister}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;