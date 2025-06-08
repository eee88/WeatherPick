import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import weatherPickHome from './assets/weatherPickHome.png';
import weatherPickReview from './assets/weatherPickReview.png';
import weatherPickMy from './assets/weatherPickMy.png'; 
import './Nav.css';
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Nav = () => {
  const [profileImage, setProfileImage] = useState(weatherPickMy);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // JWT 토큰에서 username 추출
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.sub;

        const response = await axios.get(`${API_URL}/api/user/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.code === 'SU' && response.data.profileImage) {
          setProfileImage(response.data.profileImage);
        }
      } catch (error) {
        console.error("프로필 이미지 로드 실패:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="navbar">
      <Link className="navbarMenu" to="/Map">
        <img src={weatherPickHome} alt="home" />
      </Link>
      <Link className="navbarMenu" to="/Board">
        <img src={weatherPickReview} alt="review" />
      </Link>
      <Link className="navbarMenu" to="/Mypage">
        <img src={profileImage} alt="profile" className="profile-image" />
      </Link>
    </div>
  );
}

export default Nav;
