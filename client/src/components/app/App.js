import React, { Component } from "react";
import { Route } from "react-router-dom";
import Navigation from "../../reactRouter/reactRouter";
import LandingPage from "../../views/landingPage/landingPage";
import SignInPage from "../signIn/signIn";
import SignUpPage from "../signUp/signUp";
import PasswordForget from "../passwordForget/passwordForget";
import HomePage from "../../views/homePage/homePage";
import AccountPage from "../account/account";
import AdminPage from "../../views/adminPage/adminPage";
import ReviewList from "../../views/reviewList/reviewList";
import ProjectList from "../../views/projectList/projectList";
import { withFirebase } from "../firebase/index";
import { BrowserRouter as Router } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null
    };
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
          <Route path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route path={ROUTES.REVIEW_LIST} component={ReviewList} />
          <Route path={ROUTES.PROJECT_LIST} component={ProjectList} />
        </div>
      </Router>
    );
  }
}

// please update your components and Routes as needed

export default withFirebase(App);
