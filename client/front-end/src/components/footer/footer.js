import React from 'react'
import './Footer.scss';

 function Footer() {
  return (
    <div className="footer">
      <nav className="bottomNav">
        <p>Links</p>
        <a href="/">Link One</a>
        <a href="/">Link Two</a>
        <a href="/">Link Three</a>
      </nav>
      <p>2018 Copyright <a href='/'>Rate My DIY</a> </p>
    </div>
  )
}

export default Footer