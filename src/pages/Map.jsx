import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaBars } from "react-icons/fa";

const Map = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=0p34tvz4ga";
    script.async = true;
    script.onload = () => {
      if (window.naver && window.naver.maps) {
        const defaultCenter = new window.naver.maps.LatLng(37.5665, 126.9780);
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
  }, []);

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
        {/* 사이드바 콘텐츠 */}
{/* 사이드바 콘텐츠 */}
{sidebarOpen && (
  <div style={{ paddingLeft: "15px" }}>  {/* 여기 추가 */}
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
