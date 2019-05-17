import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { withFirebase } from '../../components/Firebase/Exports'
import * as ROUTES from '../../constants/routes'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import './Signup.scss'
import { GET_NATIVE_USER } from '../../reactRouter/reactRouter'
const newUser = gql`
  mutation newUser($username: String!, $firebaseUID: String!, $email: String!) {
    newUser(username: $username, firebaseUID: $firebaseUID, email: $email) {
      id
      username
      email
      firebaseUID
    }
  }
`

const SignUpPage = () => {
  return (
    <div className="signUpWrapper">
      <h2>Sign Up</h2>
      <p>And be a part of the most creative community on the net</p>
      <SignUpForm />
    </div>
  )
}
const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  uid: '',
}
class SignUpFormBase extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }
  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }
  render() {
    const { username, email, passwordOne, passwordTwo } = this.state
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''
    return (
      <React.Fragment>
        <Mutation mutation={newUser}>
          {(newUser, { loading, error, data }) => {
            if (loading)
              return (
                <form>
                  <input
                    name="username"
                    value={username}
                    onChange={this.onChangeHandler}
                    type="text"
                    placeholder="Username"
                    disabled
                  />
                  <input
                    name="email"
                    value={email}
                    onChange={this.onChangeHandler}
                    type="text"
                    placeholder="Email Address"
                    disabled
                  />
                  <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChangeHandler}
                    type="password"
                    placeholder="Password"
                    disabled
                  />
                  <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChangeHandler}
                    type="password"
                    placeholder="Confirm password."
                    disabled
                  />
                  <button disabled type="submit">
                    {' '}
                    Sign Up
                  </button>
                  <div>Submitting your change...</div>
                </form>
              )
            if (error) {
              console.log({ passChangeError: error })
              return (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const { username, email, passwordOne } = this.state
                    const roles = []
                    this.props.firebase
                      .doCreateUserWithEmailAndPassword(email, passwordOne)
                      .then((authUser) => {
                        this.setState({ uid: authUser.user.uid })
                        return this.props.firebase.user(authUser.user.uid).set(
                          {
                            username,
                            email,
                            roles,
                          },
                          { merge: true }
                        )
                      })
                      .then(() => {
                        newUser({
                          variables: {
                            username: this.state.username,
                            firebaseUID: this.state.uid,
                            email: this.state.email,
                          },
                        })
                      })
                      .then(() => {
                        this.props.history.push(ROUTES.HOME)
                      })
                      .catch((err) => {
                        // Made error codes/msg's strings until we set the value.
                        if (err.code === 'ERROR_CODE_ACCOUNT_EXISTS') {
                          err.message = 'ERROR_MSG_ACCOUNT_EXISTS'
                        }

                        this.setState({ err })
                      })
                  }}
                >
                  <input
                    name="username"
                    value={username}
                    onChange={this.onChangeHandler}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    name="email"
                    value={email}
                    onChange={this.onChangeHandler}
                    type="text"
                    placeholder="Email Address"
                  />
                  <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChangeHandler}
                    type="text"
                    placeholder="Password"
                  />
                  <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChangeHandler}
                    type="text"
                    placeholder="Confirm password."
                  />
                  <button disabled={isInvalid} type="submit">
                    {' '}
                    Sign Up
                  </button>
                  <div>There was an error submitting your change.</div>
                </form>
              )
            }
            if (data)
              return (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const { username, email, passwordOne } = this.state
                    const roles = []
                    this.props.firebase
                      .doCreateUserWithEmailAndPassword(email, passwordOne)
                      .then((authUser) => {
                        this.setState({ uid: authUser.user.uid })
                        return this.props.firebase.user(authUser.user.uid).set(
                          {
                            username,
                            email,
                            roles,
                          },
                          { merge: true }
                        )
                      })
                      .then(() => {
                        newUser({
                          variables: {
                            username: this.state.username,
                            firebaseUID: this.state.uid,
                            email: this.state.email,
                          },
                        })
                      })
                      .then(() => {
                        this.props.history.push(ROUTES.HOME)
                      })
                      .catch((err) => {
                        // Made error codes/msg's strings until we set the value.
                        if (err.code === 'ERROR_CODE_ACCOUNT_EXISTS') {
                          err.message = 'ERROR_MSG_ACCOUNT_EXISTS'
                        }

                        this.setState({ err })
                      })
                  }}
                >
                  <input
                    name="username"
                    value={username}
                    onChange={this.onChangeHandler}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    name="email"
                    value={email}
                    onChange={this.onChangeHandler}
                    type="text"
                    placeholder="Email Address"
                  />
                  <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChangeHandler}
                    type="text"
                    placeholder="Password"
                  />
                  <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChangeHandler}
                    type="text"
                    placeholder="Confirm password."
                  />
                  <button disabled={isInvalid} type="submit">
                    {' '}
                    Sign Up
                  </button>
                  <div>Your change was successfully submitted!</div>
                </form>
              )
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const { username, email, passwordOne } = this.state
                  const roles = []
                  this.props.firebase
                    .doCreateUserWithEmailAndPassword(email, passwordOne)
                    .then((authUser) => {
                      this.setState({ uid: authUser.user.uid })
                      return this.props.firebase.user(authUser.user.uid).set(
                        {
                          username,
                          email,
                          roles,
                        },
                        { merge: true }
                      )
                    })
                    .then(() => {
                      newUser({
                        variables: {
                          username: this.state.username,
                          firebaseUID: this.state.uid,
                          email: this.state.email,
                        },
                        refetchQueries: [
                          {
                            query: GET_NATIVE_USER,
                            variables: { username: this.state.username },
                          },
                        ],
                      })
                    })
                    .then(() => {
                      this.props.history.push(ROUTES.HOME)
                    })
                    .catch((err) => {
                      // Made error codes/msg's strings until we set the value.
                      if (err.code === 'ERROR_CODE_ACCOUNT_EXISTS') {
                        err.message = 'ERROR_MSG_ACCOUNT_EXISTS'
                      }

                      this.setState({ err })
                    })
                }}
              >
                <input
                  name="username"
                  value={username}
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Username"
                />
                <input
                  name="email"
                  value={email}
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Email Address"
                />
                <input
                  name="passwordOne"
                  value={passwordOne}
                  onChange={this.onChangeHandler}
                  type="password"
                  placeholder="Password"
                />
                <input
                  name="passwordTwo"
                  value={passwordTwo}
                  onChange={this.onChangeHandler}
                  type="password"
                  placeholder="Confirm password."
                />
                <button disabled={isInvalid} type="submit">
                  {' '}
                  Sign Up
                </button>
                {error && <p>{error.message}</p>}
              </form>
            )
          }}
        </Mutation>
      </React.Fragment>
    )
  }
}
const SignUpLink = () => {
  return (
    <p>
      Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
  )
}
const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase)
// Allow SignUpForm to use Firebase and Router via recompose.

export default SignUpPage
export { SignUpForm, SignUpLink }
