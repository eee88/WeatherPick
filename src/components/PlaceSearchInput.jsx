import { useState, useEffect } from "react";
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

const PlaceSearchInput = ({ onPlaceSelect }) => {
  const [query, setQuery] = useState("조선대학교");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState({
    title: "",
    address: "",
  });

  // 컴포넌트 마운트 시 자동으로 검색
  useEffect(() => {
    handleSearch();
  }, []);

  // 장소 검색
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/naver/searchPlace`,
        {
          placeName: query,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("검색 응답:", response.data); // 디버깅용 로그
      
      if (!response.data.places) {
        console.log("검색 결과 없음");
        setSearchResults([]);
        return;
      }
      
      setSearchResults(response.data.places);
      console.log("검색 결과 설정됨:", response.data.places); // 디버깅용 로그
    } catch (error) {
      console.error("Error searching for place:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        // 로그인 페이지로 리다이렉트
        window.location.href = "/";
      } else if (error.response?.status === 404) {
        alert("검색 결과가 없습니다.");
      } else {
        alert("장소 검색에 실패했습니다.");
      }
      setSearchResults([]);
    }
  };

  // 검색 결과 리스트 중 하나 선택
  const handlePlaceSelection = (title, address) => {
    setSelectedPlace({ title, address });
    setQuery(title);
    setSearchResults([]);
    
    if (onPlaceSelect) {
      onPlaceSelect({ title, address });
    }
  };

  return (
    <div className="place-search-container">
      <div className="label">주소</div>
      <Search>
        <Input
          type="text"
          value={query}
          placeholder="장소명을 입력해주세요."
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <CheckBtn onClick={handleSearch}>검색</CheckBtn>
        
        <WrapSearchResult showResults={searchResults && searchResults.length > 0}>
          {searchResults && searchResults.length > 0 && (
            <>
              {searchResults.map((result, index) => (
                <div
                  onClick={() =>
                    handlePlaceSelection(
                      result.title.replace(/<[^>]*>/g, ""),
                      result.address
                    )
                  }
                  key={index}
                  className="search-result-item"
                >
                  <SearchResultTitle>
                    {result.title.replace(/<[^>]*>/g, "")}
                  </SearchResultTitle>
                  <SearchResultAddress>
                    {result.address}
                  </SearchResultAddress>
                </div>
              ))}
            </>
          )}
        </WrapSearchResult>
      </Search>
    </div>
  );
};

export default PlaceSearchInput; 