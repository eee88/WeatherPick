import { useEffect } from "react";

const Map = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=0p34tvz4ga"; // 또는 ncpKeyId
    script.async = true;
    script.onload = () => {
      if (window.naver && window.naver.maps) {
        const map = new window.naver.maps.Map("map", {
          center: new window.naver.maps.LatLng(37.5665, 126.9780),
          zoom: 10,
        });
      } else {
        console.error("네이버 지도 객체가 로드되지 않았습니다.");
      }
    };

    document.head.appendChild(script);
  }, []);

  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default Map;
