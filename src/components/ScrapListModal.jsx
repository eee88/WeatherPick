import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ScrapListModal = ({ isOpen, onClose, username }) => {
  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScraps = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("인증 토큰이 없습니다.");
          navigate("/");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/scraps/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data.code === "SU") {
          setScraps(response.data.scraps || []);
        } else {
          setError(response.data.message || "스크랩 목록을 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("스크랩 목록을 가져오는데 실패했습니다:", error);
        setError("스크랩 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchScraps();
    }
  }, [isOpen, username, navigate]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>스크랩한 글</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="loading-container">
              <p>로딩 중...</p>
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : scraps.length === 0 ? (
            <div className="empty-scrap-container">
              <p>아직 스크랩한 글이 없습니다.</p>
              <p className="empty-scrap-sub">관심 있는 글을 스크랩해보세요!</p>
            </div>
          ) : (
            <ul className="scrap-list">
              {scraps.map((scrap) => (
                <li key={scrap.reviewPostId} className="scrap-item">
                  <a href={`/board/${scrap.reviewPostId}`} className="scrap-link">
                    <span className="scrap-title">{scrap.title}</span>
                    <span className="scrap-arrow">→</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrapListModal; 