import { useEffect } from "react";

const Map = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=0p34tvz4ga";
    script.async = true;

    script.onload = () => {
      if (window.naver && window.naver.maps) {
        const mapOptions = {
          center: new window.naver.maps.LatLng(37.3595704, 127.105399),
          zoom: 10,
        };
        new window.naver.maps.Map("map", mapOptions);
      } else {
        console.error("네이버 지도 API 로드 실패");
      }
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "95vh",
        border: "1px solid #ccc",
      }}
    ></div>
  );
};

export default Map;
