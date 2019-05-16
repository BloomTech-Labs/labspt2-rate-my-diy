import React, { Component } from 'react';
import * as ROUTES from '../../../constants/routes';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Firebase/Exports';
import Modal from 'react-modal';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';
import { Mutation, Query } from 'react-apollo';
import { GET_THIRD_USER } from '../../../reactRouter/reactRouter';
import { GithubLoginButton } from 'react-social-login-buttons';
import '../SignIn.scss'

const CHECK_IF_USER_EXISTS = gql`
  query user($thirdPartyUID: String!) {
    user(where: { thirdPartyUID: $thirdPartyUID }) {
      id
      thirdPartyUID
      username
      email
    }
  }
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

class SignInGithubBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isOpen: false,
      isNewUser: false,
      email: '',
      username: '',
      uid: '',
      signedUp: false
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
  onSubmit = () => {
    this.props.firebase
      .doSignInWithGithub()
      .then((socialAuthUser) => {
        const thirdPartyUID = socialAuthUser.user.providerData['0'].uid;
        this.setState({ uid: thirdPartyUID, isOpen: true });
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { error } = this.state;
    if (this.state.signedUp) {
      return <Redirect to={ROUTES.HOME} />;
    }
    return (
      <React.Fragment>
        <Query
          query={CHECK_IF_USER_EXISTS}
          variables={{ thirdPartyUID: this.state.uid }}
        >
          {({ loading, data, error: checkError }) => {
            if (loading)
              return (
                <form onSubmit={this.onSubmit}>
                  <GithubLoginButton size="35px" onClick={this.onSubmit} />
                  <div>Loading...</div>
                  {error && <p> {error.message} </p>}
                </form>
              );
            if (checkError) {
              console.log({ error: checkError });
              return (
                <form onSubmit={this.onSubmit}>
                  <GithubLoginButton size="35px" onClick={this.onSubmit} />
                  <div>There was an error.</div>
                  {error && <p> {error.message} </p>}
                </form>
              );
            }
            if (data && !data.user) {
              return (
                <div>
                  <form onSubmit={this.onSubmit}>
                    <GithubLoginButton size="35px" onClick={this.onSubmit} />
                    
                    {error && <p> {error.message} </p>}
                  </form>
                  <Modal
                    isOpen={this.state.isOpen}
                    contentLabel="Example Modal"
                  >
                    <div className="infoModal">
                      <h1>Complete Your Sign Up.</h1>
                      <Mutation
                        mutation={firebaseSignUp}
                        refetchQueries={() => {
                          return [
                            {
                              query: GET_THIRD_USER,
                              variables: { thirdPartyUID: this.state.uid }
                            }
                          ];
                        }}
                      >
                        {(firebaseSignUp, refetchQueries) => {
                          return (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                await firebaseSignUp({
                                  variables: {
                                    username: this.state.username,
                                    thirdPartyUID: this.state.uid,
                                    email: this.state.email
                                  }
                                });
                                await this.setState({ signedUp: true });
                                await refetchQueries();
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
                </div>
              );
            }
            if (data && data.user.thirdPartyUID) {
              this.props.history.push(ROUTES.HOME);
            }
            return (
              <form onSubmit={this.onSubmit}>
                <GithubLoginButton size="35px" onClick={this.onSubmit} />
                
                {error && <p> {error.message} </p>}
              </form>
            );
          }}
        </Query>
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
