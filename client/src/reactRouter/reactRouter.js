import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import SignOutButton from '../components/SignOut/SignOut';
import { withAuthentication } from '../components/Session/session';
import { AuthUserContext } from '../components/Session/session';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './reactRouter.scss';

const Navigation = (props) => {
  console.log(props);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(props.authUser.data.email);

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
  return (
    <Query query={GET_USER} variables={{ email: email }}>
      {({ loading, data, error }) => {
        if (loading) return null;
        if (error) {
          console.log({ navError: error });
          return null;
        }
        console.log(data, 'data');
        if (data.user.username) {
          setUsername(data.user.username);
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
        }
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

export default withAuthentication(Navigation);
