import React, { Component } from "react";
import { Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { getUsers, getProjects, getReviews } from "./query/query";
import * as ROUTES from "./constants/routes";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Navigation from "./reactRouter/reactRouter";
import Home from "./components/Home/Home";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import SearchPage from "./components/SearchPage/SearchPage";
import PasswordForget from "./components/PasswordForget/PasswordForget";
import Footer from "./components/Footer/Footer";
import Account from "./components/Account/Account";
import PasswordChange from "./components/PasswordChange/PasswordChange";
import { withAuthentication } from "./components/Session/session";
import ProjectList from "./components/Account/Lists/ProjectList";
import ReviewList from "./components/Account/Lists/ReviewList"
import CreateProject from "./components/CreateProject/CreateProject"
import ProjectCard from "./components/Account/ProjectCard/ProjectCard"
import ReviewCard from "./components/Account/ReviewCard/ReviewCard"

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      projects: [],
      reviews: []
    };
  }

  projectSearchHandler = projects => {
    this.setState({ projects });
  };

  userSearchHandler = users => {
    this.setState({ users });
  };

  reviewSearchHandler = reviews => {
    this.setState({ reviews });
  };

  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <Route
            exact
            path={ROUTES.HOME}
            render={props => (
              <Home
                {...props}
                projectSearchHandler={this.projectSearchHandler}
                userSearchHandler={this.userSearchHandler}
                reviewSearchHandler={this.reviewSearchHandler}
                getUsers={getUsers}
                getProjects={getProjects}
                getReviews={getReviews}
              />
            )}
          />
          <Route path={ROUTES.SIGN_IN} component={SignIn} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
          <Route path={ROUTES.PASSWORD_CHANGE} component={PasswordChange} />
          <Route
            path={ROUTES.SEARCH}
            render={props => (
              <SearchPage
                {...props}
                users={this.state.users}
                projects={this.state.projects}
                reviews={this.state.reviews}
                projectSearchHandler={this.projectSearchHandler}
                userSearchHandler={this.userSearchHandler}
                reviewSearchHandler={this.reviewSearchHandler}
                getUsers={getUsers}
                getProjects={getProjects}
                getReviews={getReviews}
              />
            )}
          />
          <Route path={ROUTES.ACCOUNT} component={Account} />
          <Route path={ROUTES.CREATE_PROJECT} component={CreateProject} />
          <Route path={ROUTES.FOOTER} component={Footer} />
          <Query
            query={gql`
              {
                users{
                  id
                  username
                  email
                }
              }
            `}
          >
            {({ loading, error, data }) => {
              if (loading || !data[0]) console.log("loading user query");
              if (error) console.log({ userQueryError: error });
              let userArray = Object.values(data).flat()

              return (
                userArray.map(user => {
                  return (
                    <div key={user.id}>
                      <Route
                        exact
                        path={`/${user.username}/projects`}
                        render={props => {
                          return <ProjectList {...props} email={user.email} />;
                        }}
                      />
                      {user.Projects.map(project => {
                        return (
                        <Route
                        key={project.id}
                        exact
                        path={`/${user.username}/projects/${project.id}`}
                        render={props => {
                          return <ProjectCard {...props} project={project} />;
                        }}
                      />)
                      })}
                      <Route
                        exact
                        path={`/${user.username}/reviews`}
                        render={props => {
                          return <ReviewList {...props} email={user.email} />;
                        }}
                      />
                      {user.ReviewList.map(review => {
                        return (
                        <Route
                        key={review.id}
                        exact
                        path={`/${user.username}/reviews/${review.id}`}
                        render={props => {
                          return <ReviewCard {...props} review={review} />;
                        }}
                      />)
                      })}
                    </div>
                  );
                })
              )
           
                
                
              
              }}
            
              
          </Query>
        </div>
      </Router>
    );
  }
}

// please update your components and Routes as needed

export default withAuthentication(App);
