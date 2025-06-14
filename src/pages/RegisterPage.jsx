import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../assets/datepick_logoMain.png";
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

  const [validation, setValidation] = useState({
    username: { isValid: false, message: "아이디 중복 확인이 필요합니다" },
    nickname: { isValid: false, message: "닉네임 중복 확인이 필요합니다" },
    email: { isValid: false, message: "이메일 중복 확인이 필요합니다" }
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 입력 필드가 비어있을 때 validation 메시지 초기화
    if (!value) {
      if (name === "username") {
        setValidation(prev => ({ ...prev, username: { isValid: false, message: "아이디를 입력해주세요" } }));
      } else if (name === "nickname") {
        setValidation(prev => ({ ...prev, nickname: { isValid: false, message: "닉네임을 입력해주세요" } }));
      } else if (name === "email") {
        setValidation(prev => ({ ...prev, email: { isValid: false, message: "이메일을 입력해주세요" } }));
      }
    }
  };

  const checkUsername = async () => {
    if (!formData.username) {
      setValidation(prev => ({ ...prev, username: { isValid: false, message: "아이디를 입력해주세요" } }));
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/user/check-username?username=${formData.username}`);
      if (response.data.exists) {
        setValidation(prev => ({ ...prev, username: { isValid: false, message: "이미 사용 중인 아이디입니다" } }));
      } else {
        setValidation(prev => ({ ...prev, username: { isValid: true, message: "사용 가능한 아이디입니다" } }));
      }
    } catch (error) {
      setValidation(prev => ({ ...prev, username: { isValid: false, message: "중복 확인 중 오류가 발생했습니다" } }));
    }
  };

  const checkNickname = async () => {
    if (!formData.nickname) {
      setValidation(prev => ({ ...prev, nickname: { isValid: false, message: "닉네임을 입력해주세요" } }));
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/user/check-nickname?nickname=${formData.nickname}`);
      if (response.data.exists) {
        setValidation(prev => ({ ...prev, nickname: { isValid: false, message: "이미 사용 중인 닉네임입니다" } }));
      } else {
        setValidation(prev => ({ ...prev, nickname: { isValid: true, message: "사용 가능한 닉네임입니다" } }));
      }
    } catch (error) {
      setValidation(prev => ({ ...prev, nickname: { isValid: false, message: "중복 확인 중 오류가 발생했습니다" } }));
    }
  };

  const checkEmail = async () => {
    if (!formData.email) {
      setValidation(prev => ({ ...prev, email: { isValid: false, message: "이메일을 입력해주세요" } }));
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/user/check-email?email=${formData.email}`);
      if (response.data.exists) {
        setValidation(prev => ({ ...prev, email: { isValid: false, message: "이미 사용 중인 이메일입니다" } }));
      } else {
        setValidation(prev => ({ ...prev, email: { isValid: true, message: "사용 가능한 이메일입니다" } }));
      }
    } catch (error) {
      setValidation(prev => ({ ...prev, email: { isValid: false, message: "중복 확인 중 오류가 발생했습니다" } }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 필수 입력 필드 검사
    if (!formData.username) {
      setValidation(prev => ({ ...prev, username: { isValid: false, message: "아이디를 입력해주세요" } }));
      return;
    }
    if (!formData.password) {
      setError("비밀번호를 입력해주세요");
      return;
    }
    if (!formData.confirmPassword) {
      setError("비밀번호 확인을 입력해주세요");
      return;
    }
    if (!formData.nickname) {
      setValidation(prev => ({ ...prev, nickname: { isValid: false, message: "닉네임을 입력해주세요" } }));
      return;
    }
    if (!formData.email) {
      setValidation(prev => ({ ...prev, email: { isValid: false, message: "이메일을 입력해주세요" } }));
      return;
    }
    if (!formData.name) {
      setError("이름을 입력해주세요");
      return;
    }

    // 비밀번호 일치 검사
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    // 중복 확인 검사
    if (!validation.username.isValid) {
      setValidation(prev => ({ ...prev, username: { isValid: false, message: "아이디 중복 확인이 필요합니다" } }));
      return;
    }
    if (!validation.nickname.isValid) {
      setValidation(prev => ({ ...prev, nickname: { isValid: false, message: "닉네임 중복 확인이 필요합니다" } }));
      return;
    }
    if (!validation.email.isValid) {
      setValidation(prev => ({ ...prev, email: { isValid: false, message: "이메일 중복 확인이 필요합니다" } }));
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

      if (response.data.code === "SU") {
        alert("회원가입이 완료되었습니다!");
        navigate("/");
      } else {
        setError(response.data.message || "회원가입에 실패했습니다");
      }
    } catch (err) {
      console.error("회원가입 에러:", err);
      setError("회원가입에 실패했습니다. 다시 시도해주세요");
    }
  };

  return (
    <div className="login-wrapper">
      <img src={logo} alt="Weather Logo" className="login-logo" />
      <h2 className="login-title">회원가입</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">아이디</label>
          <div className="input-group">
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
            />
            <button 
              type="button" 
              onClick={checkUsername}
              className="check-button"
            >
              중복확인
            </button>
          </div>
          <p className={`validation-message ${validation.username.isValid ? "success" : "error"}`}>
            {validation.username.message}
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <div className="input-group">
            <input
              id="nickname"
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
            />
            <button 
              type="button" 
              onClick={checkNickname}
              className="check-button"
            >
              중복확인
            </button>
          </div>
          <p className={`validation-message ${validation.nickname.isValid ? "success" : "error"}`}>
            {validation.nickname.message}
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <div className="input-group">
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
            />
            <button 
              type="button" 
              onClick={checkEmail}
              className="check-button"
            >
              중복확인
            </button>
          </div>
          <p className={`validation-message ${validation.email.isValid ? "success" : "error"}`}>
            {validation.email.message}
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phonenumber">전화번호</label>
          <input
            id="phonenumber"
            type="tel"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            placeholder="전화번호를 입력하세요 (010-1234-5678)"
            pattern="^\d{3}-\d{4}-\d{4}$"
          />
        </div>

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
