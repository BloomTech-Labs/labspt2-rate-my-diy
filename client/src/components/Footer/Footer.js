import React from 'react'
import './Footer.scss'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className="footer">
      <nav className="bottomNav">
        <Link to="/">Home</Link>
        <a href="https://github.com/Lambda-School-Labs/labspt2-rate-my-diy">
          About the Team
        </a>
      </nav>
      <p>
        &copy; 2019 Copyright <a href="/">Rate My DIY</a>{' '}
      </p>
    </div>
  )
}

export default Footer
