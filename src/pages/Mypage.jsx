import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "../Mypage.css";
import defaultProfile from "../assets/weatherPickMy.png";

Modal.setAppElement("#root");

const API_URL = process.env.REACT_APP_API_URL;

const Mypage = () => {
  const navigate = useNavigate();

  // 이전 레이아웃에 맞춘 상태값들 (name, email, username, phone, password, confirmPassword, profileImage)
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "", // 비밀번호 확인 필드 추가
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);

  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [isLikedModalOpen, setLikedModalOpen] = useState(false);

  const [passwordError, setPasswordError] = useState(""); // 비밀번호 오류 메시지 상태 추가

  // 내가 쓴 유저 정보 (username, nickname, profileImage 등) 불러오는 함수
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("토큰이 없습니다.");
        return;
      }

      // JWT 토큰에서 username 추출
      const payload = JSON.parse(atob(token.split('.')[1]));
      const username = payload.sub;  // sub 필드에서 username 추출
      if (!username) {
        console.error("토큰에서 username을 찾을 수 없습니다.");
        return;
      }

      const res = await axios.get(`${API_URL}/api/user/${username}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.data.code === 'SU') {
        setUserInfo({
          name: res.data.nickname || "",
          email: res.data.email || "",
          username: res.data.username,
          phone: res.data.phonenumber || "",
          password: "", // 비밀번호는 보안 상 초기값으로 비워둡니다.
          confirmPassword: "", // 비밀번호 확인 필드 초기값으로 비워둡니다.
          profileImage: res.data.profileImage,
        });
      }
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    
    // 비밀번호 확인 로직
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

  // 프로필/닉네임/이메일/전화번호/비밀번호 변경 시 처리
  const handleUpdate = async () => {
    try {
      // 비밀번호 일치 여부 확인
      if (userInfo.password !== userInfo.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
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
      // 프로필 이미지가 File 객체인 경우에만 추가
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

      if (response.data.code === 'SU') {
        // 업데이트된 정보로 상태 갱신
        setUserInfo(prev => ({
          ...prev,
          nickname: response.data.nickname,
          email: response.data.email,
          phone: response.data.phonenumber,
          profileImage: response.data.profileImage,
          password: "", // 비밀번호 필드 초기화
          confirmPassword: "" // 비밀번호 확인 필드 초기화
        }));
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
            onClick={() =>
              document.getElementById("profileImageInput").click()
            }
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  닉네임
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  placeholder="닉네임"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  이메일
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  placeholder="이메일"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  아이디
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                  id="username"
                  type="text"
                  value={userInfo.username}
                  disabled
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  전화번호
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phone"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  placeholder="전화번호"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  새 비밀번호
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  name="password"
                  type="password"
                  value={userInfo.password}
                  onChange={handleInputChange}
                  placeholder="새 비밀번호"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  새 비밀번호 확인
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    passwordError ? "border-red-500" : ""
                  }`}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={userInfo.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="새 비밀번호 확인"
                />
                {passwordError && (
                  <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>
                )}
              </div>
            </div>
            <div className="right-links">
              <p onClick={() => setReviewModalOpen(true)}>내가 쓴 리뷰</p>
              <p onClick={() => setCommentModalOpen(true)}>작성한 댓글</p>
              <p onClick={() => setLikedModalOpen(true)}>
                스크랩한 글 목록
              </p>
            </div>
          </div>
        </div>

        <button className="save-button" onClick={handleUpdate}>
          저장
        </button>
      </div>

      {/* 내가 쓴 리뷰 모달 */}
      <Modal
        isOpen={isReviewModalOpen}
        onRequestClose={() => setReviewModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>내 리뷰</h2>
        <button onClick={() => setReviewModalOpen(false)}>닫기</button>
      </Modal>

      {/* 작성한 댓글 모달 */}
      <Modal
        isOpen={isCommentModalOpen}
        onRequestClose={() => setCommentModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>내 댓글</h2>
        
        <button onClick={() => setCommentModalOpen(false)}>닫기</button>
      </Modal>

      {/* 스크랩한 글 목록 모달 */}
      <Modal
        isOpen={isLikedModalOpen}
        onRequestClose={() => setLikedModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>추천한 글</h2>
        
        <button onClick={() => setLikedModalOpen(false)}>닫기</button>
      </Modal>
    </div>
  );
};

export default Mypage;
