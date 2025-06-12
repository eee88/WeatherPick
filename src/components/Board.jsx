import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Board.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Board = () => {
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/posts/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dataWithImage = response.data.map((post, idx) => ({
          ...post,
          imageUrl: `https://picsum.photos/seed/${idx}/300/180`,
        }));

        setBoardList(dataWithImage);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };
    fetchData();
  }, []);

  const filteredList = boardList.filter(
    (board) =>
      board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.writerNickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredList.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToWrite = () => navigate("/postform");

  return (
    <div
      className="board-container"
      style={{ overflowX: "hidden", position: "relative" }}
    >
      {/* 검색창 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="제목/작성자 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "30px",
            border: "1px solid #ccc",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            width: "400px",
            height: "50px",
          }}
        />
      </div>

      {/* 인기 게시글 슬라이드 */}
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        modules={[Pagination, Autoplay]}
        style={{ width: "100%", maxWidth: "800px", margin: "80px auto 40px" }}
      >
        {boardList.slice(0, 5).map((board) => (
          <SwiperSlide key={board.reviewId}>
            <div
              className="slide-card"
              onClick={() => navigate(`/board/${board.reviewId}`)}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <img
                src={board.imageUrl}
                alt="썸네일"
                style={{
                  width: "100%",
                  height: "240px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "15px",
                  left: "20px",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "10px 15px",
                  borderRadius: "8px",
                }}
              >
                <h3 style={{ margin: 0 }}>{board.title}</h3>
                <p className="writer" style={{ margin: 0, fontSize: "14px" }}>
                  작성자: {board.writerNickname}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 글쓰기 버튼 */}
      <div className="board-button">
        <button
          onClick={goToWrite}
          style={{
            position: "fixed",
            bottom: "50px",
            right: "50px",
            padding: "12px 24px",
            backgroundColor: "#E87678",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          글쓰기
        </button>
      </div>

      {/* 리뷰 목록 */}
      <ul className="board-posts">
        {currentPosts.map((board) => (
          <li key={board.reviewId} className="board-post-item">
            <Link to={`/board/${board.reviewId}`} className="post-link">
              <div className="post-image">
                <img
                  src={board.imageUrl}
                  alt="썸네일"
                  style={{
                    width: "100px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div className="post-details">
                <div className="post-title">{board.title}</div>
                <div className="post-info">
                  <span>작성자: {board.writerNickname}</span>
                  <span>작성일: {board.writeDateTime}</span>
                </div>
                <div className="post-stats">
                  <span>❤️ {board.favoriteCount}</span>
                  <span>👁️ {board.viewCount}</span>
                  <span>📌 {board.scrapCount}</span>
                  <span>💬 {board.commentCount}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* 페이지네이션 */}
      <div className="board-pagination">
        {[...Array(Math.ceil(filteredList.length / postsPerPage)).keys()].map(
          (number) => (
            <button
              key={number + 1}
              className={currentPage === number + 1 ? "selected" : ""}
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Board;
