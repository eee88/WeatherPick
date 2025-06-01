import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../PostForm.css";



//  POST /api/posts               : 새 게시글(리뷰) 작성
//    Body → { title, content, placeList: [장소1, 장소2, …] }


const API_URL = process.env.REACT_APP_API_URL;

const PostForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [places, setPlaces] = useState([""]);
  const [error, setError] = useState("");

  // 장소 항목 추가
  const addPlace = () => {
    if (places.length < 5) {
      setPlaces([...places, ""]);
    }
  };

  // 특정 인덱스 장소 삭제
  const removePlace = (index) => {
    const newPlaces = places.filter((_, i) => i !== index);
    setPlaces(newPlaces);
  };

  // 특정 인덱스 장소값 변경
  const handlePlaceChange = (index, value) => {
    const newPlaces = [...places];
    newPlaces[index] = value;
    setPlaces(newPlaces);
  };

  // 게시물 저장 요청
  const savePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/posts`,
        {
          title: title,
          content: body,
          placeList: places.filter((p) => p.trim() !== ""),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("게시물이 등록되었습니다.");
        navigate("/board");
      } else {
        throw new Error("게시물 등록 실패");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("게시물 등록에 실패했습니다.");
    }
  };

  // 게시판으로 돌아가기
  const backToBoard = () => {
    navigate("/board");
  };

  return (
    <div className="post-container">
      {/* 글쓰기 헤더 */}
      <h2 className="post-header">글쓰기</h2>

      {/* ─── 제목 입력 ─── */}
      <div className="post-row">
        <label htmlFor="title-input" className="post-label-inline">
          제목
        </label>
        <input
          id="title-input"
          type="text"
          className="post-input-inline"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* ─── 장소 (최대 5개) ─── */}
      <div className="post-row">
        <label className="post-label-inline">장소 (최대 5개)</label>
        {places.length < 5 && (
          <button
            type="button"
            onClick={addPlace}
            className="post-add-place-btn"
          >
            + 장소 추가
          </button>
        )}
      </div>
      {places.map((place, index) => (
        <div key={index} className="post-row post-place-row">
          <input
            type="text"
            className="post-input-full"
            placeholder={`장소 ${index + 1}`}
            value={place}
            onChange={(e) => handlePlaceChange(index, e.target.value)}
          />
          {places.length > 1 && (
            <button
              type="button"
              onClick={() => removePlace(index)}
              className="post-remove-place-btn"
            >
              X
            </button>
          )}
        </div>
      ))}

      {/* ─── 내용 입력 ─── */}
      <div className="post-row">
        <label className="post-label-block">내용</label>
      </div>
      <div className="post-row">
        <textarea
          className="post-textarea"
          placeholder="내용을 입력하세요"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      {error && <div className="post-error-message">{error}</div>}

      {/* ─── 버튼 그룹 (저장 / 취소) ─── */}
      <div className="post-button-group">
        <button onClick={savePost} className="post-btn post-btn-primary">
          저장
        </button>
        <button onClick={backToBoard} className="post-btn post-btn-secondary">
          취소
        </button>
      </div>
    </div>
  );
};

export default PostForm;
