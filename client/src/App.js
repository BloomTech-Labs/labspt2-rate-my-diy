import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { getUsers, getProjects, getReviews } from './query/query';
import * as ROUTES from './constants/routes';
import { Query } from 'react-apollo';
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
import ProjectList from './components/Lists/ProjectList';
import ReviewList from './components/Lists/ReviewList';
import CreateProject from './components/CreateProject/CreateProject';
import ProjectCard from './components/ProjectCard/ProjectCard';
import ReviewCard from './components/ReviewCard/ReviewCard';
import Profile from './components/Profile/Profile';
import EditProject from './components/CreateProject/EditProject';
import Header from './components/Home/Header/Header';
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
    this.setState({ projects });
  };

  userSearchHandler = (users) => {
    this.setState({ users });
  };

  reviewSearchHandler = (reviews) => {
    this.setState({ reviews });
  };

  render() {
    const RoutesWithData = () => (
      <Query query={getUsers}>
        {({
          loading: loadingUsers,
          data: userData,
          error: userError,
          refetch: userRefetch
        }) => (
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
                  error: reviewError,
                  refetch
                }) => {
                  if (loadingUsers || loadingProjects || loadingReviews)
                    return <span>loading...</span>;
                  if (userError)
                    return <span>{`userError: ${userError}`}</span>;
                  if (projectError)
                    return <span>{`projectError: ${projectError}`}</span>;
                  if (reviewError)
                    return <span>{`reviewError: ${reviewError}`}</span>;

                  let userArray = [];
                  let projectArray = [];
                  let reviewArray = [];

                  if (userData !== undefined)
                    userArray = Object.values(userData).flat();

                  if (projectData !== undefined)
                    projectArray = Object.values(projectData).flat();
                  projectArray = projectArray.map((project) => {
                    if (project.length > 1) {
                      return (project = {
                        ...project,
                        rating: parseFloat(
                          math.mean(project.rating.slice(1)).toFixed(2)
                        )
                      });
                    } else {
                      return (project = {
                        ...project,
                        rating: parseFloat(math.mean(project.rating).toFixed(2))
                      });
                    }
                  });

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
                                  <Profile
                                    {...props}
                                    email={user.email}
                                    user={user}
                                  />
                                );
                              }}
                            />
                            <Route
                              exact
                              path={`/${user.username}/projects`}
                              render={(props) => {
                                return (
                                  <ProjectList
                                    {...props}
                                    email={user.email}
                                    user={user}
                                  />
                                );
                              }}
                            />
                            <Route
                              exact
                              path={`/${user.username}/reviews`}
                              render={(props) => {
                                return (
                                  <ReviewList
                                    {...props}
                                    email={user.email}
                                    users={userArray}
                                    user={user}
                                  />
                                );
                              }}
                            />
                            <Route
                              exact
                              path={`/${user.username}/account`}
                              render={(props) => (
                                <Account
                                  {...props}
                                  email={user.email}
                                  user={user}
                                />
                              )}
                            />
                          </div>
                        );
                      })}
                      {projectArray.map((project) => {
                        return (
                          <div key={project.id}>
                            <Route
                              exact
                              path={`/projects/${project.id}`}
                              render={(props) => {
                                return (
                                  <ProjectCard
                                    {...props}
                                    project={project}
                                    users={userArray}
                                    reviews={reviewArray}
                                    refetch={refetch}
                                  />
                                );
                              }}
                            />
                            <Route
                              key={project.id}
                              exact
                              path={`/projects/${project.id}/edit`}
                              render={(props) => {
                                return (
                                  <EditProject
                                    {...props}
                                    project={project}
                                    projects={projectArray}
                                    users={userArray}
                                  />
                                );
                              }}
                            />
                          </div>
                        );
                      })}

                      {reviewArray.map((review) => {
                        let user = userArray.filter(
                          (user) => user.email === review.Author.email
                        );
                        return (
                          <Route
                            key={review.id}
                            exact
                            path={`/reviews/${review.id}`}
                            render={(props) => {
                              return (
                                <ReviewCard
                                  {...props}
                                  review={review}
                                  users={userArray}
                                  user={user}
                                  refetch={userRefetch}
                                />
                              );
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
          <Header />
          <div className="main-container">
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

            <RoutesWithData />
            <Route path={ROUTES.FOOTER} component={Footer} />
          </div>
        </div>
      </Router>
    );
  }
}

// please update your components and Routes as needed

export default withAuthentication(App);
