import React, { Component } from 'react'

export default class footer extends Component {
  render() {
    return (
      <div className="footer">
      <nav className="bottomNav">
      <a>Link One</a>
      <a>Link Two</a>
      <a>Link Three</a>
      </nav>
      <p> &copy 2018 Copyright <a href=''>Rate My DIY</a> </p>
      </div>
    )
  }
}
