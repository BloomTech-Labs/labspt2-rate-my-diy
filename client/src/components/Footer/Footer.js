import React from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="footer">
      <nav className="bottomNav">
        <Link to="/">Home</Link>
        <Link to="/">About the Team</Link>
        <Link to="/subscribe">Support Us</Link>
      </nav>
      <p>
        2019 Copyright <a href="/">Rate My DIY</a>{' '}
      </p>
    </div>
  );
}

export default Footer;
