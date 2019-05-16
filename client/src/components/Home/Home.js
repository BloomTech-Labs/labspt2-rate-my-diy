import React, { Component } from 'react'
import SearchBar from '../Searchbar/Searchbar'
import { withAuthentication } from '../Session/session'
import moment from 'moment'
import Featured from './Featured/Featured'
import './Home.scss'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userClicked: null,
      isLoggedIn: this.props.loggedIn,
      user: '',
    }
  }

  //This handler adds the user clicked in Popular Reviewer and Popular maker to userClicked
  clickUserHandler = (username) => {
    this.setState({ userClicked: username })
  }

  filterByCurrentMonth = (data) => {
    const filteredData = data.map((item) => {
      if (moment({ hours: 0 }).diff(item.timestamp, 'days') <= 30) {
        return item
      }
      return null
    })

    return filteredData.filter(function(e) {
      return e
    })
  }

  filterByCurrentMonthReviews = (data) => {
    //We clean the data we got to get over by taking out users that have no reviews
    const eliminateEmptyReviews = data.filter((item) => {
      if (item.ReviewList[0] !== undefined) {
        return item
      }
      return null
    })

    const popularReviewer = []

    for (let i = 0; i < eliminateEmptyReviews.length; i++) {
      //We get the reviews that are from the current month
      let currentReviews = eliminateEmptyReviews[i].ReviewList.filter(
        (review) => {
          if (moment({ hours: 0 }).diff(review.timestamp, 'days') <= 30) {
            return review
          }
          return null
        }
      )

      /* 
        This one is really good. We mutate the review list object array with the new array that has 
        the reviews with the current date and replace the old with the new.
      */

      eliminateEmptyReviews[i].ReviewList = currentReviews

      //This block of code just grabs the thumbs up total of the reviews and returns just that
      let thumbsUpTotal = 0

      eliminateEmptyReviews[i].ReviewList.map((review) => {
        return (thumbsUpTotal += review.thumbsUp)
      })

      //A way to sanitize our reviews because if a reviewer is not liked I'm sorry buddy you are not popular period
      if (thumbsUpTotal !== 0) {
        popularReviewer.push({
          id: eliminateEmptyReviews[i].id,
          username: eliminateEmptyReviews[i].username,
          email: eliminateEmptyReviews[i].email,
          userProfileImage: eliminateEmptyReviews[i].userProfileImage,
          thumbsUpTotal,
        })
      }
    }
    return popularReviewer.sort((a, b) => b.thumbsUpTotal - a.thumbsUpTotal)
  }

  render() {
    const projects =
      this.filterByCurrentMonth(this.props.projectArray)
        .slice(0, 4)
        .sort(function(a, b) {
          return b.rating - a.rating
        }) || []

    const currentMakers =
      this.props.userArray
        .map((user) => {
          const currentProject = this.filterByCurrentMonth(user.Projects)

          if (currentProject.length === 0) {
            return null
          }

          const rating = currentProject.map((project) => {
            let meanRating = project.rating

            return meanRating
          })

          ///Checks for the mode average

          let frequency = {} // array of frequency.
          let max = 0 // holds the max frequency.
          let average // holds the max frequency element.
          for (let v in rating) {
            frequency[rating[v]] = (frequency[rating[v]] || 0) + 1 // increment frequency.
            if (frequency[rating[v]] > max) {
              // is this frequency > max so far ?
              max = frequency[rating[v]] // update max.
              average = rating[v] // update result.
            }
          }

          return {
            id: user.id,
            username: user.username,
            userProfileImage: user.userProfileImage,
            averageRating: average,
          }
        })
        .filter((e) => e !== undefined && e !== null) || []

    const sortedMakers =
      currentMakers
        .sort(function(a, b) {
          return b.averageRating - a.averageRating
        })
        .slice(0, 8) || []

    const reviews = this.filterByCurrentMonthReviews(this.props.userArray) || []

    if (this.props.userArray[0]) {
      return (
        <div>
          <SearchBar
            {...this.props}
            userClicked={this.state.userClicked}
            user={this.state.user}
            loggedIn={this.state.isLoggedIn}
            users={this.props.userArray}
            projects={this.props.projectArray}
            reviews={this.props.reviewArray}
            projectSearchHandler={this.props.projectSearchHandler}
            userSearchHandler={this.props.userSearchHandler}
            reviewSearchHandler={this.props.reviewSearchHandler}
          />

          <div className="homeContainer">
            <h2 className="projectTitle">Featured Projects</h2>

            <div className="home-card-container">
              {projects.map(({ id, name, titleImg, rating, User }) => {
                return (
                  <Featured
                    key={id}
                    id={id}
                    image={titleImg}
                    rating={rating}
                    title={name}
                    username={User.username}
                    clickHandler={this.clickUserHandler}
                  />
                )
              }) || <Featured />}
            </div>

            <h2>Popular Makers</h2>

            <div className="home-card-container">
              {sortedMakers.map(
                ({ id, username, userProfileImage, averageRating }) => (
                  <Featured
                    key={id}
                    username={username}
                    image={userProfileImage}
                    clickHandler={this.clickUserHandler}
                    rating={averageRating}
                  />
                )
              )}
            </div>

            <h2>Popular Reviewers</h2>

            <div className="home-card-container">
              {reviews
                .map(({ id, username, userProfileImage, thumbsUpTotal }) => (
                  <Featured
                    key={id}
                    username={username}
                    thumbsUp={thumbsUpTotal}
                    image={userProfileImage}
                    clickHandler={this.clickUserHandler}
                  />
                ))
                .slice(0, 8)}
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <SearchBar loggedIn={this.state.isLoggedIn} />

          <div className="homeContainer">
            <h2 className="projectTitle">Featured Projects</h2>

            <div className="home-card-container">
              <Featured />
              <Featured />
              <Featured />
            </div>

            <h2>Popular Makers</h2>

            <div className="home-card-container">
              <Featured />
              <Featured />
              <Featured />
            </div>

            <h2>Popular Reviewers</h2>

            <div className="home-card-container">
              <Featured />
              <Featured />
              <Featured />
            </div>
          </div>
        </div>
      )
    }
  }
}

export default withAuthentication(Home)
