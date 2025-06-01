import React, { useState } from 'react';
import PlaceSearchInput from '../components/PlaceSearchInput';
import './PlaceSearchTest.css';

const PlaceSearchTest = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    console.log('선택된 장소:', place);
  };

  return (
    <div className="place-search-test">
      <h2>장소 검색 테스트</h2>
      <div className="search-container">
        <PlaceSearchInput onPlaceSelect={handlePlaceSelect} />
      </div>
      
      {selectedPlace && (
        <div className="selected-place">
          <h3>선택된 장소 정보</h3>
          <p><strong>장소명:</strong> {selectedPlace.title}</p>
          <p><strong>주소:</strong> {selectedPlace.address}</p>
        </div>
      )}
    </div>
  );
};

export default PlaceSearchTest; 