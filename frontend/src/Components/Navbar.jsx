import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCircle, FaUserShield, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const { currentUser, isAdmin } = useAuth();

  const isMobile = window.innerWidth <= 768;

  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'flex-start' : 'center',
    lineHeight: '1',
  };

  const handleAnchorClick = (e, hash) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      sessionStorage.setItem('returnScroll', window.scrollY);
      window.location.href = `/${hash}`;
    }
  };

  return (
    <div>
      {/* Desktop Navbar */}
      <div className="navbar is-active is-top">
        <div className="container">
          <div className="nav-wrapper">
            <div
              id="w-node-_330cc0c9-5564-4a3f-f7b6-a9d2900a693b-2cd6f02b"
              className="nav-col is-left"
            >
              <div className="nav-link-block">
                <a 
                  href="#featured-case-study" 
                  className="nav-link"
                  onClick={(e) => handleAnchorClick(e, '#featured-case-study')}
                >
                  Case Studies
                </a>
                <div className="nav-link-separator"></div>
                <a 
                  href="#faqs" 
                  className="nav-link"
                  onClick={(e) => handleAnchorClick(e, '#faqs')}
                >
                  FAQs
                </a>
                <Link to="/about" className="nav-link">About</Link>
                <div className="nav-link-separator"></div>
                <Link to="/services" className="nav-link">Services</Link>
                <div className="nav-link-separator"></div>
                <Link to="/contact" className="nav-link">Contact</Link>
                <div className="nav-link-separator"></div>
                <Link to="/login" className="nav-link" style={{ fontWeight: '700', color: '#193CB8' }}>Log In</Link>
                <div className="nav-link-separator"></div>
                <Link to="/register" className="nav-link" style={{ fontWeight: '700', color: '#FF6900' }}>Sign Up</Link>
              </div>
            </div>
            
            <div
              id="w-node-_330cc0c9-5564-4a3f-f7b6-a9d2900a6942-2cd6f02b"
              className="nav-col is-middle"
            >
              <div className="hamburger-box">
                <div className="hamburger-inner is-1"></div>
                <div className="hamburger-inner is-2"></div>
                <div className="hamburger-inner is-3"></div>
              </div>

              <a 
                href="/" 
                className="logo-link" 
                style={containerStyle}
                onClick={(e) => {
                  if (location.pathname !== '/') {
                    e.preventDefault();
                    window.location.href = '/';
                  }
                }}
              >
                <span style={{ color: '#ff6900', fontSize: '30px', fontWeight: 'bold' }}>
                  PAGE
                </span>
                <span
                  style={{
                    color: '#193cb8',
                    fontSize: '30px',
                    fontWeight: 'bold',
                    marginLeft: isMobile ? '0' : '0.2rem',
                  }}
                >
                  TRAFFICS
                </span>
              </a>
            </div>
            
            <div
              id="w-node-_330cc0c9-5564-4a3f-f7b6-a9d2900a6949-2cd6f02b"
              className="nav-col is-right"
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              {currentUser ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        background: 'rgba(25, 60, 184, 0.1)',
                        color: '#193CB8',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textDecoration: 'none'
                      }}
                    >
                      <FaUserShield /> Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 105, 0, 0.1)',
                      color: '#FF6900',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      textDecoration: 'none'
                    }}
                  >
                    <FaUserCircle /> Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      color: '#193CB8',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      textDecoration: 'none'
                    }}
                  >
                    <FaSignInAlt /> Log In
                  </Link>
                  <Link
                    to="/register"
                    className="button is-orange is-nav-btn w-inline-block"
                  >
                    <div className="button-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaUserPlus /> Sign Up
                    </div>
                    <div className="button-dot"></div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="mobile-menu-drawer">
        <div className="mobile-menu-box">
          <div className="mobile-menu-links-box">
            <div className="mobile-menu-small-title">Explore</div>
            <a 
              href="#featured-case-study" 
              className="mobile-menu-link"
              onClick={(e) => handleAnchorClick(e, '#featured-case-study')}
            >
              Case Studies
            </a>
            <a 
              href="#faqs" 
              className="mobile-menu-link"
              onClick={(e) => handleAnchorClick(e, '#faqs')}
            >
              FAQs
            </a>
            <Link to="/about" className="mobile-menu-link">About</Link>
            <Link to="/services" className="mobile-menu-link">Services</Link>
            <Link to="/contact" className="mobile-menu-link">Contact</Link>
            {currentUser ? (
              <>
                <Link to="/profile" className="mobile-menu-link">Profile Management</Link>
                {isAdmin && <Link to="/admin/dashboard" className="mobile-menu-link">Admin Dashboard</Link>}
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-menu-link">Customer Login</Link>
                <Link to="/register" className="mobile-menu-link">Register</Link>
                <Link to="/admin/login" className="mobile-menu-link">Admin Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;