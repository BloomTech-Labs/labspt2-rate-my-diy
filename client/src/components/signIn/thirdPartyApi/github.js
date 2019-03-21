import React, { Component } from "react";
import * as ROUTES from "../../../constants/routes";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../../firebase/index";

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInGithubBase extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  onSubmit = event => {
    this.props.firebase
      .doSignInWithGithub()
      .then(socialAuthUser => {
        return this.props.firebase.user(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.email,
            roles: []
          },
          { merge: true }
        );
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(err => {
        if (err.code === ERROR_CODE_ACCOUNT_EXISTS) {
          err.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setState({ err });
      });
    event.preventDefault();
  };
  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit">Sign In with Github</button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInGithub = compose(
  withRouter,
  withFirebase
)(SignInGithubBase);

export default SignInGithub;
