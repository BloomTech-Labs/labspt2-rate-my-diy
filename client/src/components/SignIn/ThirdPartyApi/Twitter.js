import React, { Component } from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../../../constants/routes";
import { withFirebase } from "../../Firebase/Exports";

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInTwitterBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null
    };
  }

  submitHandler = event => {
    this.props.firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        console.log(socialAuthUser);
        return this.props.firebase.user(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.additionalUserInfo.profile.name,
            roles: []
          },
          { merge: true }
        );
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setState({
          error
        });
      });
    event.preventDefault();
  };
  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.submitHandler}>
        <button type="submit">Sign In With Twitter</button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const TwitterBase = compose(
  withRouter,
  withFirebase
)(SignInTwitterBase);

export default TwitterBase;
