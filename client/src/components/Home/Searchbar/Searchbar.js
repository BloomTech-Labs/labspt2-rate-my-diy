import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import LoginPopup from '../../LoginPopUp/LoginPopUp'
import Fuse from 'fuse.js';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import "./Searchbar.scss";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: " search",
      isLoggedIn: false,
      displayPopUp: false,
      options: ['project']

    };
  }

  componentDidMount = () => {
    console.log(this.props)
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
    // console.log(this.search(this.state.option));
    let options = []
    if (this.state.options.includes('user')) {
      options.push('user')
    }
    if (this.state.options.includes('project')) {
      options.push('project')
    }
    if (this.state.options.includes('review')) {
      options.push('review')
    }
    if (this.state.options.includes('category')) {
      options.push('category')
    }
    this.search(options)
  };

  closePopUp = () => {
    this.setState({ displayPopUp: false });
  };

  optionsChanged = (options) => {
    this.setState({
      options: options
    })
  };

  search = (option) => {
    let options = {
      keys: []
    }

    if(option.includes('user')) {
      options.keys.push('username')

    } 
    
    if (option.includes('category')) {
      options.keys.push('category')

    }
    if (option.includes('review')) {
      options.keys.push('name')
    }
    // if (option.includes('stars')) {
    //   options.keys.push('Projects.rating')
    // }
    if (option.includes('project')) {
      options.keys.push('name')
    } 
    
    else {
      options.keys.push('name')
    }

    const usersFuse = new Fuse(this.props.users, options);
    const userSearch = usersFuse.search(this.state.text);
    const projectsFuse = new Fuse(this.props.projects, options);
    const projectSearch = projectsFuse.search(this.state.text);
    const reviewsFuse = new Fuse(this.props.reviews, options);
    const reviewSearch = reviewsFuse.search(this.state.text);
    // return fuse.search(this.state.text);
    console.log({searchprops: this.props})
    console.log({users: userSearch, projects: projectSearch, reviews: reviewSearch});
  }
  


  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="searchBar">
        <div>Search By:</div>
        <CheckboxGroup
        checkboxDepth={2} // This is needed to optimize the checkbox group
        name="options"
        value={this.state.options}
        onChange={this.optionsChanged}>
 
        <label><Checkbox value="user"/> User</label>
        <label><Checkbox value="project"/> Project</label>
        <label><Checkbox value="review"/> Review</label>
        <label><Checkbox value="category"/> Project Category</label>
      </CheckboxGroup>
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
