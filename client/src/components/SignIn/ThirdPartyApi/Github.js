import React, { Component } from "react";
import * as ROUTES from "../../../constants/routes";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../../Firebase/Exports";

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
      // console.log(this.props, 'home page props')
      .then(socialAuthUser => {
       console.log('response from gitHub:', socialAuthUser,)
       var userBooleanValue = JSON.parse(socialAuthUser.additionalUserInfo.isNewUser)
       console.log('userBooleanValue', userBooleanValue)
       while (userBooleanValue) {
        /* userBooleanValue variable is set to the isNewUser key on the GH object,
         if that value === true, then push the route to more info page?
        */ 
        // We could use if-else do-while or switch statement instead of while
        this.props.history.push(ROUTES.MORE_INFO)
       }
         return this.props.firebase.user(socialAuthUser.user.providerData.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: []
         });
        })
        .then((socialAuthUser) => {
        return this.props.history.push(ROUTES.HOME);
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
