import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../BoardDetail.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

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
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isScrapped, setIsScrapped] = useState(false);
  const isFirstRender = useRef(true);

  // 게시글 불러오기
  const getPost = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === "SU") {
        setPost(response.data);
        setIsLiked(response.data.isFavorite);
        setIsScrapped(response.data.isScrap);
      } else {
        setError("게시글을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      setError("게시글을 불러오는데 실패했습니다.");
      console.error("게시글 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 댓글 목록 불러오기
  const getComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/posts/${id}/comment-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.code === "SU") {
        setComments(response.data.commentList || []);
      }
    } catch (err) {
      console.error("댓글을 불러오는데 실패했습니다:", err);
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/posts/${id}/comments`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.code === "SU") {
        setComments([...comments, response.data]);
        setNewComment("");
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  // 게시글 데이터 로드
  useEffect(() => {
    if (id && isFirstRender.current) {
      getPost();
      getComments();
      isFirstRender.current = false;
    }
  }, [id]);

  // 좋아요 토글
  const handleLike = async () => {
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
        setIsLiked(!isLiked);
        setPost((prev) => ({
          ...prev,
          favoriteCount: isLiked
            ? prev.favoriteCount - 1
            : prev.favoriteCount + 1,
        }));
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

  // 스크랩 토글
  const handleScrap = async () => {
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
        setIsScrapped(!isScrapped);
        setPost((prev) => ({
          ...prev,
          scrapCount: isScrapped ? prev.scrapCount - 1 : prev.scrapCount + 1,
        }));
      }
    } catch (error) {
      console.error("스크랩 처리 실패:", error);
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
      navigate("/map", { state: { places: post.places } });
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="detail-loading">
        <div className="detail-spinner"></div>
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className="detail-error">
        <p>{error}</p>
        <button onClick={() => navigate("/board")}>목록으로 돌아가기</button>
      </div>
    );
  }

  // 게시글이 아예 없을 경우 (404 등)
  if (!post) {
    return (
      <div className="detail-error">
        <p>게시글을 찾을 수 없습니다.</p>
        <button onClick={() => navigate("/board")}>목록으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <div className="detail-title">
          <h1>{post.title}</h1>
          <div className="detail-meta">
            <div className="detail-author">
              <img
                src={post.writerProfileImage || "/datepick_logo.png"}
                alt="프로필"
                className="detail-profile"
              />
              <span className="detail-name">{post.writerNickname}</span>
            </div>
            <div className="detail-stats">
              <span>👁️ {post.viewCount}</span>
              <span>❤️ {post.likeCount}</span>
              <span>📌 {post.scrapCount}</span>
              <span>💬 {post.commentCount}</span>
            </div>
          </div>
        </div>
        <div className="detail-actions">
          <button
            className={`detail-button ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
          >
            {isLiked ? "❤️ 좋아요" : "🤍 좋아요"}
          </button>
          <button
            className={`detail-button ${isScrapped ? "scrapped" : ""}`}
            onClick={handleScrap}
          >
            {isScrapped ? "📌 스크랩됨" : "📌 스크랩"}
          </button>
        </div>
      </div>

      {post.images && post.images.length > 0 && (
        <div className="detail-images">
          <h3>첨부된 이미지</h3>
          <div className="detail-image-grid">
            {post.images.map((image, index) => (
              <div key={index} className="detail-image-item">
                <img src={image} alt={`첨부된 이미지 ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="detail-content">
        <div className="detail-text">{post.content}</div>
      </div>

      {post.places && post.places.length > 0 && (
        <div className="detail-places">
          <h3>방문 장소</h3>
          <div className="detail-places-list">
            {post.places.map((place, index) => (
              <div key={index} className="detail-place-card">
                <h4>{place.title}</h4>
                <p>{place.address}</p>
                {place.roadAddress && <p>{place.roadAddress}</p>}
                {place.category && <p className="detail-category">{place.category}</p>}
              </div>
            ))}
          </div>
          <button 
            onClick={handleViewOnMap}
            className="detail-map-button"
          >
            지도에서 보기
          </button>
        </div>
      )}

      <div className="detail-comments">
        <h3>댓글</h3>
        <form onSubmit={handleCommentSubmit} className="detail-comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
            className="detail-comment-input"
          />
          <button type="submit" className="detail-comment-submit">
            댓글 작성
          </button>
        </form>

        <div className="detail-comments-list">
          {comments.map((comment) => (
            <div key={comment.commentId} className="detail-comment-item">
              <div className="detail-comment-header">
                <img
                  src={comment.profileImage || "/datepick_logo.png"}
                  alt="프로필"
                  className="detail-comment-profile"
                />
                <span className="detail-comment-author">{comment.nickName}</span>
                <span className="detail-comment-date">{comment.writeDateTime}</span>
              </div>
              <p className="detail-comment-content">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-navigation">
        <button onClick={() => navigate("/board")} className="detail-back-button">
          목록으로
        </button>
      </div>
    </div>
  );
};

export default BoardDetail;
