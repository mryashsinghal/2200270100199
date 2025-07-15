import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar-afford">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Url Shortener
        </Link>
        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-btn ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/stats"
            className={`navbar-btn ${location.pathname === '/stats' ? 'active' : ''}`}
          >
            Stats
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;