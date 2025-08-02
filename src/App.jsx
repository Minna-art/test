import React, { useState, useEffect } from 'react';
import RegisterModal from './components/RegisterModal';
import useAuthStore from './store/authStore';
import './App.css';

function App() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { user, logout, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage on app load
    initialize();
  }, [initialize]);

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    // Here you would open login modal
    alert('Chức năng đăng nhập sẽ được thêm sau');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Thư Viện Web</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Xin chào, {user.username}!</span>
                  {user.avatar && (
                    <img 
                      src={user.avatar} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Đăng ký
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Chào mừng đến với Thư Viện Web
          </h2>
          {!user ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Đăng ký để truy cập vào thư viện sách trực tuyến của chúng tôi
              </p>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                Bắt đầu ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Bạn đã đăng nhập thành công! Khám phá thư viện của chúng tôi.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Sách mới</h3>
                  <p className="text-gray-600">Khám phá những cuốn sách mới nhất</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Sách phổ biến</h3>
                  <p className="text-gray-600">Những cuốn sách được yêu thích nhất</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Thể loại</h3>
                  <p className="text-gray-600">Duyệt theo thể loại sách</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}

export default App;