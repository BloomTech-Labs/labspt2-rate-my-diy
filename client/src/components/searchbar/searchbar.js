//todo:

// pop-up should have functional dismiss button-- dismiss button should set back popup state
//functional dismiss button requires app state-- implement after Apollo Client/Redux/React Context etc.?
//move on to o auth implementation
//wire logged in state to larger app using react context

import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import LoginPopup from "../loginpopup/LoginPopup.js";
import "./searchbar.scss";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: " search",
      isLoggedIn: false,
      displayPopUp: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.userClicked !== null) {
      this.setState({ text: nextProps.userClicked });
    }
  }

  changeHandler = e => {
    this.setState({ text: e.target.value });
  };

  clickHandler = e => {
    e.preventDefault();
    this.state.isLoggedIn
      ? this.setState({ displayPopUp: false })
      : this.setState({ displayPopUp: true });
  };

  render() {
    return (
      <div className="searchBar">
        <span className="searchSpan">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            onChange={this.changeHandler}
            placeholder={this.state.text}
          />
        </span>
        {/* will need to be replaced with Button component/styling when that file is completed */}
        <button className="search" onClick={this.clickHandler}>
          Search
        </button>
        <LoginPopup show={this.state.displayPopUp} />
      </div>
    );
  }
}

export default SearchBar;
