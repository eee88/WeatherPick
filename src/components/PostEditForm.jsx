import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../PostForm.css";
import PlaceSearchInput from "./PlaceSearchInput";

const API_URL = process.env.REACT_APP_API_URL;

const PostEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState({
    title: "",
    content: "",
    places: [],
  });

  const { title, content, places } = post;

  const onChange = (event) => {
    const { value, name } = event.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  // 장소 선택 핸들러
  const handlePlaceSelect = (place, index) => {
    const newPlaces = [...post.places];
    newPlaces[index] = place;
    setPost((prev) => ({
      ...prev,
      places: newPlaces,
    }));
  };

  // 장소 추가
  const addPlace = () => {
    if (post.places.length < 5) {
      setPost((prev) => ({
        ...prev,
        places: [
          ...prev.places,
          { title: "", address: "", roadAddress: "", mapx: "", mapy: "" },
        ],
      }));
    }
  };

  // 장소 삭제
  const removePlace = (index) => {
    setPost((prev) => ({
      ...prev,
      places: prev.places.filter((_, i) => i !== index),
    }));
  };

  const getPost = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === "SU") {
        setPost({
          title: response.data.title || "",
          content: response.data.content || "",
          places: [], // 장소 정보는 빈 배열로 초기화
        });
      }
    } catch (error) {
      console.error("불러오지 못함", error);
      alert("게시글을 불러오는데 실패했습니다.");
    }
  };

  const backToPost = () => {
    navigate(`/board/${id}`);
  };

  const updatePost = async () => {
    // 제목 검증
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    // 내용 검증
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/posts/${id}`,
        {
          title: post.title,
          content: post.content,
          places: post.places,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === "SU") {
        alert("수정되었습니다.");
        navigate(`/board/${id}`);
      } else {
        throw new Error("게시물 수정 실패");
      }
    } catch (error) {
      console.error("Error updating board:", error);
      alert("게시물 수정에 실패했습니다.");
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="post-container">
      {/* 글쓰기 헤더 */}
      <h2 className="post-header">글 수정하기</h2>

      {/* ─── 제목 입력 ─── */}
      <div className="post-row">
        <label htmlFor="title-input" className="post-label-inline">
          제목
        </label>
        <input
          id="title-input"
          type="text"
          name="title"
          className="post-input-inline"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={onChange}
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
          <PlaceSearchInput
            onPlaceSelect={(selectedPlace) =>
              handlePlaceSelect(selectedPlace, index)
            }
            initialValue={place.title}
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
          name="content"
          className="post-textarea"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={onChange}
        />
      </div>

      {/* ─── 버튼 그룹 (저장 / 취소) ─── */}
      <div className="post-button-group">
        <button onClick={updatePost} className="post-btn post-btn-primary">
          수정완료
        </button>
        <button onClick={backToPost} className="post-btn post-btn-secondary">
          수정취소
        </button>
      </div>
    </div>
  );
};

export default PostEditForm;
