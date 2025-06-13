import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "../Mypage.css";
import defaultProfile from "../assets/datepick_mypage.png";
import ScrapListModal from "../components/ScrapListModal";

Modal.setAppElement("#root");

const API_URL = process.env.REACT_APP_API_URL;

const Mypage = () => {

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [isLikedModalOpen, setLikedModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [nicknameValidation, setNicknameValidation] = useState({ isValid: true, message: "" });
  const [originalNickname, setOriginalNickname] = useState("");

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const username = payload.sub;
      if (!username) return;

      const res = await axios.get(`${API_URL}/api/user/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.code === "SU") {
        setUserInfo({
          name: res.data.nickname || "",
          email: res.data.email || "",
          username: res.data.username,
          phone: res.data.phonenumber || "",
          password: "",
          confirmPassword: "",
          profileImage: res.data.profileImage,
        });
        setOriginalNickname(res.data.nickname || "");
      }
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  };

  const checkNickname = async () => {
    if (userInfo.name === originalNickname) {
      setNicknameValidation({ isValid: true, message: "현재 사용 중인 닉네임입니다." });
      return true;
    }

    try {
      const response = await axios.get(`${API_URL}/api/user/check-nickname?nickname=${userInfo.name}`);
      if (response.data.exists) {
        setNicknameValidation({ isValid: false, message: "이미 사용 중인 닉네임입니다." });
        return false;
      } else {
        setNicknameValidation({ isValid: true, message: "사용 가능한 닉네임입니다." });
        return true;
      }
    } catch (error) {
      console.error("닉네임 중복 확인 중 오류 발생:", error);
      setNicknameValidation({ isValid: false, message: "중복 확인 중 오류가 발생했습니다." });
      return false;
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "name") {
      setNicknameValidation({ isValid: true, message: "" });
    }
    
    setUserInfo((prev) => ({ ...prev, [name]: value }));

    if (name === "password" || name === "confirmPassword") {
      if (name === "password") {
        if (value !== userInfo.confirmPassword && userInfo.confirmPassword !== "") {
          setPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
          setPasswordError("");
        }
      } else {
        if (value !== userInfo.password) {
          setPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
          setPasswordError("");
        }
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserInfo((prev) => ({ ...prev, profileImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      if (userInfo.password !== userInfo.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      if (userInfo.name !== originalNickname && !nicknameValidation.isValid) {
        alert("닉네임 중복 확인이 필요합니다.");
        return;
      }

      const formData = new FormData();
      formData.append("username", userInfo.username);
      formData.append("nickname", userInfo.name);
      formData.append("email", userInfo.email);
      formData.append("phonenumber", userInfo.phone);
      if (userInfo.password.trim() !== "") {
        formData.append("password", userInfo.password);
      }
      if (userInfo.profileImage instanceof File) {
        formData.append("profileImage", userInfo.profileImage);
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/user/${userInfo.username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === "SU") {
        setUserInfo((prev) => ({
          ...prev,
          nickname: response.data.nickname,
          email: response.data.email,
          phone: response.data.phonenumber,
          profileImage: response.data.profileImage,
          password: "",
          confirmPassword: "",
        }));
        setOriginalNickname(response.data.nickname);
        alert("정보가 성공적으로 수정되었습니다.");
      }
    } catch (error) {
      console.error("정보 수정 실패", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  return (
    <div className="mypage-wrapper">
      <div className="mypage-content">
        <div className="profile-image-container">
          <img
            src={preview || userInfo.profileImage || defaultProfile}
            alt="Profile"
            className="profile-image"
          />
          <button
            className="upload-button"
            onClick={() => document.getElementById("profileImageInput").click()}
          >
            +
          </button>
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="upload-input"
          />
        </div>

        <div className="profile-section">
          <div className="info-section">
            <div className="left-inputs">
              <div className="mb-4">
                <label htmlFor="name">닉네임</label>
                <div className="input-group">
                  <input
                    id="name"
                    name="name"
                    value={userInfo.name}
                    onChange={handleInputChange}
                    placeholder="닉네임"
                  />
                  <button 
                    type="button" 
                    onClick={checkNickname}
                    className="check-button"
                  >
                    중복확인
                  </button>
                </div>
                {nicknameValidation.message && (
                  <p className={`validation-message ${nicknameValidation.isValid ? "success" : "error"}`}>
                    {nicknameValidation.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email">이메일</label>
                <input
                  id="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  placeholder="이메일"
                  disabled
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label htmlFor="username">아이디</label>
                <input
                  id="username"
                  type="text"
                  value={userInfo.username}
                  disabled
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone">전화번호</label>
                <input
                  id="phone"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  placeholder="전화번호"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password">새 비밀번호</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={userInfo.password}
                  onChange={handleInputChange}
                  placeholder="새 비밀번호"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={userInfo.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="새 비밀번호 확인"
                />
                {passwordError && <p className="error-text">{passwordError}</p>}
              </div>
            </div>
            <div className="right-links">
              <p onClick={() => setLikedModalOpen(true)}>스크랩한 글 목록</p>
            </div>
          </div>
        </div>

        <button className="save-button" onClick={handleUpdate}>
          저장
        </button>
      </div>

      <Modal
        isOpen={isReviewModalOpen}
        onRequestClose={() => setReviewModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>내 리뷰</h2>
        <button onClick={() => setReviewModalOpen(false)}>닫기</button>
      </Modal>

      <Modal
        isOpen={isCommentModalOpen}
        onRequestClose={() => setCommentModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>내 댓글</h2>
        <button onClick={() => setCommentModalOpen(false)}>닫기</button>
      </Modal>

      <ScrapListModal 
        isOpen={isLikedModalOpen}
        onClose={() => setLikedModalOpen(false)}
        username={userInfo.username}
      />
    </div>
  );
};

export default Mypage;
