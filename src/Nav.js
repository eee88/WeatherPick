import weatherPickLogo from './images/weatherPickLogo.png'
import weatherPickHome from './images/weatherPickHome.png'
import weatherPickReview from './images/weatherPickReview.png'
import weatherPickMy from './images/weatherPickMy.png'

import { Link } from 'react-router-dom';
import './Nav.css';
function Nav() {
    return (
        <div>
            <div className="navbar">
              <img src={weatherPickLogo} alt='picture1' />
              <Link className="navbarMenu" to={'/'}>
                <img src={weatherPickHome} alt='picture2' />
              </Link>
              <Link className="navbarMenu" to={'/Reviewpage'}>
                <img src={weatherPickReview} alt='picture3' />
              </Link>
              <Link className="navbarMenu" to={'/Mypage'}>
                <img src={weatherPickMy} alt='picture4' />
              </Link>
            </div>
        </div>
    );
}
export default Nav;