import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../assets/datepick_logo1.png";
import axios from "axios";
import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    email: "",
    name: "",
    phonenumber: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/user/join`,
        {
          username: formData.username,
          password: formData.password,
          nickname: formData.nickname,
          email: formData.email,
          name: formData.name,
          phonenumber: formData.phonenumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("HTTP 상태 코드:", response.status);
      console.log("서버 응답:", response.data);

      if (response.data.code === "SU") {
        navigate("/");
      } else {
        setError(response.data.massage || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      console.error("회원가입 에러 상세:", err);
      console.log("에러 응답 데이터:", err.response?.data);
      console.log("에러 상태 코드:", err.response?.status);
      console.log("전체 에러 응답:", err.response);
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="login-wrapper">
      <img src={logo} alt="Weather Logo" className="login-logo" />

      <h2 className="login-title">회원가입</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="아이디 (username)"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="비밀번호 (password)"
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="비밀번호 확인 (confirm-password)"
        />
        <input
          type="text"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
          required
          placeholder="닉네임 (nickname)"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="이메일 (email)"
        />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="이름 (name)"
        />
        <input
          type="tel"
          name="phonenumber"
          value={formData.phonenumber}
          onChange={handleChange}
          required
          placeholder="전화번호 (010-1234-5678)"
          pattern="^\d{3}-\d{4}-\d{4}$"
        />

        <button type="submit" className="login-button">
          회원가입
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="signup-link">
        이미 계정이 있으신가요?{" "}
        <button onClick={() => navigate("/")}>로그인</button>
      </div>
    </div>
  );
}
