import React, { Component } from 'react';
import { compose } from 'recompose';
import * as ROUTES from '../../../constants/routes';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Firebase/Exports';
import Modal from 'react-modal';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;
const firebaseSignUp = gql`
  mutation firebaseSignUp(
    $username: String!
    $thirdPartyUID: String!
    $email: String!
  ) {
    firebaseSignUp(
      username: $username
      thirdPartyUID: $thirdPartyUID
      email: $email
    ) {
      id
      username
      email
      thirdPartyUID
    }
  }
`;

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isOpen: false,
      isNewUser: false,
      email: '',
      username: '',
      uid: ''
    };
  }

  setError = (err) => {
    this.setState({ err: err });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  secondSubmit = (e, signUpMutation, data) => {
    e.preventDefault();
    // console.log(data);
    signUpMutation({
      variables: {
        username: this.state.username,
        thirdPartyUID: this.state.uid,
        email: this.state.email
      }
    });
  };

  onSubmit = (event) => {
    this.props.firebase
      .doSignInWithGoogle()
      // console.log(this.props, 'home page props')
      .then((socialAuthUser) => {
        // 1. Catch GH user object here, parse it for isNewUser project, ifNewUser === true, push to More Info page
        // console.log('response from Google:', socialAuthUser);
        var userBooleanValue = JSON.parse(
          socialAuthUser.additionalUserInfo.isNewUser
        );
        // console.log('userBooleanValue', userBooleanValue);
        if (userBooleanValue) {
          const email = socialAuthUser.user.providerData['0'].email;
          const uid = socialAuthUser.user.providerData['0'].uid;
          /* userBooleanValue variable is set to the isNewUser key on the GH object,
      if that value === true, then push the route to more info page?
     */
          // We could use if-else do-while or switch statement instead of while
          this.setState({
            isNewUser: true,
            isOpen: true,
            email: email,
            uid: uid
          });
          // this.props.history.push(ROUTES.MORE_INFO);
        } else {
          this.props.history.push(ROUTES.HOME);
        }
        // console.log(socialAuthUser.user.providerData['0'].uid);
        return this.props.firebase
          .user(socialAuthUser.user.providerData['0'].uid)
          .set({
            email: socialAuthUser.user.email
          });
      })
      .catch((err) => {
        // console.log('err ', err);
        if (err.code === ERROR_CODE_ACCOUNT_EXISTS) {
          err.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setError(err);
      });
    event.preventDefault();
  };
  render() {
    const { error } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.onSubmit}>
          <button type="submit"> Sign In with Google </button>{' '}
          {error && <p> {error.message} </p>}
        </form>
        <Modal isOpen={this.state.isOpen} contentLabel="Example Modal">
          <div>
            <h1>Complete Your Sign Up.</h1>
            <Mutation mutation={firebaseSignUp}>
              {(signUpMutation, { data }) => {
                // console.log({ state: this.state, data: data })
                return (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      signUpMutation({
                        variables: {
                          username: this.state.username,
                          thirdPartyUID: this.state.uid,
                          email: this.state.email
                        }
                      });
                      this.props.history.push(ROUTES.HOME);
                    }}
                  >
                    <input
                      onChange={this.onChange}
                      defaultValue={this.state.email}
                      placeholder="email"
                      name="email"
                      value={this.state.email}
                    />
                    <input
                      onChange={this.onChange}
                      placeholder="username"
                      name="username"
                      value={this.state.username}
                    />
                    <button type="submit">Submit</button>
                  </form>
                );
              }}
            </Mutation>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

const GoogleBase = compose(
  withRouter,
  withFirebase
)(SignInGoogleBase);
Modal.setAppElement('body');

export default GoogleBase;
