import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import LoginPopup from '../LoginPopUp/LoginPopUp';
import Fuse from 'fuse.js';
import moment from "moment";
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { RadioGroup, Radio } from 'react-radio-group';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import '../../styles/_globals.scss';
import './Searchbar.scss';

class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      isLoggedIn: this.props.loggedIn,
      user: this.props.user,
      displayPopUp: false,
      options: ['project'],
      userSort: '',
      projectSort: '',
      reviewSort: '',
      stars: 0,
      category: '',
      filterDisabled: true,
      categoryDisabled: false,
      starsDisabled: false,
      userSortDisabled: true,
      projectSortDisabled: false,
      reviewSortDisabled: true,
      users: [],
      projects: [],
      reviews: [],
    }
  }

  changeHandler = (e) => {
    this.setState({ text: e.target.value })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    if (this.state.isLoggedIn) {
      let options = []

      if (this.state.options.includes('user')) {
        await options.push('user')
      }

      if (this.state.options.includes('project')) {
        await options.push('project')
      }

      if (this.state.options.includes('review')) {
        await options.push('review')
      }

      if (this.state.options.includes('category')) {
        await options.push('category')
      }
      await this.search(options)
    } else {
      await this.setState({ displayPopUp: true })
    }
  }

  closePopUp = async () => {
    await this.setState({ displayPopUp: false })

    let options = []

    if (this.state.options.includes('user')) {
      await options.push('user')
    }

    if (this.state.options.includes('project')) {
      await options.push('project')
    }

    if (this.state.options.includes('review')) {
      await options.push('review')
    }

    if (this.state.options.includes('category')) {
      await options.push('category')
    }
    await this.search(options)
  }

  filterOnClick = () => {
    this.setState({ filterDisabled: !this.state.filterDisabled })
  }

  optionsChanged = (options) => {
    if (options.includes('user')) {
      this.setState({
        userSortDisabled: false,
      })
    }

    if (!options.includes('user')) {
      this.setState({
        userSortDisabled: true,
      })
    }

    if (!options.includes('project')) {
      this.setState({
        categoryDisabled: true,
        starsDisabled: true,
        projectSortDisabled: true,
      })
    }

    if (options.includes('project')) {
      this.setState({
        categoryDisabled: false,
        starsDisabled: false,
        projectSortDisabled: false,
      })
    }

    if (!options.includes('review')) {
      this.setState({
        reviewSortDisabled: true,
      })
    }

    if (options.includes('review')) {
      this.setState({
        reviewSortDisabled: false,
      })
    }

    if (this.state.categoryDisabled) {
      let newOpts = options.filter((option) => option !== 'category')
      this.setState({
        options: [...newOpts],
      })
    }

    if (!this.state.categoryDisabled) {
      let newOpts = options
      this.setState({
        options: [...newOpts],
      })
    }
  }

  starChange = (e) => {
    const stars = parseInt(e.target.value)
    this.setState({
      stars: stars,
    })
  }

  categoryChange = (e) => {
    this.setState({
      category: e.target.value,
      options: [...this.state.options, 'category'],
    })
  }

  userSortChange = (option) => {
    this.setState({
      userSort: option,
    })
    
  }

  projectSortChange = (option) => {
    this.setState({
      projectSort: option,
    })
    
  }

  reviewSortChange = (option) => {
    
    this.setState({
      reviewSort: option,
    })
    
  }

  search = (option) => {
    let options = {
      shouldSort: true,
      threshold: 0.3,
      keys: [],
    }

    // user search

    if (option.includes('user')) {
      options.keys.push('username')

      const usersFuse = new Fuse(this.props.users, options)

      if (this.state.text !== "") {
        let userSearch = usersFuse.search(this.state.text)

        if (this.state.userSort === 'alpha')
          userSearch = userSearch.sort(function(a, b) {
            return a.username.toLowerCase() > b.username.toLowerCase() ? 1 : a.username.toLowerCase() < b.username.toLowerCase() ? -1 : 0;
          })

        if (this.state.userSort === 'revAlpha')
          userSearch = userSearch
            .sort(function(a, b) {
              return a.username.toLowerCase() > b.username.toLowerCase() ? 1 : a.username.toLowerCase() < b.username.toLowerCase() ? -1 : 0;
            })
            .reverse()

        this.props.userSearchHandler(userSearch)

        this.props.history.push('/search')
      }

      if (this.state.text === "") {
        let userSearch = this.props.users
        if (this.state.userSort === 'alpha')
          userSearch = userSearch.sort(function(a, b) {
            return a.username.toLowerCase() > b.username.toLowerCase() ? 1 : a.username.toLowerCase() < b.username.toLowerCase() ? -1 : 0;
          })

        if (this.state.userSort === 'revAlpha')
          userSearch = userSearch
            .sort(function(a, b) {
              return a.username.toLowerCase() > b.username.toLowerCase() ? 1 : a.username.toLowerCase() < b.username.toLowerCase() ? -1 : 0;
            })
            .reverse()

        this.props.userSearchHandler(userSearch)

        this.props.history.push('/search')
      }
    }

    //reviews search

    

    if (option.includes('review')) {
      options.keys.push('name')
      const reviewsFuse = new Fuse(this.props.reviews, options)
      if (this.state.text !== "") {
        let reviewSearch = reviewsFuse.search(this.state.text)


        if (this.state.reviewSort === 'alpha')
          reviewSearch = reviewSearch
            .sort(function(a, b) {
              return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
            })
            

        if (this.state.reviewSort === 'revAlpha')
          reviewSearch = reviewSearch.sort(function(a, b) {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
          }).reverse()

        if (this.state.reviewSort === 'newest')
       
          reviewSearch = reviewSearch.map(rev => {
            const time = new moment(rev.timestamp).format('YYYYMMDD')
            const timestamp = parseInt(time)
            rev.timestamp = timestamp
            
            return rev
          }).sort((a, b) => a.timestamp - b.timestamp).reverse().map(rev => {
            const tim = rev.timestamp.toString()
            const timestam = new moment(tim)
            rev.timestamp = timestam
           
            return rev
          })

        if (this.state.reviewSort === 'oldest')
       
          reviewSearch = reviewSearch.map(rev => {
            const time = new moment(rev.timestamp).format('YYYYMMDD')
            const timestamp = parseInt(time)
            rev.timestamp = timestamp
            
            return rev
          }).sort((a, b) => a.timestamp - b.timestamp)
            .map(rev => {
              const tim = rev.timestamp.toString()
              const timestam = new moment(tim)
              rev.timestamp = timestam
              
              return rev
            })

        this.props.reviewSearchHandler(reviewSearch)

        this.props.history.push('/search')
      }
      if (this.state.text === "") {
        let reviewSearch = this.props.reviews

        if (this.state.reviewSort === 'alpha')
          reviewSearch = reviewSearch
            .sort(function(a, b) {
              return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
            })
            

        if (this.state.reviewSort === 'revAlpha')
          reviewSearch = reviewSearch.sort(function(a, b) {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
          }).reverse()

        if (this.state.reviewSort === 'newest')
        
          reviewSearch = reviewSearch.map(rev => {
            const time = new moment(rev.timestamp).format('YYYYMMDD')
            const timestamp = parseInt(time)
            rev.timestamp = timestamp
            
            return rev
          }).sort((a, b) => a.timestamp - b.timestamp).reverse().map(rev => {
            const tim = rev.timestamp.toString()
            const timestam = new moment(tim)
            rev.timestamp = timestam
            
            return rev
          })

        if (this.state.reviewSort === 'oldest')
        
          reviewSearch = reviewSearch.map(rev => {
            const time = new moment(rev.timestamp).format('YYYYMMDD')
            const timestamp = parseInt(time)
            rev.timestamp = timestamp
            return rev
          }).sort((a, b) => a.timestamp - b.timestamp)
            .map(rev => {
              const tim = rev.timestamp.toString()
              const timestam = new moment(tim)
              rev.timestamp = timestam
              return rev
            })

        this.props.reviewSearchHandler(reviewSearch)

        this.props.history.push('/search')
      }
    }

    //project search

    if (option.includes('project')) {
      options.keys.push('name')

      // category

      if (option.includes('category')) {
        // category & stars

        if (this.state.stars > 0) {
          const projectsFuse = new Fuse(this.props.projects, options)

          // category & stars & text

          if (this.state.text !== "") {
            let projectSearch = projectsFuse.search(this.state.text)
            let starsSearch = projectSearch.filter(
              (project) => project.rating >= this.state.stars
            ).filter(proj => proj.category === this.state.category)

            if (this.state.projectSort === 'alpha')
              starsSearch = starsSearch.sort(function(a, b) {
                
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
              })

            if (this.state.projectSort === 'revAlpha')
              starsSearch = starsSearch
                .sort(function(a, b) {
                  return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
                })
                .reverse()

            if (this.state.projectSort === 'highest')
              starsSearch = starsSearch.sort(function(a, b) {
                return b.rating - a.rating
              })

            if (this.state.projectSort === 'lowest')
              starsSearch = starsSearch.sort(function(a, b) {
                return a.rating - b.rating
              })

            this.props.projectSearchHandler(starsSearch)

            this.props.history.push('/search')
          }

          //category & stars & no text

          if (this.state.text === "") {
            let projectSearch = this.props.projects
            let starsSearch = projectSearch.filter(
              (project) => project.rating >= this.state.stars
            ).filter(proj => proj.category === this.state.category)

            if (this.state.projectSort === 'alpha')
              starsSearch = starsSearch.sort(function(a, b) {
                
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
              })

            if (this.state.projectSort === 'revAlpha')
              starsSearch = starsSearch
                .sort(function(a, b) {
                  return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
                })
                .reverse()

            if (this.state.projectSort === 'highest')
              starsSearch = starsSearch.sort(function(a, b) {
                return b.rating - a.rating
              })

            if (this.state.projectSort === 'lowest')
              starsSearch = starsSearch.sort(function(a, b) {
                return a.rating - b.rating
              })

            this.props.projectSearchHandler(starsSearch)

            this.props.history.push('/search')
          }
        }

        //category & no stars
        if (this.state.stars === 0) {
          const projectsFuse = new Fuse(this.props.projects, options)

          //category & no stars & text

          if (this.state.text !== "") {
            let projectSearch = projectsFuse.search(this.state.text).filter(proj => proj.category === this.state.category)

            if (this.state.projectSort === 'alpha')
              projectSearch = projectSearch.sort(function(a, b) {
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
              })

            if (this.state.projectSort === 'revAlpha')
              projectSearch = projectSearch
                .sort(function(a, b) {
                  return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
                })
                .reverse()

            if (this.state.projectSort === 'highest')
              projectSearch = projectSearch.sort(function(a, b) {
                return b.rating - a.rating
              })

            if (this.state.projectSort === 'lowest')
              projectSearch = projectSearch.sort(function(a, b) {
                return a.rating - b.rating
              })

            this.props.projectSearchHandler(projectSearch)

            this.props.history.push('/search')
          }

          // category & no stars & no text

          if (this.state.text === "") {
            let projectSearch = this.props.projects.filter(proj => proj.category === this.state.category)

            if (this.state.projectSort === 'alpha')
              projectSearch = projectSearch.sort(function(a, b) {
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
              })

            if (this.state.projectSort === 'revAlpha')
              projectSearch = projectSearch
                .sort(function(a, b) {
                  return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
                })
                .reverse()

            if (this.state.projectSort === 'highest')
              projectSearch = projectSearch.sort(function(a, b) {
                return b.rating - a.rating
              })

            if (this.state.projectSort === 'lowest')
              projectSearch = projectSearch.sort(function(a, b) {
                return a.rating - b.rating
              })

            this.props.projectSearchHandler(projectSearch)

            this.props.history.push('/search')
          }
        }
      }

      // no category

      if (!option.includes('category')) {
        // no category & stars

        if (this.state.stars > 0) {
          const projectsFuse = new Fuse(this.props.projects, options)

          // no category & stars & text

          if (this.state.text !== "") {
            let projectSearch = projectsFuse.search(this.state.text)
            let starsSearch = projectSearch.filter(
              (project) => project.rating >= this.state.stars
            )

            if (this.state.projectSort === 'alpha')
              starsSearch = starsSearch.sort(function(a, b) {
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
              })

            if (this.state.projectSort === 'revAlpha')
              starsSearch = starsSearch
                .sort(function(a, b) {
                  return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
                })
                .reverse()

            if (this.state.projectSort === 'highest')
              starsSearch = starsSearch.sort(function(a, b) {
                return b.rating - a.rating
              })

            if (this.state.projectSort === 'lowest')
              starsSearch = starsSearch.sort(function(a, b) {
                return a.rating - b.rating
              })

            this.props.projectSearchHandler(starsSearch)

            this.props.history.push('/search')
          }

          // no category & stars & no text

          if (this.state.text === "") {
            let projectSearch = this.props.projects
            let starsSearch = projectSearch.filter(
              (project) => project.rating >= this.state.stars
            )

            if (this.state.projectSort === 'alpha')
              starsSearch = starsSearch.sort(function(a, b) {
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
              })

            if (this.state.projectSort === 'revAlpha')
              starsSearch = starsSearch
                .sort(function(a, b) {
                  return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
                })
                .reverse()

            if (this.state.projectSort === 'highest')
              starsSearch = starsSearch.sort(function(a, b) {
                return b.rating - a.rating
              })

            if (this.state.projectSort === 'lowest')
              starsSearch = starsSearch.sort(function(a, b) {
                return a.rating - b.rating
              })

            this.props.projectSearchHandler(starsSearch)

            this.props.history.push('/search')
          }
        }

        //no category & no stars

        if (this.state.stars === 0) {
          const projectsFuse = new Fuse(this.props.projects, options)

          // no category & no stars & text

          if (this.state.text !== "") {
            let projectSearch = projectsFuse.search(this.state.text)

            if (this.state.projectSort === 'alpha')
              projectSearch = projectSearch.sort(function(a, b) {
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
              })

            if (this.state.projectSort === 'revAlpha')
              projectSearch = projectSearch
                .sort(function(a, b) {
                  return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
                })
                .reverse()

            if (this.state.projectSort === 'highest')
              projectSearch = projectSearch.sort(function(a, b) {
                return b.rating - a.rating
              })

            if (this.state.projectSort === 'lowest')
              projectSearch = projectSearch.sort(function(a, b) {
                return a.rating - b.rating
              })

            this.props.projectSearchHandler(projectSearch)

            this.props.history.push('/search')
          }

          // no category & no stars & no text
          if (this.state.text === "") {
            let projectSearch = this.props.projects

            if (this.state.projectSort === 'alpha')
              projectSearch = projectSearch.sort(function(a, b) {
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
              })

            if (this.state.projectSort === 'revAlpha')
              projectSearch = projectSearch
                .sort(function(a, b) {
                  return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0;
                })
                .reverse()

            if (this.state.projectSort === 'highest')
              projectSearch = projectSearch.sort(function(a, b) {
                return b.rating - a.rating
              })

            if (this.state.projectSort === 'lowest')
              projectSearch = projectSearch.sort(function(a, b) {
                return a.rating - b.rating
              })

            this.props.projectSearchHandler(projectSearch)

            this.props.history.push('/search')
          }
        }
      }
    }

    if (!option.includes('user')) {
      this.props.userSearchHandler([])
    }

    if (!option.includes('project')) {
      this.props.projectSearchHandler([])
    }

    if (!option.includes('review')) {
      this.props.reviewSearchHandler([])
    }

    if (!option[0]) {
      options.keys.push('username')
      options.keys.push('name')

      let userSearch = this.props.users
      let projectSearch = this.props.projects
      let reviewSearch = this.props.reviews

      this.props.userSearchHandler(userSearch)
      this.props.projectSearchHandler(projectSearch)
      this.props.reviewSearchHandler(reviewSearch)

      this.props.history.push('/search')
    }
  }

  popUp = () => {
    this.state.isLoggedIn
      ? this.setState({ displayPopUp: false })
      : this.setState({ displayPopUp: true })
  }

  render() {
    let categories = []
    if (this.props.projects)
      categories = this.props.projects.map((project) => project.category)
    let filteredCategories = [...new Set(categories)]

    if (this.props.projects) {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <div className="searchBar">
              <div className="searchInput">
                <FontAwesomeIcon icon={faSearch} className="icon" />
                <input
                  type="text"
                  onChange={this.changeHandler}
                  value={this.state.text}
                />
              </div>
              <input className="searchButton" type="submit" value="Search" />
            </div>
            <div className="filterContainer">
              <div className="searchByContainer">
                <>
                  <CheckboxGroup
                    checkboxDepth={2} // This is needed to optimize the checkbox group
                    name="options"
                    className="checkboxGroup"
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
                </>
                <>
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
                    {filteredCategories.map((category) => {
                      return (
                        <option
                          value={category}
                          key={category}
                        >{`${category}`}</option>
                      )
                    })}
                  </select>
                  {this.state.filterDisabled ? (
                    <button onClick={this.filterOnClick}>Sort</button>
                  ) : null}
                </>
              </div>
              {!this.state.filterDisabled ? (
                <div className="filter-options">
                  <h4>Sort Users:</h4>
                  <RadioGroup
                    name="userSort"
                    className="radioGroup"
                    selectedValue={this.state.userSort}
                    onChange={this.userSortChange}
                  >
                    <div className="radio">
                      <Radio
                        value="alpha"
                        disabled={this.state.userSortDisabled}
                      />{' '}
                      <p>alphabetical</p>
                    </div>
                    <div className="radio">
                      <Radio
                        value="revAlpha"
                        disabled={this.state.userSortDisabled}
                      />{' '}
                      <p>reverse alphabetical</p>
                    </div>
                  </RadioGroup>
                  <h4>Sort Projects:</h4>
                  <RadioGroup
                    name="projectSort"
                    className="radioGroup"
                    selectedValue={this.state.projectSort}
                    onChange={this.projectSortChange}
                  >
                    <div className="radio">
                      <Radio
                        value="alpha"
                        disabled={this.state.projectSortDisabled}
                      />
                      {''}
                      <p>alphabetical</p>
                    </div>
                    <div className="radio">
                      <Radio
                        value="revAlpha"
                        disabled={this.state.projectSortDisabled}
                      />{' '}
                      <p>reverse alphabetical</p>
                    </div>
                    <div className="radio">
                      <Radio
                        value="highest"
                        disabled={this.state.projectSortDisabled}
                      />{' '}
                      <p>highest rated</p>
                    </div>
                    <div className="radio">
                      <Radio
                        value="lowest"
                        disabled={this.state.projectSortDisabled}
                      />{' '}
                      <p>lowest rated</p>
                    </div>
                  </RadioGroup>
                  <h4>Sort Reviews:</h4>
                  <RadioGroup
                    name="reviewSort"
                    className="radioGroup"
                    selectedValue={this.state.reviewSort}
                    onChange={this.reviewSortChange}
                  >
                    <div className="radio">
                      <Radio
                        value="alpha"
                        disabled={this.state.reviewSortDisabled}
                      />{' '}
                      <p>alphabetical</p>
                    </div>
                    <div className="radio">
                      <Radio
                        value="revAlpha"
                        disabled={this.state.reviewSortDisabled}
                      />{' '}
                      <p>reverse alphabetical</p>
                    </div>
                    <div className="radio">
                      <Radio
                        value="newest"
                        disabled={this.state.reviewSortDisabled}
                      />{' '}
                      <p>newest</p>
                    </div>
                    <div className="radio">
                      <Radio
                        value="oldest"
                        disabled={this.state.reviewSortDisabled}
                      />{' '}
                      <p>oldest</p>
                    </div>
                  </RadioGroup>
                  <button onClick={this.filterOnClick}>Close</button>
                </div>
              ) : null}
            </div>
          </form>

          <LoginPopup
            show={this.state.displayPopUp}
            closePopUp={this.closePopUp}
          />
        </div>
      )
    } else {
      return (
        <>
          <form>
            <SkeletonTheme highlightColor="#6fb3b8">
              <div className="searchBar">
                <div className="searchInput">
                  <FontAwesomeIcon icon={faSearch} className="icon" />
                  <div className="skeletonBar">
                    <Skeleton />
                  </div>
                </div>

                <input
                  className="searchButton"
                  type="submit"
                  disabled
                  value="Search"
                />
              </div>
            </SkeletonTheme>
            <div className="filterContainer">
              <div className="searchByContainer">
                <>
                  <div className="checkboxGroup">
                    <Skeleton />
                  </div>
                </>
                <>
                  <Skeleton count={3} />
                </>
              </div>
            </div>
          </form>
        </>
      )
    }
  }
}

export default SearchBar
