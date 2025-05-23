import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaStore, 
  FaRobot, 
  FaExchangeAlt, 
  FaUser, 
  FaShieldAlt, 
  FaSignOutAlt,
  FaBitcoin,
  FaBars,
} from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar state
  };

  return (
    <>
      {/* Toggle button for all screen sizes */}
      <button 
        className="toggle-sidebar-btn" 
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <FaBars />
      </button>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <FaBitcoin className="header-icon" />
          <Link to="/" className="sidebar-title">CRYPTO AGENT</Link>
        </div>
        
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <h3>Psycology</h3>
            <ul>
              <li>
                <Link to="/DISC" className="sidebar-link">
                  <FaChartLine className="nav-icon" />
                  <span>Disc Adult</span>
                </Link>
              </li>
              <li>
                <Link to="/CHDISC" className="sidebar-link">
                  <FaStore className="nav-icon" />
                  <span>Disk Child</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3>QUIZ</h3>
            <ul>
              <li>
                <Link to="/MathQuiz/7" className="sidebar-link">
                  <FaRobot className="nav-icon" />
                  <span>Maths7</span>
                </Link>
              </li>
              <li>
                <Link to="/MathQuiz/4" className="sidebar-link">
                  <FaExchangeAlt className="nav-icon" />
                  <span>Maths4</span>
                </Link>
              </li>
            </ul>
          </div>
          
          
          
          <div className="sidebar-section">
            <h3>Account</h3>
            <ul>
              <li>
                <Link to="/profile" className="sidebar-link">
                  <FaUser className="nav-icon" />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/security" className="sidebar-link">
                  <FaShieldAlt className="nav-icon" />
                  <span>Security</span>
                </Link>
              </li>
              <li>
                <button onClick={handleSignOut} className="signout-btn">
                  <FaSignOutAlt className="nav-icon" />
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;