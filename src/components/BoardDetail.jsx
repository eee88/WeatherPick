import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../BoardDetail.css";

//  GET /api/posts/{id}             : 특정 게시글 상세 조회
//  GET /api/posts/{id}/comments    : 특정 게시글의 댓글 목록 조회
//  POST /api/posts/{id}/comment    : 특정 게시글에 댓글 작성
//  PUT /api/posts/{id}/favorite    : 특정 게시글 좋아요/취소
//  PUT /api/posts/{id}/scrap       : 특정 게시글 스크랩/취소
//  DELETE /api/posts/{id}          : 특정 게시글 삭제

const API_URL = process.env.REACT_APP_API_URL;

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isScrapped, setIsScrapped] = useState(false);
  const isFirstRender = useRef(true);

  // 게시글 불러오기
  const getPost = useCallback(async () => {
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
  }, [id]);

  // 댓글 목록 불러오기
  const getComments = useCallback(async () => {
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
  }, [id]);

  // 댓글 작성
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/posts/${id}/comment`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.code === "SU") {
        setNewComment("");
        window.location.reload(); // 페이지 새로고침
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
  }, [id, getPost, getComments]);

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
    <div className="board-container">
      {/* 게시글 상세 카드 */}
      <div className="board-detail">
        {/* 제목 섹션 */}
        <div className="board-detail-header">
          <h2>{post.title}</h2>
          <div className="board-detail-meta">
            <div className="writer-info">
              <img 
                src={post.writerProfileImage || "https://via.placeholder.com/30"} 
                alt="프로필" 
                className="writer-profile-image"
              />
              <span>작성자: {post.writerNickname}</span>
            </div>
            <span>작성일: {post.writeDate}</span>
          </div>
        </div>

        {/* 이미지 섹션 */}
        {post.images && post.images.length > 0 && (
          <div className="board-detail-images">
            <h3>첨부된 이미지</h3>
            <div className="image-grid">
              {post.images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image} alt={`첨부된 이미지 ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

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
              className="detail-map-button"
            >
              지도에서 보기
            </button>
          </div>
        )}

        {/* 본문 내용 */}
        <div className="board-detail-content">
          <p>{post.content}</p>
        </div>

        {/* 통계 정보와 버튼 그룹 */}
        <div className="board-detail-actions">
          <div className="board-detail-stats">
            <button onClick={handleLike} className="stat-button">
              ❤️ {post.favoriteCount || 0}
            </button>
            <span>👁️ {post.viewCount || 0}</span>
            <button onClick={handleScrap} className="stat-button">
              📌 {post.scrapCount || 0}
            </button>
            <span>💬 {post.commentCount || 0}</span>
          </div>

          <div className="board-detail-buttons">
            <button onClick={moveToBoard}>목록으로</button>
            <button onClick={moveToEdit}>수정하기</button>
            <button onClick={deletePost}>삭제하기</button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="board-detail-comments">
          <h3>댓글</h3>
          
          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 작성하세요..."
              className="comment-input"
            />
            <button type="submit" className="comment-submit-btn">
              댓글 작성
            </button>
          </form>

          {/* 댓글 목록 */}
          <div className="comment-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author-info">
                    <img 
                      src={comment.profileImage || "/weatherPickMy.png"} 
                      alt="프로필" 
                      className="comment-profile-image"
                    />
                    <span className="comment-author">{comment.nickName}</span>
                  </div>
                  <span className="comment-date">{comment.writeDateTime}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;