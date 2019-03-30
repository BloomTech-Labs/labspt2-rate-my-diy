import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import LoginPopup from "../../LoginPopUp/LoginPopUp";
import Fuse from "fuse.js";
import { Checkbox, CheckboxGroup } from "react-checkbox-group";
import {RadioGroup, Radio} from 'react-radio-group'
import "./Searchbar.scss";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      isLoggedIn: false,
      displayPopUp: false,
      options: ["project"],
      userSort: "",
      projectSort: "",
      reviewSort: "",
      stars: 0,
      category: "",
      categoryDisabled: false,
      starsDisabled: false,
      userSortDisabled: true,
      projectSortDisabled: false,
      reviewSortDisabled: true
    };
  }

  componentDidMount = () => {
    console.log(this.props);
  };

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
    let options = [];
    if (this.state.options.includes("user")) {
      options.push("user");
    }
    if (this.state.options.includes("project")) {
      options.push("project");
    }
    if (this.state.options.includes("review")) {
      options.push("review");
    }
    if (this.state.options.includes("category")) {
      options.push("category");
    }
    this.search(options);
  };

  closePopUp = () => {
    this.setState({ displayPopUp: false });
  };

  optionsChanged = options => {
    if(options.includes('user')) {
      this.setState({
        userSortDisabled: false
      })
    }
    if(!options.includes('user')){
      this.setState({
        userSortDisabled: true
      })
    }
    if (!options.includes("project")) {
      this.setState({
        categoryDisabled: true,
        starsDisabled: true,
        projectSortDisabled: true
      });
    }
    if (options.includes("project")) {
      this.setState({
        categoryDisabled: false,
        starsDisabled: false,
        projectSortDisabled: false
      });
    }
    if(!options.includes("review")) {
      this.setState({
        reviewSortDisabled: true
      })
    }
    if(options.includes("review")) {
      this.setState({
        reviewSortDisabled: false
      })
    }
    this.setState({
      options: [...options]
    });

    console.log({state: this.state})
  };

  starChange = e => {
    const stars = parseInt(e.target.value);
    this.setState({
      stars: stars
    });
  };

  categoryChange = e => {
    this.setState({
      category: e.target.value,
      options: [...this.state.options, "category"]
    });
  };

  userSortChange = option => {
    
      this.setState({
        userSort: option
      })
      console.log({stateAfterSort: this.state, sortOption: option})
  
  }
    
  projectSortChange = option => {
    this.setState({
      projectSort: option
    })
    console.log({stateAfterSort: this.state, sortOption: option})
  
  }

  reviewSortChange = option => {
    this.setState({
      projectSort: option
    })
    console.log({stateAfterSort: this.state, sortOption: option})
  
  }
    
    
    // console.log({stateAfterSort: this.state, sortOption: option})
  

  search = option => {
    let options = {
      shouldSort: true,
      threshold: 0.4,
      keys: []
    };

    if (option.includes("user")) {
      options.keys.push("username");

      const usersFuse = new Fuse(this.props.users, options);
    

      if(this.state.userSort === 'alphabetical') {
        const userSearch = usersFuse.search(this.state.text);
        console.log(userSearch.sort(function (a, b) { return a.username - b.username }))
      } else if(this.state.userSort === 'reverseAlpha') {
        //sort reverseAlphabetical
      } else {
        const userSearch = usersFuse.search(this.state.text);
      }
    }

    if (option.includes("category")) {
      options.keys.push("category");
    }
    if (option.includes("review")) {
      options.keys.push("name");
    }

    if (option.includes("project")) {
      options.keys.push("name");
    } else {
      options.keys.push("name");
    }
   

    const projectsFuse = new Fuse(this.props.projects, options);
    const projectSearch = projectsFuse.search(this.state.text);


    const reviewsFuse = new Fuse(this.props.reviews, options);
    const reviewSearch = reviewsFuse.search(this.state.text);


    const justStarsSearch = this.props.projects.filter(
      project => project.rating >= this.state.stars
    );
    const starsSearch = projectSearch.filter(project => project.rating >= this.state.stars);

    const categorySearch = projectsFuse.search(this.state.category);

    // if(this.state.userSort !== "") {
    //   if(this.state.userSort === alphabetical) {
    //     this.setState
    //   }
    // }
    // return fuse.search(this.state.tex);
    console.log({ state: this.state });
    console.log({ searchprops: this.props });
    console.log({
      users: userSearch,
      projects: projectSearch,
      reviews: reviewSearch,
      justStars: justStarsSearch,
      projectsByStars: starsSearch,
      projectsByCategory: categorySearch
    });
  };

  render() {
    let categories = this.props.projects.map(project => project.category);
    let filteredCategories = [...new Set(categories)];
    return (
      <div>
        <form onSubmit={this.handleSubmit} >
          <div>Search By:</div>
          <CheckboxGroup
            checkboxDepth={2} // This is needed to optimize the checkbox group
            name="options"
            value={this.state.options}
            onChange={this.optionsChanged}
          >
            <label>
              <Checkbox value="user" /> User
            </label>
            <label>
              <Checkbox value="project" /> Project
            </label>
            <label>
              <Checkbox value="review" /> Review
            </label>
          </CheckboxGroup>
          <select
            name="stars"
            onChange={this.starChange}
            value={this.state.stars}
            disabled={this.state.starsDisabled}
          >
            <option value="0">Stars</option>
            <option value="1">1+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="5">5+ Stars</option>
          </select>
          <select
            name="category"
            onChange={this.categoryChange}
            value={this.state.category}
            disabled={this.state.categoryDisabled}
          >  
            <option value="">Categories</option>
            {filteredCategories.map(category => {
              return (
                <option value={category} key={category}>{`${category}`}</option>
              );
            })}
          </select>
          <div className="searchSpan">
            <FontAwesomeIcon icon={faSearch} className="icon" />
            <input
              type="text"
              onChange={this.changeHandler}
              value={this.state.text}
            />
          </div>
          <input className="searchButton" type="submit" value="Search" />
          
          
          <div>Sort Users:</div>
            <RadioGroup
            
            name="userSort"
            selectedValue={this.state.userSort}
            onChange={this.userSortChange}
            >
            
              <Radio value="user_alphabetical" disabled={this.state.userSortDisabled}/> alphabetical
            
           
              <Radio value="user_alphabetical_reverse" disabled={this.state.userSortDisabled}/> reverse alphabetical
            
            </RadioGroup>
            <div>Sort Projects:</div>
            <RadioGroup
            name="projectSort"
            selectedValue={this.state.projectSort}
            onChange={this.projectSortChange}
            >
            
              <Radio value="project_alphabetical" disabled={this.state.projectSortDisabled}/> alphabetical
            
           
              <Radio value="project_alphabetical_reverse" disabled={this.state.projectSortDisabled}/> reverse alphabetical
            
            
              <Radio value="project_highest_rated" disabled={this.state.projectSortDisabled}/> highest rated
            
              <Radio value="project_lowest_rated" disabled={this.state.projectSortDisabled}/> lowest rated
            
            </RadioGroup>
            <div>Sort Reviews:</div>
            <RadioGroup
            name="reviewSort"
            selectedValue={this.state.reviewSort}
            onChange={this.reviewSortChange}
            >
            
              <Radio value="review_alphabetical" disabled={this.state.reviewSortDisabled}/> alphabetical
            
            
              <Radio value="review_reverse_alphabetical" disabled={this.state.reviewSortDisabled}/> reverse alphabetical
            
            
              <Radio value="review_newest" disabled={this.state.reviewSortDisabled}/> newest
            
              <Radio value="review_oldest" disabled={this.state.reviewSortDisabled}/> oldest
            
            </RadioGroup>
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
