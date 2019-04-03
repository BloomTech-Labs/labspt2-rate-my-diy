import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import LoginPopup from "../LoginPopUp/LoginPopUp";
import Fuse from "fuse.js";
import { withFirebase } from '../Firebase/Exports'
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
      reviewSortDisabled: true,
      experimentTho: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userClicked !== null) {
      this.setState({ text: nextProps.userClicked });
    }
  }

  componentDidMount(){
   const user = this.props.firebase.auth.currentUser !== null
 
   if (user){
    this.setState({
     isLoggedIn: true,
     experimentTho: "Hello, world!"
    })
   }
   else if (!user) {
    this.setState({
     isLoggedIn: false,
     experimentTho: "Hello, world!" 
    })
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
      });
    }

    if(!options.includes('user')){
      this.setState({
        userSortDisabled: true
      });
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
      });
    }

    if(options.includes("review")) {
      this.setState({
        reviewSortDisabled: false
      });
    }

    this.setState({
      options: [...options]
    });

    console.log({state: this.state});
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
    console.log({stateAfterSort: this.state, sortOption: option});
  }
    
  projectSortChange = option => {
    this.setState({
      projectSort: option
    })
    console.log({stateAfterSort: this.state, sortOption: option})
  
  }

  reviewSortChange = option => {
    this.setState({
      reviewSort: option
    })
    console.log({stateAfterSort: this.state, sortOption: option})
  
  }

  search = option => {
    let options = {
      shouldSort: true,
      threshold: 0.4,
      keys: []
    };

    if (option.includes("user")) {
      options.keys.push("username");

      const usersFuse = new Fuse(this.props.users, options);
      let userSearch = usersFuse.search(this.state.text);

      if(this.state.userSort === 'alpha') userSearch = userSearch.sort(function (a, b) { return a.username - b.username });
      
      if(this.state.userSort === 'revAlpha') userSearch = userSearch.sort(function (a, b) { return a.username - b.username }).reverse();

      this.props.searchHandler(userSearch)

      this.props.history.push('/search');
    }

    

    if (option.includes("category") && this.state.stars === 0) {
      options.keys.push("category");
      const projectsFuse = new Fuse(this.props.projects, options);
      let categorySearch = projectsFuse.search(this.state.category);

      if(this.state.projectSort === 'alpha') categorySearch = categorySearch.sort(function (a, b) { return a.name - b.name });
      
      if(this.state.projectSort === 'revAlpha') categorySearch = categorySearch.sort(function (a, b) { return a.name - b.name }).reverse();

      if(this.state.projectSort === 'highest') categorySearch = categorySearch.sort(function (a, b) { return b.rating - a.rating });
      
      if(this.state.projectSort === 'lowest') categorySearch = categorySearch.sort(function (a, b) { return a.rating - b.rating });

      this.props.searchHandler(categorySearch);

      this.props.history.push('/search');
    }

    if (!option.includes("category") && this.state.stars > 0) {
      options.keys.push("category");
      const projectsFuse = new Fuse(this.props.projects, options);
      const categorySearch = projectsFuse.search(this.state.category);
      let projectCategoryStarsSearch = categorySearch.filter(project => project.rating >= this.state.stars)

      if(this.state.projectSort === 'alpha') projectCategoryStarsSearch = projectCategoryStarsSearch.sort(function (a, b) { return a.name - b.name });
      
      if(this.state.projectSort === 'revAlpha') projectCategoryStarsSearch = projectCategoryStarsSearch.sort(function (a, b) { return a.name - b.name }).reverse();

      if(this.state.projectSort === 'highest') projectCategoryStarsSearch = projectCategoryStarsSearch.sort(function (a, b) { return b.rating - a.rating });
      
      if(this.state.projectSort === 'lowest') projectCategoryStarsSearch = projectCategoryStarsSearch.sort(function (a, b) { return a.rating - b.rating });

      this.props.searchHandler(projectCategoryStarsSearch)

      this.props.history.push('/search');
    }


    if (option.includes("review")) {
      options.keys.push("name");

      const reviewsFuse = new Fuse(this.props.reviews, options);
      let reviewSearch = reviewsFuse.search(this.state.text);

      if(this.state.reviewSort === 'alpha') reviewSearch = reviewSearch.sort(function (a, b) { return a.name - b.name }).reverse();
      
      if(this.state.reviewSort === 'revAlpha') reviewSearch = reviewSearch.sort(function (a, b) { return a.name - b.name });

      if(this.state.reviewSort === 'newest') reviewSearch = reviewSearch.sort(function (a, b) { return new Date(b.date) - new Date(a.date) });

      if(this.state.reviewSort === 'oldest') reviewSearch = reviewSearch.sort(function (a, b) { return new Date(b.date) - new Date(a.date)}).reverse();

      this.props.searchHandler(reviewSearch);

      this.props.history.push('/search');
    }

    if (option.includes("project")) {
      options.keys.push("name");

      const projectsFuse = new Fuse(this.props.projects, options);
      let projectSearch = projectsFuse.search(this.state.text);
      

      if(this.state.projectSort === 'alpha') projectSearch = projectSearch.sort(function (a, b) { return a.name - b.name });
      
      if(this.state.projectSort === 'revAlpha') projectSearch = projectSearch.sort(function (a, b) { return a.name - b.name }).reverse();

      if(this.state.projectSort === 'highest') projectSearch = projectSearch.sort(function (a, b) { return b.rating - a.rating });
      
      if(this.state.projectSort === 'lowest') projectSearch = projectSearch.sort(function (a, b) { return a.rating - b.rating });

      this.props.searchHandler(projectSearch)

      this.props.history.push('/search');
    } 
    if(this.state.stars > 0 && option.includes('project')){
      const projectsFuse = new Fuse(this.props.projects, options);
      let projectSearch = projectsFuse.search(this.state.text);
      let starsSearch = projectSearch.filter(project => project.rating >= this.state.stars)
      
      if(this.state.projectSort === 'alpha') starsSearch = starsSearch.sort(function (a, b) { return a.name - b.name });
      
      if(this.state.projectSort === 'revAlpha') starsSearch = starsSearch.sort(function (a, b) { return a.name - b.name }).reverse();

      if(this.state.projectSort === 'highest') starsSearch = starsSearch.sort(function (a, b) { return b.rating - a.rating });
      
      if(this.state.projectSort === 'lowest') starsSearch = starsSearch.sort(function (a, b) { return a.rating - b.rating });

      this.props.searchHandler(starsSearch)

      this.props.history.push('/search');
    }

    if (this.state.stars > 0 && !option.includes('project')) {
      let justStarsSearch = this.props.projects.filter(
        project => project.rating >= this.state.stars
      );

      if(this.state.projectSort === 'alpha') justStarsSearch = justStarsSearch.sort(function (a, b) { return a.name - b.name });
      
      if(this.state.projectSort === 'revAlpha') justStarsSearch = justStarsSearch.sort(function (a, b) { return a.name - b.name }).reverse();

      if(this.state.projectSort === 'highest') justStarsSearch = justStarsSearch.sort(function (a, b) { return b.rating - a.rating });
      
      if(this.state.projectSort === 'lowest') justStarsSearch = justStarsSearch.sort(function (a, b) { return a.rating - b.rating });
      
      this.props.searchHandler(justStarsSearch)

      this.props.history.push('/search');
    }
    else {
      options.keys.push("name");
    }
  };

  render() {
   // this.props.firebase.auth.b.currentUser = true 
   console.log(this.props.firebase.auth.currentUser)
   console.log("State: ",this.state)
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
            
              <Radio value="alpha" disabled={this.state.userSortDisabled}/> alphabetical
           
              <Radio value="revAlpha" disabled={this.state.userSortDisabled}/> reverse alphabetical
            
            </RadioGroup>
              <div>Sort Projects:</div>
              <RadioGroup
                name="projectSort"
                selectedValue={this.state.projectSort}
                onChange={this.projectSortChange}
              >
            
              <Radio value="alpha" disabled={this.state.projectSortDisabled}/> alphabetical
           
              <Radio value="revAlpha" disabled={this.state.projectSortDisabled}/> reverse alphabetical
            
              <Radio value="highest" disabled={this.state.projectSortDisabled}/> highest rated
            
              <Radio value="lowest" disabled={this.state.projectSortDisabled}/> lowest rated
            
            </RadioGroup>
              <div>Sort Reviews:</div>
              <RadioGroup
                name="reviewSort"
                selectedValue={this.state.reviewSort}
                onChange={this.reviewSortChange}
              >
  
              <Radio value="alpha" disabled={this.state.reviewSortDisabled}/> alphabetical
            
              <Radio value="revAlpha" disabled={this.state.reviewSortDisabled}/> reverse alphabetical
            
              <Radio value="newest" disabled={this.state.reviewSortDisabled}/> newest
            
              <Radio value="oldest" disabled={this.state.reviewSortDisabled}/> oldest
            
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

export default withFirebase(SearchBar);
