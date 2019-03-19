import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import SignOutButton from '../firebase/signOut/signOut';

function ReactRouter() {
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
}

export default ReactRouter;
