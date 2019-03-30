import React, { Component } from "react";
import SearchBar from "../Searchbar/Searchbar";
import { Query } from "react-apollo";
import gql from "graphql-tag";
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
    };
  }

  render() {
    const getUsers = gql`
      {
        users {
          id
          username
          userProfileImage
        }
      }
    `;
    const getProjects = gql`
      {
        projects {
          id
          name
          titleImg
          category
          rating
          User{
              username
          }
        }
      }
    `;
    const getReviews = gql`
      {
        reviews {
          id
          name
          text
          editedAt
          Author {
            id
            username
          }
          ProjectReviewed {
            id
            name
          }
        }
      }
    `;
    const SearchWithData = () => (
      <Query query={getUsers}>
        {({ loading: loadingUsers, data: userData }) => (
          <Query query={getProjects}>
            {({ loading: loadingProjects, data: projectData }) => (
              <Query query={getReviews}>
                {({ loading: loadingReviews, data: reviewData }) => {
                  if (loadingUsers || loadingProjects || loadingReviews)
                    return <span>loading...</span>;
                  const userArray = Object.values(userData).flat();
                  const projectArray = Object.values(projectData).flat();
                  const reviewArray = Object.values(reviewData).flat();
                  return (
                    <SearchBar
                      userClicked={this.state.userClicked}
                      users={userArray}
                      projects={projectArray}
                      reviews={reviewArray}
                      searchHandler={this.props.searchHandler}
                    />
                  );
                }}
              </Query>
            )}
          </Query>
        )}
      </Query>
    );

    return (
      <div id="home-container">
        <Header />
        <SearchWithData />
        <h1>Results:</h1>
        {/* <div className="card-container"> */}
          {this.props.projects
            .map(({ id, name, titleImg, rating, User }) => (
              <div key={id} className="card-container">
                  <img src={`${titleImg}`} alt="project"/>
                  <div>{`${name}`}</div>
                  <div>{`${rating}`}</div>
                  <div>{`${User.username}`}</div>
              </div>
            ))
            .concat(
              this.props.users.map(({ id, username, userProfileImage }) => (
                <div id={id} className="card-container">
                    <img src={`${userProfileImage}`} alt="user"/>
                    <div>{`${username}`}</div>
                </div>
              ))
            )
            .concat(
              this.props.reviews.map(
                ({ id, name, text, editedAt, Author, ProjectReviewed }) => (
                <div key={id} className="card-container">
                    <div>{`${name}`}</div>
                    <div>{`${text}`}</div>
                    <div>{`${editedAt}`}</div>
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
