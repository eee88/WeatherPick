import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Map.css";
import { FaMapMarkerAlt, FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// TM128 좌표를 위경도로 변환하는 함수
const convertToLatLng = (x, y) => {
  return [y / 10000000, x / 10000000];
};

const Map = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // 네이버 지도 API 스크립트 로드
    const script = document.createElement("script");
    script.src =
      "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=0p34tvz4ga";
    script.async = true;
    script.onload = () => {
      initMap();
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // URL 파라미터에서 좌표 정보가 변경될 때마다 마커 업데이트
  useEffect(() => {
    if (map && location.state?.places) {
      const places = location.state.places;
      // 기존 마커 제거
      markers.forEach(marker => marker.setMap(null));
      setMarkers([]);

      // 모든 장소에 마커 생성
      const newMarkers = places.map(place => {
        const [lat, lng] = convertToLatLng(place.mapx, place.mapy);
        return new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map: map,
          title: place.title
        });
      });
      setMarkers(newMarkers);

      // 첫 번째 장소로 지도 중심 이동
      if (places.length > 0) {
        const [firstLat, firstLng] = convertToLatLng(places[0].mapx, places[0].mapy);
        map.setCenter(new window.naver.maps.LatLng(firstLat, firstLng));
      }
    }
  }, [location.state, map]);

  const initMap = () => {
    if (window.naver && window.naver.maps) {
      // 광주시청 좌표로 초기화 (35.1595454, 126.8526012)
      const mapOptions = {
        center: new window.naver.maps.LatLng(35.1595454, 126.8526012),
        zoom: 15
      };
      const mapInstance = new window.naver.maps.Map("map", mapOptions);
      setMap(mapInstance);
      setMarkers([]); // 마커 초기화
    }
  };

  const handleCurrentLocationClick = () => {
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLatLng = new window.naver.maps.LatLng(latitude, longitude);
          map.setCenter(newLatLng);

          if (currentMarker) {
            currentMarker.setMap(null);
          }

          const marker = new window.naver.maps.Marker({
            position: newLatLng,
            map: map,
            title: "현재 위치",
          });

          setCurrentMarker(marker);
        },
        (error) => {
          console.error("위치 정보 오류:", error);
          alert("위치 정보를 가져올 수 없습니다. 브라우저 권한을 확인하세요.");
        }
      );
    } else {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
    }
  };

  return (
    <div className="map-container">
      <div style={{ display: "flex", height: "100vh", backgroundColor: "#f6f9fc" }}>
        {/* 사이드바 */}
        <div
          style={{
            width: sidebarOpen ? "260px" : "60px",
            backgroundColor: "#fff",
            borderRight: "1px solid #ddd",
            padding: "16px 12px",
            transition: "width 0.3s",
            position: "relative",
          }}
        >
          {/* 사이드바 토글 버튼 */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: "absolute",
              top: "20px",
              right: "-15px",
              backgroundColor: "#2d8cff",
              color: "#fff",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
            <FaBars size={16} />
          </button>

          {/* 사이드바 콘텐츠 */}
          {sidebarOpen && (
            <div style={{ paddingLeft: "15px" }}>
              <h3 style={{ color: "#333", marginTop: "20px" }}>장소 카테고리</h3>
              <div style={{ marginBottom: "10px" }}>
                <button style={categoryBtnStyle}>카페</button>
                <button style={categoryBtnStyle}>식당</button>
                <button style={categoryBtnStyle}>공원</button>
              </div>
              <h4>장소 목록</h4>
              <ul>
                <li>장소 예시 1</li>
                <li>장소 예시 2</li>
                <li>장소 예시 3</li>
              </ul>
            </div>
          )}
        </div>

        {/* 지도 */}
        <div style={{ flex: 1, position: "relative" }}>
          <div id="map" style={{ width: "100%", height: "100%" }}></div>

          {/* 현재 위치 버튼 */}
          <button
            onClick={handleCurrentLocationClick}
            title="현재 위치로 이동"
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            <FaMapMarkerAlt size={20} color="#2d8cff" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 버튼 스타일 공통
const categoryBtnStyle = {
  display: "inline-block",
  padding: "8px 12px",
  margin: "4px",
  backgroundColor: "#e6f0ff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

export default Map;
