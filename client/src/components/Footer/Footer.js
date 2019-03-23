import React from "react";
import "./Footer.scss";

function Footer() {
  return (
    <div className="footer">
      <nav className="bottomNav">
        <a href="/">Home</a>
        <a href="/">About the Team</a>
        <a href="/subscribe">Support Us</a>
      </nav>
      <p>
        2019 Copyright <a href="/">Rate My DIY</a>{" "}
      </p>
    </div>
  );
}

export default Footer;
