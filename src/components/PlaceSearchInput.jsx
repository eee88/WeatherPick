import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import "./PlaceSearchInput.css";

const Search = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 14px;
`;

const CheckBtn = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
`;

const WrapSearchResult = styled.div`
  display: ${props => props.showResults ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
`;

const SearchResultTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const SearchResultAddress = styled.div`
  font-size: 12px;
  color: #666;
`;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const PlaceSearchInput = ({ onPlaceSelect, initialValue }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue || "");
  const [searchResults, setSearchResults] = useState([]);

  // 장소 검색
  const handleSearch = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/naver/searchPlace`,
        { placeName: query },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.places) {
        setSearchResults(response.data.places);
      }
    } catch (error) {
      console.error("Error searching for place:", error);
      if (error.response?.status === 401) {
        
      } else if (error.response?.status === 404) {
        alert("검색 결과가 없습니다.");
      } else {
        alert("장소 검색에 실패했습니다.");
      }
      setSearchResults([]);
    }
  }, [query]);

  // 컴포넌트 마운트 시 자동으로 검색
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // 검색 결과 리스트 중 하나 선택
  const handlePlaceSelection = (result) => {
    const place = {
      title: result.title.replace(/<[^>]*>/g, ""),
      address: result.address,
      roadAddress: result.roadAddress,
      mapx: result.mapx,
      mapy: result.mapy,
      category: result.category || "",
      link: result.link || "",
      description: result.description || ""
    };
    
    setQuery(place.title);
    setSearchResults([]);
    
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  };

  return (
    <div className="place-search-container">
      <div className="label">주소</div>
      <Search>
        <Input
          type="text"
          className="post-input-full"
          placeholder="장소를 검색하세요"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <CheckBtn onClick={() => searchPlaces(searchTerm)}>검색</CheckBtn>
        
        <WrapSearchResult showResults={showResults && searchResults.length > 0}>
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((place, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => handlePlaceSelection(place)}
                >
                  <div className="place-title">{place.title}</div>
                  <div className="place-address">{place.address}</div>
                  {place.roadAddress && (
                    <div className="place-road-address">(도로명: {place.roadAddress})</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </WrapSearchResult>
      </Search>
    </div>
  );
};

export default PlaceSearchInput; 