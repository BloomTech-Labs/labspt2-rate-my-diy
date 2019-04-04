import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import SignOutButton from "../components/SignOut/SignOut";
import { withAuthentication } from "../components/Session/session";
import { AuthUserContext } from "../components/Session/session";

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = () => {
  return (
    <ul>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>My Account</Link>
      </li>
      <SignOutButton />
    </ul>
  );
};
const NavigationNonAuth = () => {
  return (
    <ul>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </ul>
  );
};

export default withAuthentication(Navigation);
