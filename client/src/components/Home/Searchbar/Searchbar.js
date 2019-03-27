import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import LoginPopup from '../../LoginPopUp/LoginPopUp'
import Fuse from 'fuse.js';
import "./Searchbar.scss";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: " search",
      isLoggedIn: false,
      displayPopUp: false
    };
  }

  componentDidMount() {
    var options = {
      keys: ['Projects.name'],
    };
    var fuse = new Fuse(this.props.users, options)

    console.log(this.props.users);
    
  console.log(fuse.search('Melinda'))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userClicked !== null) {
      this.setState({ text: nextProps.userClicked });
    }

    
  }

  changeHandler = e => {
    this.setState({ text: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.state.isLoggedIn
      ? this.setState({ displayPopUp: false })
      : this.setState({ displayPopUp: true });
  };

  closePopUp = () => {
    this.setState({ displayPopUp: false });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="searchBar">
          <div className="searchSpan">
            <FontAwesomeIcon icon={faSearch} className="icon" />
            <input
              type="text"
              onChange={this.changeHandler}
              value={this.state.text}
            />
          </div>
          <input className="searchButton" type="submit" value="Search" />
        </form>

        <LoginPopup
          show={this.state.displayPopUp}
          closePopUp={this.closePopUp}
        />
      </div>
    );
  }
}

export default SearchBar;
