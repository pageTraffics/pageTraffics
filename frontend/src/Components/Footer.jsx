import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-wrapper">
        <div className="landing-page-block">
          <div className="landing-page-block-text">Page Traffics</div>
        </div>
        <div className="container">
          <div className="footer-content-wrapper">
            <div className="footer-content-block is-border">
              <div>
                <h3 className="shedule-title">Let’s Schedule Call.</h3>
                <div className="shedule-text">
                  You are one step away from making more revenue from the same ad spend.
                </div>
              </div>
              <div className="footer-btns">
                <Link
                  to="/contact"
                  className="button is-orange w-inline-block"
                >
                  <div className="button-text">Book a Call</div>
                  <div className="button-dot"></div>
                </Link>
                <a
                  href="tel:+917655000956"
                  className="button is-white w-inline-block"
                >
                  <div className="button-icon w-embed">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.95 21C17.8667 21 15.8083 20.5458 13.775 19.6375C11.7417 18.7292 9.89167 17.4417 8.225 15.775C6.55833 14.1083 5.27083 12.2583 4.3625 10.225C3.45417 8.19167 3 6.13333 3 4.05C3 3.75 3.1 3.5 3.3 3.3C3.5 3.1 3.75 3 4.05 3H8.1C8.33333 3 8.54167 3.07917 8.725 3.2375C8.90833 3.39583 9.01667 3.58333 9.05 3.8L9.7 7.3C9.73333 7.56667 9.725 7.79167 9.675 7.975C9.625 8.15833 9.53333 8.31667 9.4 8.45L6.975 10.9C7.30833 11.5167 7.70417 12.1125 8.1625 12.6875C8.62083 13.2625 9.125 13.8167 9.675 14.35C10.1917 14.8667 10.7333 15.3458 11.3 15.7875C11.8667 16.2292 12.4667 16.6333 13.1 17L15.45 14.65C15.6 14.5 15.7958 14.3875 16.0375 14.3125C16.2792 14.2375 16.5167 14.2167 16.75 14.25L20.2 14.95C20.4333 15.0167 20.625 15.1375 20.775 15.3125C20.925 15.4875 21 15.6833 21 15.9V19.95C21 20.25 20.9 20.5 20.7 20.7C20.5 20.9 20.25 21 19.95 21Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="button-text">Call Us Now</div>
                  <div className="button-dot"></div>
                </a>
              </div>
            </div>
            <div className="footer-links-wrapper">
              <div className="footer-content-block">
                <div className="footer-title">Quick Links</div>
                <div className="footer-link-block">
                  <a href="/#clients" className="footer-link">Our Client</a>
                  <Link to="/about" className="footer-link">About Us</Link>
                  <Link to="/services" className="footer-link">Services</Link>
                  <Link to="/contact" className="footer-link">Contact Us</Link>
                  <a href="/#reviews" className="footer-link">Reviews</a>
                </div>
              </div>
              <div className="footer-content-block">
                <div className="footer-title">Office<br /></div>
                <div className="footer-link-block is-address">
                  Plot No:-81, beside Road of Truptee Restaurant, Old Ag Colony, Unit 4, Madhusudan Nagar, Bhubaneswar, Odisha 751001<br />
                </div>
              </div>
              <div className="footer-content-block">
                <div className="footer-title">Contact Us<br /></div>
                <div className="footer-link-block is-address">
                  ujwal@richasoftwaresolutions.com<br />
                  <a
                    href="tel:+917655000956"
                    className="footer-link-block is-address w-inline-block"
                  >
                    +91 7655000956
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-cc">
          <div className="container">
            <div className="cc-block">
              <div>© Page Traffics, 2025</div>
              <div className="div-block">
                <div>Made with love</div>
                <div className="heart-icon w-embed">
                  <svg
                    viewBox="0 0 11 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.47 12.004C4.91 10.596 4.462 9.796 2.494 7.092C1.23 5.364 0.75 4.228 0.75 3.06C0.75 1.652 1.966 0.5 3.374 0.5C4.366 0.5 5.278 1.012 5.838 2.052C6.414 1.012 7.326 0.5 8.334 0.5C9.71 0.5 10.958 1.652 10.958 3.06C10.958 4.196 10.558 5.268 9.214 7.108C7.23 9.828 6.75 10.676 6.222 12.004H5.47Z"
                      fill="url(#paint0_linear_138_1498_react)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_138_1498_react"
                        x1="5.30004"
                        y1="5.504"
                        x2="5.79815"
                        y2="5.504"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#FF5924" />
                        <stop offset="1" stopColor="#FF7DD3" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  by{' '}
                  <a
                    href="https://www.sawariyax.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gradient-link-text"
                  >
                    Sawariya X
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-gradient"></div>
      </div>
    </div>
  );
};

export default Footer;
