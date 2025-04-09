import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ type }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{type === "login" ? "로그인" : "회원가입"}</h2>
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="PW"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button onClick={() => alert(`${type} 시도`)}>{type === "login" ? "LOGIN" : "REGISTER"}</button>
        <div className="switch-text">
          {type === "login" ? (
            <span>
              계정이 없으신가요?{" "}
              <button onClick={() => navigate("/register")}>회원가입</button>
            </span>
          ) : (
            <span>
              이미 계정이 있으신가요?{" "}
              <button onClick={() => navigate("/")}>로그인</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
