import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function PlaceForm() {
  const [placeName, setPlaceName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/place`,
        {
          placeName: placeName,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("✅ 장소 등록 성공");
      setPlaceName("");
      setLatitude("");
      setLongitude("");
    } catch (err) {
      console.error(err);
      setMessage("❌ 장소 등록 실패");
    }
  };

  return (
    <div>
      <h2>📍 장소 등록</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="장소 이름"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          required
        />
        <input
          placeholder="위도"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
        <input
          placeholder="경도"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
        <button type="submit">등록</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
