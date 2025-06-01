import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './Sidebar';

import Board from "./components/Board"; // 게시판 메인
import BoardDetail from "./components/BoardDetail"; // 게시글 상세
import PostForm from "./components/PostForm"; // 글쓰기
import PostEditForm from "./components/PostEditForm"; // 글수정
import PlaceForm from "./components/PlaceForm"; // 장소 등록

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Map from "./pages/Map";
import Mypage from "./pages/Mypage";
import PlaceSearchTest from './pages/PlaceSearchTest';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ flexGrow: 1, marginLeft: '5rem' }}>
          <Routes>
            {/* 로그인 및 회원가입 */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 게시판 관련 라우팅 */}
            <Route path="/board" element={<Board />} />
            <Route path="/board/:id" element={<BoardDetail />} />
            <Route path="/postform" element={<PostForm />} />
            <Route path="/edit/:id" element={<PostEditForm />} />

            {/* 장소 등록 페이지 */}
            <Route path="/place" element={<PlaceForm />} />

            {/* 장소 검색 테스트 페이지 */}
            <Route path="/test" element={<PlaceSearchTest />} />
            {/* 기타 페이지 */}
            <Route path="/map" element={<Map />} />
            <Route path="/mypage" element={<Mypage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
