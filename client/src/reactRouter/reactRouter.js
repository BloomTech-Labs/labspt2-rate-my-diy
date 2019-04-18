import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import SignOutButton from '../components/SignOut/SignOut';
import { withAuthentication } from '../components/Session/session';
import { AuthUserContext } from '../components/Session/session';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './reactRouter.scss';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {(authUser) =>
      authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => {
  const GET_USER = gql`
    query user($email: String!) {
      user(where: { email: $email }) {
        id
        username
      }
    }
  `;
  const json = localStorage.getItem('authUser');
  const user = JSON.parse(json);
  const email = user.email;
  return (
    <Query query={GET_USER} variables={{ email: email }}>
      {({ loading, data, error }) => {
        if (loading) return null;
        if (error) {
          console.log({ navError: error });
          return null;
        }
        if (data)
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
                    <Link to={`/${data.user.username}/account`}>
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link to={`/${data.user.username}/profile`}>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to={`/${data.user.username}/projects`}>
                      My Projects
                    </Link>
                  </li>
                  <li>
                    <Link to={`/${data.user.username}/reviews`}>
                      My Reviews
                    </Link>
                  </li>
                  <SignOutButton />
                </ul>
              </div>
            </React.Fragment>
          );
        return null;
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

export default withAuthentication(Navigation);
