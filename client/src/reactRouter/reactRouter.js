import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import SignOutButton from "../firebase/signOut/signOut";

const Navigation = ({ authUser }) => (
  <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
);

const NavigationAuth = () => {
  return (
    <ul>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
      <li>
        <Link to={ROUTES.LANDING}>Landing Page</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home Page</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>My Account</Link>
      </li>
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
      <SignOutButton />
    </ul>
  );
};
const NavigationNonAuth = () => {
  return (
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </ul>
  );
};

export default Navigation;
