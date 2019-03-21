import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../signUp/signUp";
import { withFirebase } from "../firebase/index";
import * as ROUTES from "../../constants/routes";
import SignInGithub from "./thirdPartyApi/github";
import SignInGoogle from "./thirdPartyApi/google";
import SignInTwitter from "./thirdPartyApi/twitter";

const SignInPage = () => (
  <div>
    <h1>Sign In</h1>
    <SignInForm />
    <SignInGithub />
    <SignInGoogle />
    <SignInTwitter />
    <SignUpLink />
  </div>
);
const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class signInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = e => {
    const { email, password } = this.state;

    this.props.withFirebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(err => {
        this.setState({ err });
      });
    e.preventDefault();
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === "" || email === "";
    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
const SignInForm = compose(
  withRouter,
  withFirebase
)(signInFormBase);

export default SignInPage;

export { SignInForm };
