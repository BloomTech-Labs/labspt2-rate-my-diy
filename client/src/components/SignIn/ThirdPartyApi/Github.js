import React, { Component } from 'react';
import * as ROUTES from '../../../constants/routes';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Firebase/Exports';
import Modal from 'react-modal';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Mutation, Query } from 'react-apollo';

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

const CHECK_IF_USER_EXISTS = gql`
  query user($thirdPartyUID: String!) {
    user(where: { thirdPartyUID: $thirdPartyUID }) {
      id
      thirdPartyUID
      username
      email
    }`;

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

class SignInGithubBase extends Component {
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
  secondSubmit = (e) => {
    e.preventDefault();
  };
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  setError = (errVal) => {
    this.setState({
      errVal,
      isNewUser: false
    });
  };
  onSubmit = (event) => {
    event.preventDefault();
    this.props.firebase
      .doSignInWithGithub()
      .then((socialAuthUser) => {
        const thirdPartyUID = socialAuthUser.user.providerData['0'].uid;
        return (
          <Query
            query={CHECK_IF_USER_EXISTS}
            variables={{ thirdPartyUID: thirdPartyUID }}
          >
            {({ loading, data, error }) => {
              if (loading) return null;
              if (error) {
                console.log({ error: error });
                return null;
              }
              if (data) console.log({ data: data });
              return null;
            }}
          </Query>
        );
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { error } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.onSubmit}>
          <button type="submit"> Sign In with Github </button>{' '}
          {error && <p> {error.message} </p>}
        </form>
        <Modal isOpen={this.state.isOpen} contentLabel="Example Modal">
          <div>
            <h1>Complete Your Sign Up.</h1>
            <Mutation mutation={firebaseSignUp}>
              {(firebaseSignUp) => {
                console.log({ state: this.state });
                return (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      firebaseSignUp({
                        variables: {
                          username: this.state.username,
                          thirdPartyUID: this.state.uid,
                          email: this.state.email
                        }
                      });
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

const SignInGithub = compose(
  withRouter,
  withFirebase
)(SignInGithubBase);
Modal.setAppElement('body');

export default SignInGithub;
