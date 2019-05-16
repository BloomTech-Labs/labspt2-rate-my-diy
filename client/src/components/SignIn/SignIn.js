import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { SignUpLink } from '../SignUp/SignUp'
import { withFirebase } from '../Firebase/Exports'
import * as ROUTES from '../../constants/routes'
import SignInGithub from './ThirdPartyApi/Github'
import SignInGoogle from './ThirdPartyApi/Google'
import SignInTwitter from './ThirdPartyApi/Twitter'
import { PasswordForgetLink } from '../PasswordForget/PasswordForget'
import { PasswordChangeLink } from '../PasswordChange/PasswordChange'
import './SignIn.scss'
import '../../styles/variables.scss'

const SignInPage = () => (
  <div className="signInWrapper">
    <div className="signInSection">
      <h1>Sign In</h1>
      <SignInForm />
      <div className="forgotPassword">
        <PasswordForgetLink />
        <PasswordChangeLink />
      </div>
      <div className="thirdPartyButtons">
        <SignInGoogle />
        <SignInTwitter />
        <SignInGithub />
      </div>
      <SignUpLink />
    </div>
  </div>
)
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
}

class signInFormBase extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }
  onSubmit = (event) => {
    const { email, password } = this.state

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((loggedInUser) => {
        this.setState({ ...INITIAL_STATE })
        this.props.history.push(ROUTES.HOME)
      })
      .catch((err) => {
        this.setState({ err })
      })
    event.preventDefault()
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    const { email, password, error } = this.state
    const isInvalid = password === '' || email === ''
    return (
      <form className="signInForm">
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
        <button
          onClick={this.onSubmit}
          disabled={isInvalid}
          type="submit"
          className="signInButton"
        >
          Sign In
        </button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}
const SignInForm = compose(
  withRouter,
  withFirebase
)(signInFormBase)

export default SignInPage

export { SignInForm }
