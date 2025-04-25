import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../assets/weatherPickLogo.png";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="login-wrapper">
      <img src={logo} alt="Wether Logo" className="login-logo" />

      <h2 className="login-title">로그인</h2>

      <form action="/login" method="post" className="login-form">
        <input type="text" name="username" placeholder="ID" required />
        <input type="password" name="password" placeholder="PW" required />
        <button type="submit" className="login-button">로그인</button>
        <div className="or-divider">or</div>
        <button type="button" className="kakao-button">카카오 로그인</button>
      </form>

      <div className="signup-link">
        계정이 없으신가요?{" "}
        <button onClick={() => navigate("/register")}>회원가입</button>
      </div>
    </div>
  );
}
