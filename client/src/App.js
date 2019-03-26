import React, { Component } from "react";
import { Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";


import * as ROUTES from "./constants/routes";
import { withFirebase } from "./components/Firebase/Exports";
import Navigation from "./reactRouter/reactRouter";
import Home from './components/Home/Home';
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import PasswordForget from "./components/PasswordForget/PasswordForget";
import Footer from './components/Footer/Footer';
import Stripe from './components/Stripe/Stripe'
import Account from './components/Account/Account';

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
          <Route exact path={ROUTES.HOME} component={Home} />
          <Route path={ROUTES.SIGN_IN} component={SignIn} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
          <Route path={ROUTES.ACCOUNT} component={Account} />
          <Route path={ROUTES.FOOTER} component={Footer} />
        </div>
      </Router>
    
      );
  }
}

// please update your components and Routes as needed

export default withFirebase(App);
