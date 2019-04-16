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
  // const json = localStorage.getItem('authUser');
  //     const user = JSON.parse(json);
  const email = authUser.email;
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
            <Link to={ROUTES.ACCOUNT}>My Account</Link>
          </li>
          <Query query={GET_USER} variables={{ email: email }}>
            {({ loading, error, data }) => {
              if (loading) {
                console.log({ profLoading: loading });
                return null;
              }
              if (error) {
                console.log({ profError: error });
                return null;
              }
              if (data) {
                console.log({ profData: data });
                return (
                  <li>
                    <Link to={`/${data.user.username}/profile`}>
                      My Profile
                    </Link>
                  </li>
                );
              }
            }
            // (
            //   <li>
            //     <Link to={`/${user.username}/profile`}>My Profile</Link>
            //   </li>
            // )
            }
          </Query>
          <li>
            <Link to={ROUTES.CREATE_PROJECT}>Create Project</Link>
          </li>
        </ul>
        <SignOutButton />
      </div>
    </React.Fragment>
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
