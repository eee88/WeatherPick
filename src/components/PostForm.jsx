import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../PostForm.css";
import PlaceSearchInput from "./PlaceSearchInput";

//  POST /api/posts               : 새 게시글(리뷰) 작성
//    Body → { title, content, placeList: [장소1, 장소2, …] }

const API_URL = process.env.REACT_APP_API_URL;

const PostForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // 파일 형식 검사
    const validFiles = files.filter(
      (file) => file.type === "image/jpeg" || file.type === "image/png"
    );

    if (validFiles.length !== files.length) {
      alert("JPG 또는 PNG 파일만 업로드 가능합니다.");
      return;
    }

    // 미리보기 URL 생성
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setImages((prev) => [...prev, ...validFiles]);
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      return newUrls.filter((_, i) => i !== index);
    });
  };

  // 장소 항목 추가
  const addPlace = () => {
    if (places.length < 5) {
      setPlaces([...places, { title: "", address: "" }]);
    }
  };

  // 특정 인덱스 장소 삭제
  const removePlace = (index) => {
    const newPlaces = places.filter((_, i) => i !== index);
    setPlaces(newPlaces);
  };

  // 장소 선택 핸들러
  const handlePlaceSelect = (place, index) => {
    const newPlaces = [...places];
    newPlaces[index] = {
      title: place.title,
      address: place.address,
      roadAddress: place.roadAddress,
      mapx: place.mapx,
      mapy: place.mapy,
      category: place.category || "",
      link: place.link || "",
    };
    setPlaces(newPlaces);
  };

  // 게시물 저장 요청
  const savePost = async (e) => {
    e.preventDefault();

    // 제목 검증
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    // 내용 검증
    if (!body.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // 이미지 파일 업로드
      const uploadedUrls = [];
      for (const image of images) {
        const imageFormData = new FormData();
        imageFormData.append("file", image);

        const uploadResponse = await axios.post(
          `${API_URL}/file/upload`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // URL이 직접 문자열로 오는 경우 처리
        const imageUrl =
          typeof uploadResponse.data === "string"
            ? uploadResponse.data
            : uploadResponse.data.url;

        if (imageUrl) {
          uploadedUrls.push(imageUrl);
        }
      }

      // 게시글 작성 요청
      const postData = {
        title,
        content: body,
        places: places.map((place) => ({
          title: place.title,
          address: place.address,
          roadAddress: place.roadAddress,
          mapx: place.mapx,
          mapy: place.mapy,
          category: place.category || "",
          link: place.link || "",
        })),
        images: uploadedUrls,
      };

      console.log("전송할 데이터:", postData); // 디버깅용 로그

      const response = await axios.post(`${API_URL}/api/posts`, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

      {/* ─── 이미지 업로드 ─── */}
      <div className="post-row">
        <label className="post-label-block">이미지</label>
        <div className="image-upload-container">
          <input
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={handleImageChange}
            className="image-upload-input"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="image-upload-label">
            + 이미지 추가
          </label>
          <div className="image-preview-container">
            {previewUrls.map((url, index) => (
              <div key={index} className="image-preview-item">
                <img src={url} alt={`미리보기 ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="image-remove-btn"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

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
