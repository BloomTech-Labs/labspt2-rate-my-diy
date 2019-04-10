import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { getUsers, getProjects, getReviews } from './query/query';
import * as ROUTES from './constants/routes';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Navigation from './reactRouter/reactRouter';
import Home from './components/Home/Home';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import SearchPage from './components/SearchPage/SearchPage';
import PasswordForget from './components/PasswordForget/PasswordForget';
import Footer from './components/Footer/Footer';
import Account from './components/Account/Account';
import PasswordChange from './components/PasswordChange/PasswordChange';
import { withAuthentication } from './components/Session/session';
import ProjectList from './components/Account/Lists/ProjectList';
import ReviewList from './components/Account/Lists/ReviewList';
import CreateProject from './components/CreateProject/CreateProject';
import ProjectCard from './components/Account/ProjectCard/ProjectCard';
import ReviewCard from './components/Account/ReviewCard/ReviewCard';
import Profile from './components/Profile/Profile';
import * as math from 'mathjs';

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      projects: [],
      reviews: []
    };
  }

  projectSearchHandler = (projects) => {
    console.log({ projects: projects });
    this.setState({ projects });
  };

  userSearchHandler = (users) => {
    console.log({ users: users });
    this.setState({ users });
  };

  reviewSearchHandler = (reviews) => {
    console.log({ reviews: reviews });
    this.setState({ reviews });
  };

  render() {
    const RoutesWithData = () => (
      <Query query={getUsers}>
        {({ loading: loadingUsers, data: userData, error: userError }) => (
          <Query query={getProjects}>
            {({
              loading: loadingProjects,
              data: projectData,
              error: projectError
            }) => (
              <Query query={getReviews}>
                {({
                  loading: loadingReviews,
                  data: reviewData,
                  error: reviewError
                }) => {
                  if (loadingUsers || loadingProjects || loadingReviews)
                    return <span>loading...</span>;
                  if (userError) return <span>{`${userError}`}</span>;
                  if (projectError) return <span>{`${projectError}`}</span>;
                  if (reviewError) return <span>{`${reviewError}`}</span>;
                  let userArray = [];
                  let projectArray = [];
                  let reviewArray = [];

                  if (userData !== undefined)
                    userArray = Object.values(userData).flat();

                  if (projectData !== undefined)
                    projectArray = Object.values(projectData).flat();
                  projectArray = projectArray.map(
                    (project) =>
                      (project = {
                        ...project,
                        rating: parseFloat(math.mean(project.rating).toFixed(2))
                      })
                  );

                  if (reviewData !== undefined)
                    reviewArray = Object.values(reviewData).flat();
                  return (
                    <div>
                      <Route
                        exact
                        path={ROUTES.CREATE_PROJECT}
                        render={(props) => {
                          return (
                            <CreateProject
                              {...props}
                              projects={projectArray}
                              users={userArray}
                            />
                          );
                        }}
                      />
                      {userArray.map((user) => {
                        return (
                          <div key={user.id}>
                            <Route
                              exact
                              path={`/${user.username}/profile`}
                              render={(props) => {
                                return (
                                  <Profile {...props} email={user.email} />
                                );
                              }}
                            />
                            <Route
                              exact
                              path={`/${user.username}/projects`}
                              render={(props) => {
                                return (
                                  <ProjectList {...props} email={user.email} />
                                );
                              }}
                            />
                            <Route
                              exact
                              path={`/${user.username}/reviews`}
                              render={(props) => {
                                return (
                                  <ReviewList {...props} email={user.email} />
                                );
                              }}
                            />
                          </div>
                        );
                      })}
                      {projectArray.map((project) => {
                        return (
                          <Route
                            key={project.id}
                            exact
                            path={`/projects/${project.id}`}
                            render={(props) => {
                              return (
                                <ProjectCard {...props} project={project} />
                              );
                            }}
                          />
                        );
                      })}
                      {reviewArray.map((review) => {
                        return (
                          <Route
                            key={review.id}
                            exact
                            path={`/reviews/${review.id}`}
                            render={(props) => {
                              return <ReviewCard {...props} review={review} />;
                            }}
                          />
                        );
                      })}
                    </div>
                  );
                }}
              </Query>
            )}
          </Query>
        )}
      </Query>
    );

    return (
      <Router>
        <div>
          <Navigation />
          <Route
            exact
            path={ROUTES.HOME}
            render={(props) => (
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
            render={(props) => (
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
          {/* <Route path={ROUTES.CREATE_PROJECT} component={CreateProject} /> */}
          <RoutesWithData />
          <Route path={ROUTES.FOOTER} component={Footer} />
        </div>
      </Router>
    );
  }
}

// please update your components and Routes as needed

export default withAuthentication(App);
