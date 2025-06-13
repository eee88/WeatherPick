import React, { useEffect, useState, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Sidebar from "../Sidebar";
import "./Map.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// TM128 좌표를 위경도로 변환하는 함수
const convertToLatLng = (x, y) => {
  return [y / 10000000, x / 10000000];
};

const Map = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const markersRef = useRef([]);
  const location = useLocation();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=0p34tvz4ga";
    script.async = true;
    script.onload = () => {
      if (window.naver && window.naver.maps) {
        const defaultCenter = new window.naver.maps.LatLng(
          35.1595454,
          126.8526012
        ); // 광주시청 좌표
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
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // 모든 장소에 마커 생성
      const newMarkers = places.map((place, index) => {
        const [lat, lng] = convertToLatLng(place.mapx, place.mapy);
        return new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map: mapInstance,
          title: place.title,
          icon: {
            content: `<div style="background-color: #E87678; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">${
              index + 1
            }</div>`,
            anchor: new window.naver.maps.Point(12, 12),
          },
        });
      });
      markersRef.current = newMarkers;

      // 첫 번째 장소로 지도 중심 이동
      if (places.length > 0) {
        const [firstLat, firstLng] = convertToLatLng(
          places[0].mapx,
          places[0].mapy
        );
        mapInstance.setCenter(new window.naver.maps.LatLng(firstLat, firstLng));
      }
    }
  }, [location.state, mapInstance]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapInstance) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/naver/searchPlace`,
        { placeName: searchQuery },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.places) {
        setSearchResults(response.data.places);

        // 첫 번째 검색 결과로 지도 이동
        const firstResult = response.data.places[0];
        const [lat, lng] = convertToLatLng(firstResult.mapx, firstResult.mapy);
        const position = new window.naver.maps.LatLng(lat, lng);
        mapInstance.setCenter(position);

        // 기존 마커 제거
        if (currentMarker) {
          currentMarker.setMap(null);
        }

        // 새로운 마커 생성
        const marker = new window.naver.maps.Marker({
          position: position,
          map: mapInstance,
          title: firstResult.title,
        });

        // 인포윈도우 생성
        const infowindow = new window.naver.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;">
            <strong>${firstResult.title}</strong><br/>
            ${firstResult.address}
          </div>`,
        });
        infowindow.open(mapInstance, marker);

        setCurrentMarker(marker);
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    }
  };

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
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#f6f9fc" }}
    >
      <Sidebar />

      {/* 지도 */}
      <div style={{ flex: 1, position: "relative", marginLeft: "5rem" }}>
        {/* 검색창 추가 */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "80px",
            zIndex: 1000,
            display: "flex",
            gap: "8px",
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="장소를 검색하세요"
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "300px",
              fontSize: "14px",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "8px 16px",
              backgroundColor: "#E87678",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            검색
          </button>
        </div>

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

        {/* 검색 결과 리스트 */}
        {searchResults.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "80px",
              left: "80px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              maxHeight: "300px",
              overflowY: "auto",
              zIndex: 1000,
              width: "300px",
            }}
          >
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => {
                  const [lat, lng] = convertToLatLng(result.mapx, result.mapy);
                  const position = new window.naver.maps.LatLng(lat, lng);
                  mapInstance.setCenter(position);

                  // 기존 마커 제거
                  if (currentMarker) {
                    currentMarker.setMap(null);
                  }

                  // 새로운 마커 생성
                  const marker = new window.naver.maps.Marker({
                    position: position,
                    map: mapInstance,
                    title: result.title,
                  });

                  // 인포윈도우 생성
                  const infowindow = new window.naver.maps.InfoWindow({
                    content: `<div style="padding:5px;font-size:12px;">
                      <strong>${result.title}</strong><br/>
                      ${result.address}
                    </div>`,
                  });
                  infowindow.open(mapInstance, marker);

                  setCurrentMarker(marker);
                }}
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  {result.title}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {result.address}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
