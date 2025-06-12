import Nav from "./Nav";
import "./Sidebar.css";
import weatherPickLogo from "./assets/datepick_logo1.png";

const Sidebar = () => {
  return (
    <div className="sidebarContainer">
      <img src={weatherPickLogo} alt="logo" />
      <Nav />
    </div>
  );
};

export default Sidebar;
