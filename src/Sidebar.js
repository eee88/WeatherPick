import Nav from './Nav';
import './Sidebar.css';
const Sidebar = () => {
    return (
      <div className='sidebarContainer' >
        <Nav /> {/* 네비게이션 메뉴 삽입 */}
    </div>
    );
}
export default Sidebar;