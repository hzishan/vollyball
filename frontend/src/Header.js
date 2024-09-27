import './css_styled/App.css';
import { NavLink, Link } from 'react-router-dom';
import logo from './images/logo.jpg';

function Header() {
  return (
    <div className="header">
      {/* <img src={logo} /> */}
      <NavLink to="/" className="header_link">首頁</NavLink>
      <NavLink to="/pick-up" className="header_link">&#127952;預約臨打</NavLink>
      <NavLink to="/reserved" className="header_link">&#127952;報名場次</NavLink>
      {/* <NavLink to="/setting-match" className="header_link">&#127952;場次設定</NavLink> */}
    </div>
  );
}

export default Header;