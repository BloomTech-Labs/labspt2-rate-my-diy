import './LoginPopUp.scss'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class LoginPopup extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return this.props.show === true ? (
      <div className="modal">
        <div className="modal-content">
          <h1>Login Popup Box </h1>
          <button onClick={this.props.closePopUp} className="close button">
            Close
          </button>
          <Link to="/signin">
            <button className="loginButton">Login</button>
          </Link>
        </div>
      </div>
    ) : null
  }
}

export default LoginPopup
