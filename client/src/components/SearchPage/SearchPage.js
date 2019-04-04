import React, { Component } from "react";
import SearchBar from "../Searchbar/Searchbar";
import { Query } from "react-apollo";
import { withAuthentication } from "../Session/session";

// import Featured from "../Home/Featured/Featured";
import Header from "../Home/Header/Header";
import "../Home/Home.scss";
import "./SearchPage.scss";

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      userClicked: null,
      isLoggedIn: false,
      user: ""
    };
  }

  componentWillMount() {
    let user = this.props.firebase.auth.currentUser !== null;
    if (user) {
      this.setState({ isLoggedIn: true, user: user });
    } else {
      this.setState({ isLoggedIn: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    let user = nextProps.firebase.auth.currentUser !== null;
    if (user) {
      this.setState({ isLoggedIn: true, user: user });
    } else {
      this.setState({ isLoggedIn: false, user: "" });
    }
  }

  // componentDidUpdate() {
  // 	let user = this.props.firebase.auth.currentUser !== undefined
  //   if (user) {
  //     this.setState({isLoggedIn: true, user: user})
  //   } else {
  //     this.setState({isLoggedIn: false})
  // }

  // }

  render() {
    const SearchWithData = () => (
      <Query query={this.props.getUsers}>
        {({ loading: loadingUsers, data: userData, error: userError }) => (
          <Query query={this.props.getProjects}>
            {({
              loading: loadingProjects,
              data: projectData,
              error: projectError
            }) => (
              <Query query={this.props.getReviews}>
                {({
                  loading: loadingReviews,
                  data: reviewData,
                  error: reviewError
                }) => {
                  if (loadingUsers || loadingProjects || loadingReviews)
                    return <span>loading...</span>;
                  if (userError) console.log({ userError: userError });
                  if (projectError) console.log({ projectError: projectError });
                  if (reviewError) console.log({ projectError: reviewError });
                  let userArray = [];
                  let projectArray = [];
                  let reviewArray = [];

                  if (userData !== undefined)
                    userArray = Object.values(userData).flat();

                  if (projectData !== undefined)
                    projectArray = Object.values(projectData).flat();

                  if (reviewData !== undefined)
                    reviewArray = Object.values(reviewData).flat();
                  // const userArray = Object.values(userData).flat()
                  // const projectArray = Object.values(projectData).flat()
                  // const reviewArray = Object.values(reviewData).flat()

                  return (
                    <SearchBar
                      {...this.props}
                      userClicked={this.state.userClicked}
                      user={this.state.user}
                      loggedIn={this.state.isLoggedIn}
                      users={userArray}
                      projects={projectArray}
                      reviews={reviewArray}
                      projectSearchHandler={this.props.projectSearchHandler}
                      userSearchHandler={this.props.userSearchHandler}
                      reviewSearchHandler={this.props.reviewSearchHandler}
                    />
                  );
                }}
              </Query>
            )}
          </Query>
        )}
      </Query>
    );
    console.log({ loggedIn: this.state.isLoggedIn, user: this.state.user });

    return (
      <div id="home-container">
        <Header />
        <SearchWithData />
        <h1>Results:</h1>
        {/* <div className="card-container"> */}
        {this.props.projects
          .map(({ id, name, titleImg, rating, User, category }) => (
            <div key={id} className="card-container">
              <img src={`${titleImg}`} alt="project" />
              <div>{`${name}`}</div>
              <div>{`${rating}`}</div>
              <div>{`${category}`}</div>
              <div>{`${User.username}`}</div>
            </div>
          ))
          .concat(
            this.props.users.map(({ id, username, userProfileImage }) => (
              <div key={id} className="card-container">
                <img src={`${userProfileImage}`} alt="user" />
                <div>{`${username}`}</div>
              </div>
            ))
          )
          .concat(
            this.props.reviews.map(
              ({ id, name, text, timestamp, Author, ProjectReviewed }) => (
                <div key={id} className="card-container">
                  <div>{`${name}`}</div>
                  <div>{`${text}`}</div>
                  <div>{`${timestamp}`}</div>
                  <div>{`${Author.username}`}</div>
                  <div>{`${ProjectReviewed.name}`}</div>
                </div>
              )
            )
          )}
        {/* </div> */}
      </div>
    );
  }
}

export default withAuthentication(SearchPage);
