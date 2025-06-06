import { Link } from 'react-router-dom';
import weatherPickHome from './assets/weatherPickHome.png';
import weatherPickReview from './assets/weatherPickReview.png';
import weatherPickMy from './assets/weatherPickMy.png'; 
import './Nav.css';

function Nav() {
  return (
    <div className="navbar">
      <Link className="navbarMenu" to="/Map">
        <img src={weatherPickHome} alt="home" />
      </Link>
      <Link className="navbarMenu" to="/Board">
        <img src={weatherPickReview} alt="review" />
      </Link>
      <Link className="navbarMenu" to="/Mypage">
        <img src={weatherPickMy} alt="menu" />
      </Link>
    </div>
  );
}

export default Nav;
