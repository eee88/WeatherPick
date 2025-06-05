import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Board.css";


//  GET /api/posts/mine          : 내가 쓴 게시글 목록 불러오기
//  GET /api/posts/{id}           : 특정 게시글(리뷰) 상세 불러오기
//  DELETE /api/posts/{id}        : 특정 게시글 삭제
//  (수정은 PostEditForm.jsx에서 PUT /api/posts/{id} 호출)


const API_URL = process.env.REACT_APP_API_URL;

const Board = () => {
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);     // 리뷰 목록 배열
  const [searchTerm, setSearchTerm] = useState("");   // 검색어 상태
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 번호
  const [postsPerPage, setPostsPerPage] = useState(10);// 페이지당 출력 개수

  useEffect(() => {
    getBoardList();  // 컴포넌트 마운트 혹은 currentPage/postsPerPage 변경 시 갱신
  }, [currentPage, postsPerPage]);

  const getBoardList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/posts/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.code === "SU") {
        setBoardList(response.data.reviewListItems);
      } else {
        console.error("리뷰 목록을 불러오는데 실패했습니다.");
        setBoardList([]);
      }
    } catch (error) {
      console.error("불러오지 못함", error);
      setBoardList([]);  // 에러 시 빈 배열 처리
    }
  };

  // 검색 필터링: 제목, 작성자 포함 여부
  const filteredList = boardList.filter((board) =>
    board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.writerNickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이징 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredList.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const Post = () => navigate("/postform"); // 글쓰기 버튼 클릭 시

  return (
    <div className="board-container">
      {/* 제목 */}
      <h1 className="board-title">리뷰 페이지</h1>

      {/* 검색창 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="제목/작성자 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 글쓰기 버튼 */}
      <div className="board-button">
        <button onClick={Post}>글쓰기</button>
      </div>

      {/* 리뷰 목록 (페이지네이션 적용) */}
      <ul className="board-posts">
        {currentPosts.map((board) => (
          <li key={board.reviewId} className="board-post-item">
            <Link to={`/board/${board.reviewId}`}>
              <div className="post-title">{board.title}</div>
              <div className="post-info">
                <span className="post-writer">작성자: {board.writerNickname}</span>
                <span className="post-date">작성일: {board.writeDateTime}</span>
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

      {/* 페이징 버튼 */}
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
