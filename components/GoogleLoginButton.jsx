import React, { useEffect, useRef } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore"; // 1. Import store

const GoogleLoginButton = ({ onSuccess }) => {
  const login = useAuthStore((state) => state.login); // 2. Lấy action login
  const buttonRef = useRef(null);

  async function handleCredentialResponse(response) {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google-login",
        {
          credential: response.credential,
        }
      );

      // 3. Gọi action login với dữ liệu từ backend
      login(res.data.user, res.data.token);

      alert("Đăng nhập bằng Google thành công!");
      
      // 4. Gọi callback onSuccess nếu được cung cấp
      if (onSuccess) {
        onSuccess(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi gửi token đến backend:", error);
      alert("Đăng nhập bằng Google thất bại.");
    }
  }

  useEffect(() => {
    if (window.google && buttonRef.current) {
      window.google.accounts.id.initialize({
        client_id:
          "145225515731-i1u67913d3k5oksk1b4djd61vrofvucp.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        buttonRef.current,
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  return <div ref={buttonRef}></div>;
};

export default GoogleLoginButton;