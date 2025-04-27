import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../assets/weatherPickLogo.png";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="login-wrapper">
      <img src={logo} alt="Wether Logo" className="login-logo" />

      <h2 className="login-title">회원가입</h2>

      <form
        id="joinForm"
        action="/user/join"
        method="post"
        name="joinForm"
        className="login-form"
      >
        <input
          type="text"
          name="username"
          id="username"
          required
          placeholder="아이디 (username)"
        />
        <input
          type="password"
          name="password"
          id="password"
          required
          placeholder="비밀번호 (password)"
        />
        <input
          type="password"
          name="confirm-password"
          id="confirm-password"
          required
          placeholder="비밀번호 확인 (confirm-password)"
        />
        <input
          type="text"
          name="nickname"
          id="nickname"
          required
          placeholder="닉네임 (nickname)"
        />
        <input
          type="email"
          name="email"
          id="email"
          required
          placeholder="이메일 (email)"
        />
        <input
          type="text"
          name="name"
          id="name"
          required
          placeholder="이름 (name)"
        />
        <input
          type="text"
          name="sex"
          id="sex"
          required
          placeholder="성별 (sex)"
        />
        <input
          type="tel"
          name="phonenumber"
          id="phonenumber"
          required
          placeholder="전화번호 (010-1234-5678)"
          pattern="^\d{3}-\d{4}-\d{4}$"
        />

        <button type="submit" className="login-button">
          회원가입
        </button>
        <p id="error-message" style={{ color: "red", fontSize: "12px" }}></p>
      </form>

      <div className="signup-link">
        이미 계정이 있으신가요?{" "}
        <button onClick={() => navigate("/")}>로그인</button>
      </div>
    </div>
  );
}
