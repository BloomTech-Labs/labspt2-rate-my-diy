import React, { Component } from "react";
import { Route } from "react-router-dom";
import Navigation from "./reactRouter/reactRouter";
import LandingPage from "./views/landingPage/landingPage";
import SignUp from "./firebase/signUp/signUp";
import SignInPage from "./firebase/signIn/signIn";
import SignUpPage from "./firebase/signUp/signUp";
import PasswordForget from "./firebase/passwordForget/passwordForget";
import HomePage from "./views/homePage/homePage";
import AccountPage from "./firebase/account/account";
import AdminPage from "./views/adminPage/adminPage";
import ReviewList from "./views/reviewList/reviewList";
import ProjectList from "./views/projectList/projectList";

import * as ROUTES from "../src/constants/routes";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null
    };
  }

  render() {
    return (
      <React.Fragment>
        <Navigation />
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUp} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
        <Route path={ROUTES.REVIEW_LIST} component={ReviewList} />
        <Route path={ROUTES.PROJECT_LIST} component={ProjectList} />
      </React.Fragment>
    );
  }
}

// please update your components and Routes as needed

export default App;
