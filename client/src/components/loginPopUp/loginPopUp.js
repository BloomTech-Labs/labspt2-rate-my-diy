import "./LoginPopup.scss";
import React, { Component } from "react";

class LoginPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return this.props.show === true ? (
      <div className="modal">
        <div className="modal-content">
          <h1>Login Popup Box </h1>
          <button onClick={this.props.closePopUp} className="close button">
            Close
          </button>
          <button className="login button">login button</button>
        </div>
      </div>
    ) : null;
  }
}

export default LoginPopup;
