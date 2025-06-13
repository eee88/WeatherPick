import { useNavigate } from "react-router-dom";

const PostDetail = () => {
  const navigate = useNavigate();

  const handleViewOnMap = (place) => {
    navigate('/map', { state: { place } });
  };

  return (
    <div className="post-detail-container">
      {post.places && post.places.map((place, index) => (
        <div key={index} className="place-info">
          <h3>{place.title}</h3>
          <p>주소: {place.address}</p>
          <p>도로명 주소: {place.roadAddress}</p>
          <button 
            onClick={() => handleViewOnMap(place)}
            className="view-on-map-btn"
          >
            지도에서 마커찍어서 보기
          </button>
        </div>
      ))}
    </div>
  );
};

export default PostDetail; 