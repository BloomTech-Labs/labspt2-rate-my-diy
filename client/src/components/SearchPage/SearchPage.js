import React, { Component } from "react";
import SearchBar from "../Home/Searchbar/Searchbar";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withAuthentication } from "../Session/session";

import Featured from "../Home/Featured/Featured";
import Header from "../Home/Header/Header";
import "../Home/Home.scss";
import "./SearchPage.scss";

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      userClicked: null,
      users: [],
      projects: [],
      reviews: []
    };
  }

  searchHandler = (users, reviews, projects) => {
    if (users) {
      this.setState({ users });
    }
    if (reviews) {
      this.setState({ reviews });
    }
    if (projects) {
      this.setState({ projects });
    }

    console.log({users, projects, reviews})
  };

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
                      searchHandler={this.searchHandler}
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
        <div className="card-container">
          {this.state.projects
            .map(({ id, name, titleImg, rating, User }) => (
              <Featured
                key={id}
                image={titleImg}
                rating={rating}
                title={name}
                // below might need to be edited
                username={User.username}
                // clickHandler={this.clickUserHandler}
              />
            ))
            .concat(
              this.state.users.map(({ id, username, userProfileImage, averageRating }) => (
                <Featured
                  key={id}
                  username={username}
                  image={userProfileImage}
                  // clickHandler={this.clickUserHandler}
                  rating={averageRating}
                />
              ))
            )
            .concat(
              this.state.reviews.map(
                ({ id, name, text, editedAt, Author, ProjectReviewed }) => (
                  <Featured
                    key={id}
                    title={name}
                    username={Author.username}
                    project={ProjectReviewed.name}
                  />
                )
              )
            )}
        </div>
      </div>
    );
  }
}

export default withAuthentication(SearchPage);
