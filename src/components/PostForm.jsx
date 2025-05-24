import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Board.css";

const PostForm = ({ addPost }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [places, setPlaces] = useState([""]);  // 장소 배열, 초기값은 빈 문자열 하나
  const [error, setError] = useState("");

  const addPlace = () => {
    if (places.length < 5) {
      setPlaces([...places, ""]);
    }
  };

  const removePlace = (index) => {
    const newPlaces = places.filter((_, i) => i !== index);
    setPlaces(newPlaces);
  };

  const handlePlaceChange = (index, value) => {
    const newPlaces = [...places];
    newPlaces[index] = value;
    setPlaces(newPlaces);
  };

  const savePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/board",
        {
          title: title,
          places: places.filter(place => place.trim() !== ""), // 빈 장소는 제외
          body: body,
        },
        {
          headers: {
            "Content-Type": "application/json",
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

  const backToBoard = () => {
    navigate("/board");
  };

  return (
    <div className="container">
      <div className="input-group">
        <h2 style={{ textAlign: "center" }}>글쓰기</h2>
        <span>제목</span>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="places-container">
        <div className="places-header">
          <span>장소</span>
          {places.length < 5 && (
            <button 
              type="button" 
              onClick={addPlace}
              className="add-place-button"
            >
              + 장소 추가
            </button>
          )}
        </div>
        {places.map((place, index) => (
          <div key={index} className="place-input-group">
            <input
              type="text"
              placeholder={`장소 ${index + 1}`}
              value={place}
              onChange={(e) => handlePlaceChange(index, e.target.value)}
            />
            {places.length > 1 && (
              <button 
                type="button" 
                onClick={() => removePlace(index)}
                className="remove-place-button"
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>

      <textarea
        placeholder="내용"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button onClick={savePost}>저장</button>
        <button onClick={backToBoard}>취소</button>
      </div>
    </div>
  );
};

export default PostForm;