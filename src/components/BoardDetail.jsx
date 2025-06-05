import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Board.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";


//  GET /api/posts/{id}             : 특정 게시글 상세 조회
//   Response → { id, title, body, writer, writingTime, placeList: [...], viewCount, … }
//  DELETE /api/posts/{id}          : 특정 게시글 삭제


const API_URL = process.env.REACT_APP_API_URL;

// TM128 좌표를 위경도로 변환하는 함수
const convertToLatLng = (x, y) => {
  return [y / 10000000, x / 10000000];
};

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);

  // 게시글 불러오기
  const getPost = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.code === "SU") {
        setPost(response.data);
      } else {
        setError("게시글을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("BoardDetail: 불러오지 못했습니다.", err);
      setError("게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, [id]);

  // 좋아요 토글
  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/posts/${id}/favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.code === "SU") {
        setPost(prev => ({
          ...prev,
          favoriteCount: response.data.favoriteCount
        }));
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 스크랩 토글
  const toggleScrap = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/posts/${id}/scrap`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.code === "SU") {
        setPost(prev => ({
          ...prev,
          scrapCount: response.data.scrapCount
        }));
      }
    } catch (err) {
      console.error("스크랩 처리 실패:", err);
      alert("스크랩 처리에 실패했습니다.");
    }
  };

  // 버튼 액션
  const moveToEdit = () => {
    navigate(`/edit/${id}`);
  };

  const deletePost = async () => {
    const token = localStorage.getItem("token");
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${API_URL}/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("게시글이 삭제되었습니다.");
        navigate("/board");
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const moveToBoard = () => {
    navigate("/board");
  };

  const handleViewOnMap = () => {
    if (post.places && post.places.length > 0) {
      navigate('/map', { state: { places: post.places } });
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="board-container">
        <p>로딩 중...</p>
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className="board-container">
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={moveToBoard}>목록으로 돌아가기</button>
      </div>
    );
  }

  // 게시글이 아예 없을 경우 (404 등)
  if (!post) {
    return (
      <div className="board-container">
        <p>존재하지 않는 게시글입니다.</p>
        <button onClick={moveToBoard}>목록으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="board-container">
      {/* 게시글 상세 카드 */}
      <div className="board-detail">
        <h1 className="board-detail-title">{post.title}</h1>
        <div className="board-detail-info">
          <span>작성자: {post.writerNickname}</span>
          <span style={{ marginLeft: "1rem", color: "gray" }}>
            작성일: {post.writeDate}
          </span>
        </div>
        <hr />

        {/* 장소 목록 */}
        {post.places && post.places.length > 0 && (
          <div className="board-detail-places">
            <h3>방문 장소</h3>
            <ul>
              {post.places.map((place, index) => (
                <li key={index} className="place-item">
                  <div className="place-title">
                    <span className="place-number">{index + 1}</span> 📍 {place.title}
                  </div>
                  <div className="place-address">{place.address}</div>
                  {place.roadAddress && (
                    <div className="place-road-address">(도로명: {place.roadAddress})</div>
                  )}
                </li>
              ))}
            </ul>
            <button 
              onClick={handleViewOnMap}
              style={{
                backgroundColor: '#2d8cff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px',
                fontSize: '14px'
              }}
            >
              지도에서 보기
            </button>
          </div>
        )}

        {/* 본문 내용 */}
        <div className="board-detail-content">
          <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
            {post.content}
          </p>
        </div>

        {/* 통계 정보 */}
        <div className="board-detail-stats">
          <button onClick={toggleFavorite} className="stat-button">
            ❤️ {post.favoriteCount}
          </button>
          <span>👁️ {post.viewCount}</span>
          <button onClick={toggleScrap} className="stat-button">
            📌 {post.scrapCount}
          </button>
          <span>💬 {post.commentCount}</span>
        </div>

        {/* 버튼 그룹 */}
        <div className="board-detail-buttons">
          <button onClick={moveToBoard}>목록으로</button>
          <button onClick={moveToEdit}>수정하기</button>
          <button onClick={deletePost} style={{ color: "red" }}>삭제하기</button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
