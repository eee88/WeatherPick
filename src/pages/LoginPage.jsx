import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../App.css";
import logo from "../assets/datepick_logoMain.png";

const API_URL = process.env.REACT_APP_API_URL;

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    try {
      const response = await axios.post(
        `${API_URL}/api/user/login`,
        {
          username: formData.username,
          password: formData.password,
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
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("tokenExpiration", response.data.expirationTime);
        navigate("/board");
      } else {
        setError(response.data.massage || "로그인 정보를 다시 확인하세요");
      }
    } catch (err) {
      console.error("로그인 에러 상세:", err);
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="login-wrapper">
      <img src={logo} alt="Weather Logo" className="login-logo" />

      <h2 className="login-title">로그인</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="ID"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="PW"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">
          로그인
        </button>
        <div className="or-divider">or</div>
        <button type="button" className="kakao-button">
          카카오 로그인
        </button>
      </form>

      <div className="signup-link">
        계정이 없으신가요?{" "}
        <button onClick={() => navigate("/register")}>회원가입</button>
      </div>
    </div>
  );
}
