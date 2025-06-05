import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaBars } from "react-icons/fa";
import Sidebar from '../Sidebar';
import "./Map.css";
import { useLocation } from "react-router-dom";

// TM128 좌표를 위경도로 변환하는 함수
const convertToLatLng = (x, y) => {
  return [y / 10000000, x / 10000000];
};

const Map = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [markers, setMarkers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=0p34tvz4ga";
    script.async = true;
    script.onload = () => {
      if (window.naver && window.naver.maps) {
        const defaultCenter = new window.naver.maps.LatLng(35.1595454, 126.8526012); // 광주시청 좌표
        const map = new window.naver.maps.Map("map", {
          center: defaultCenter,
          zoom: 13,
        });
        setMapInstance(map);
      } else {
        console.error("Naver Maps API 로딩 실패");
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // URL 파라미터에서 좌표 정보가 변경될 때마다 마커 업데이트
  useEffect(() => {
    if (mapInstance && location.state?.places) {
      const places = location.state.places;
      
      // 기존 마커 제거
      markers.forEach(marker => marker.setMap(null));
      setMarkers([]);

      // 모든 장소에 마커 생성
      const newMarkers = places.map((place, index) => {
        const [lat, lng] = convertToLatLng(place.mapx, place.mapy);
        return new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map: mapInstance,
          title: place.title,
          icon: {
            content: `<div style="background-color: #2d8cff; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">${index + 1}</div>`,
            anchor: new window.naver.maps.Point(12, 12)
          }
        });
      });
      setMarkers(newMarkers);

      // 첫 번째 장소로 지도 중심 이동
      if (places.length > 0) {
        const [firstLat, firstLng] = convertToLatLng(places[0].mapx, places[0].mapy);
        mapInstance.setCenter(new window.naver.maps.LatLng(firstLat, firstLng));
      }
    }
  }, [location.state, mapInstance]);

  const handleCurrentLocationClick = () => {
    if (!mapInstance) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLatLng = new window.naver.maps.LatLng(latitude, longitude);
          mapInstance.setCenter(newLatLng);

          if (currentMarker) {
            currentMarker.setMap(null);
          }

          const marker = new window.naver.maps.Marker({
            position: newLatLng,
            map: mapInstance,
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
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f6f9fc" }}>
      <Sidebar />
      
      {/* 지도 */}
      <div style={{ flex: 1, position: "relative", marginLeft: "5rem" }}>
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
  );
};

export default Map;
