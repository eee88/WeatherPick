import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "../Mypage.css";
import defaultProfile from "../assets/weatherPickMy.png";

Modal.setAppElement("#root");

const Mypage = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [isLikedModalOpen, setLikedModalOpen] = useState(false);

  useEffect(() => {
    fetchUserInfo();
    fetchUserActivity();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get("http://localhost:8080/user/me");
      setUserInfo(res.data);
    } catch (error) {
      console.error("유저 정보 불러오기 실패", error);
    }
  };

  const fetchUserActivity = async () => {
    try {
      const [reviews, comments, likes] = await Promise.all([
        axios.get("http://localhost:8080/reviews/me"),
        axios.get("http://localhost:8080/comments/me"),
        axios.get("http://localhost:8080/likes/me"),
      ]);
      setMyReviews(reviews.data);
      setMyComments(comments.data);
      setLikedPosts(likes.data);
    } catch (error) {
      console.error("활동 내역 불러오기 실패", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserInfo({ ...userInfo, profileImage: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.entries(userInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.put("http://localhost:8080/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("정보가 수정되었습니다.");
    } catch (error) {
      console.error("정보 수정 실패", error);
      alert("수정 실패");
    }
  };

  const goToPost = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:8080/board/${postId}`);
      if (res.status === 200) {
        navigate(`/board/${postId}`);
      } else {
        throw new Error();
      }
    } catch {
      alert("해당 게시물이 삭제되었거나 존재하지 않습니다.");
    }
  };

  return (
    <div className="mypage-wrapper">
      <div className="mypage-content">
        <div className="profile-image-container">
          <img
            src={preview || defaultProfile}
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
              <input
                name="name"
                value={userInfo.name}
                onChange={handleInputChange}
                placeholder="이름"
              />
              <input
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                placeholder="이메일"
              />
              <input
                name="username"
                value={userInfo.username}
                onChange={handleInputChange}
                placeholder="아이디"
              />
              <input
                name="phone"
                value={userInfo.phone}
                onChange={handleInputChange}
                placeholder="전화번호"
              />
              <input
                name="password"
                type="password"
                value={userInfo.password}
                onChange={handleInputChange}
                placeholder="비밀번호"
              />
            </div>
            <div className="right-links">
              <p onClick={() => setReviewModalOpen(true)}>내가 쓴 리뷰</p>
              {/* <p>자기가 추천 글 올린 목록</p> */}
              <p onClick={() => setCommentModalOpen(true)}>작성한 댓글</p>
              <p onClick={() => setLikedModalOpen(true)}>추천한 글 목록</p>
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
        <ul>
          {myReviews.map((review) => (
            <li key={review.id} onClick={() => goToPost(review.id)}>
              {review.title}
            </li>
          ))}
        </ul>
        <button onClick={() => setReviewModalOpen(false)}>닫기</button>
      </Modal>

      <Modal
        isOpen={isCommentModalOpen}
        onRequestClose={() => setCommentModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>내 댓글</h2>
        <ul>
          {myComments.map((comment) => (
            <li key={comment.id} onClick={() => goToPost(comment.postId)}>
              {comment.body}
            </li>
          ))}
        </ul>
        <button onClick={() => setCommentModalOpen(false)}>닫기</button>
      </Modal>

      <Modal
        isOpen={isLikedModalOpen}
        onRequestClose={() => setLikedModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>추천한 글</h2>
        <ul>
          {likedPosts.map((post) => (
            <li key={post.id} onClick={() => goToPost(post.id)}>
              {post.title}
            </li>
          ))}
        </ul>
        <button onClick={() => setLikedModalOpen(false)}>닫기</button>
      </Modal>
    </div>
  );
};

export default Mypage;
