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
    // this.state.isLoggedIn
    //   ? this.setState({ displayPopUp: false })
    //   : this.setState({ displayPopUp: true });
    this.searchAll()
  };

  closePopUp = () => {
    this.setState({ displayPopUp: false });
  };

  searchAll = () => {
    const options = {
      keys: [
        'username',
        'Projects.name',
        'Projects.category'
      ],
    };
    const fuse = new Fuse(this.props.users, options);
    console.log(fuse.search(this.state.text));
  }

  searchByUser = () => {
    const options = {
      keys: [
        'username'
      ]
    }
    const fuse = new Fuse(this.props.users, options);
    return fuse.search(this.state.text);
  }

  searchProjectOrReview = (filter) => {
    const options = {
      keys: [
        `${filter}.name`
      ]
    }
    const fuse = new Fuse(this.props.users, options);
    return fuse.search(this.state.text);
  }

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
