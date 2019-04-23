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
              <Link to={ROUTES.HOME} className="menu-item">
                Home
              </Link>

              <Link to={'/search'} className="menu-item">
                Search
              </Link>

              <Link to={`/${data.user.username}/account`} className="menu-item">
                My Account
              </Link>

              <a
                id="profile"
                href={`/${data.user.username}/profile`}
                className="menu-item"
              >
                My Profile
              </a>

              <a
                id="projects"
                href={`/${data.user.username}/projects`}
                className="menu-item"
              >
                My Projects
              </a>

              <a
                id="reviews"
                href={`/${data.user.username}/reviews`}
                className="menu-item"
              >
                My Reviews
              </a>

              <Link to={'/createproject'}>Create Project</Link>

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
      <div className="overlay">
        <label htmlFor="toggle" />
      </div>

      <input type="checkbox" id="toggle" name="toggle" />
      <div className="verticalNav">
        <ul>
          <li>
            <Link to={ROUTES.HOME}>Home</Link>
          </li>
          <li>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

export default withAuthentication(AuthNavigation);
