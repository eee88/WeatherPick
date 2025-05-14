import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../Board.css";

const Board = () => {
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getBoardList();
  }, [currentPage, postsPerPage]);

  const getBoardList = async () => {
    try {
      const response = await axios.get("http://localhost:8080/board/me");
      setBoardList(response.data);
      setTotalPages(Math.ceil(response.data.length / postsPerPage));
    } catch (error) {
      console.error("불러오지 못함", error);
    }
  };

  // 검색 필터
  const filteredList = boardList.filter(
    (board) =>
      board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.writer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredList.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePostsPerPage = (e) => {
    setPostsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const Post = () => {
    navigate("/postform");
  };

  return (
    <div className="board-container">
      <h1 className="board-title">리뷰 페이지</h1>

      {/* 🔍 검색창 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="제목/작성자/내용 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 🌀 Swiper 최신 게시물 미리보기 */}
      <div className="swiper-wrapper">
        <Swiper spaceBetween={10} slidesPerView={1}>
          {filteredList.slice(0, 5).map((board) => (
            <SwiperSlide key={board.id}>
              <div className="slide-card" onClick={() => navigate(`/board/${board.id}`)}>
                <h3>{board.title}</h3>
                <p>{board.body?.slice(0, 80)}...</p>
                <p className="writer">작성자: {board.writer}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ✍ 글쓰기 버튼 */}
      <div className="board-button">
        <button onClick={Post}>글쓰기</button>
      </div>
      <br />

      {/* 📄 게시물 목록 */}
      <ul className="board-posts">
        {currentPosts.map((board) => (
          <li key={board.id} className="board-post-item">
            <Link to={`/board/${board.id}`}>{board.title}</Link>
            <span>작성자: {board.writer}</span>
            <span> | 작성 시간: {board.writingTime}</span>
          </li>
        ))}
      </ul>

      {/* 📄 페이지네이션 */}
      <div className="board-pagination">
        {[...Array(Math.ceil(filteredList.length / postsPerPage)).keys()].map((number) => (
          <button
            key={number + 1}
            className={currentPage === number + 1 ? "selected" : ""}
            onClick={() => paginate(number + 1)}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Board;
