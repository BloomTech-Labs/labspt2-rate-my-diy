import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import SignOutButton from '../components/SignOut/SignOut';
import { withAuthentication } from '../components/Session/session';
import { AuthUserContext } from '../components/Session/session';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { fallDown as Menu } from 'react-burger-menu';

import './reactRouter.scss';

export const GET_USER = gql`
  query user($thirdPartyUID: String!) {
    user(where: { thirdPartyUID: $thirdPartyUID }) {
      id
      username
    }
  }
`;

const AuthNavigation = () => (
  <AuthUserContext.Consumer>
    {(authUser) =>
      authUser ? <Navigation authUser={authUser} /> : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>
);

const Navigation = ({ authUser }) => {
  console.log(authUser);
  const thirdPartyUID = authUser.providerData['0'].uid;

  return (
    <Query query={GET_USER} variables={{ thirdPartyUID: thirdPartyUID }}>
      {({ loading, data, error }) => {
        if (loading) return null;
        if (error) {
          console.log({ navError: error });
          return null;
        }
        if (data.user)
          return (
            <Menu pageWrapId={'page-wrap'} outerContainerId={'outer-container'}>
              <a href={ROUTES.HOME} className="menu-item">
                <div>Home</div>
              </a>

              <a href={'/search'} className="menu-item">
                <div>Search</div>
              </a>

              <a href={`/${data.user.username}/account`} className="menu-item">
                <div>My Account</div>
              </a>

              <a
                id="profile"
                href={`/${data.user.username}/profile`}
                className="menu-item"
              >
                <div>My Profile</div>
              </a>

              <a
                id="projects"
                href={`/${data.user.username}/projects`}
                className="menu-item"
              >
                <div>My Projects</div>
              </a>

              <a
                id="reviews"
                href={`/${data.user.username}/reviews`}
                className="menu-item"
              >
                <div>My Reviews</div>
              </a>

              <a id="create" className="menu-item" href={'/createproject'}>
                <div>Create Project</div>
              </a>

              <a id="signOut" href="/" className="menu-item">
                <SignOutButton />
              </a>
            </Menu>
          );

        return <NavigationNonAuth />;
      }}
    </Query>
  );
};

const NavigationNonAuth = () => {
  return (
    <React.Fragment>
      <Menu pageWrapId={'page-wrap'} outerContainerId={'outer-container'}>
        <a id="home" className="menu-item" href={ROUTES.HOME}>
          <div>Home</div>
        </a>
        <a id="signIn" className="menu-item" href={ROUTES.SIGN_IN}>
          <div>Sign In</div>
        </a>
      </Menu>
    </React.Fragment>
  );
};

export default withAuthentication(AuthNavigation);
