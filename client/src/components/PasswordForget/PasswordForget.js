import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withFirebase } from '../Firebase/Exports'
import * as ROUTES from '../../constants/routes'
import './PasswordForget.scss'

const PasswordForgetPage = () => (
  <div className="passwordContainer">
    <h2>Reset Your Password</h2>
    <p>Just enter your email and we will send you a new password.</p>
    <PasswordForgetForm />
  </div>
)

const INITIAL_STATE = {
  email: '',
  error: null,
}
class PasswordForgetBase extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }
  onSubmit = (e) => {
    const { email } = this.state
    e.preventDefault()
    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE })
      })
      .catch((error) => {
        this.setState({ error })
      })
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  render() {
    const { email, error } = this.state
    const isInvalid = email === ''
    return (
      <div className="forgotPasswordForm">
        <form onSubmit={this.onSubmit}>
          <input
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
          <button disabled={isInvalid} type="submit">
            Reset My Password
          </button>
          {error && <p>{error.message}</p>}
        </form>
      </div>
    )
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
)

export default PasswordForgetPage

const PasswordForgetForm = withFirebase(PasswordForgetBase)

export { PasswordForgetForm, PasswordForgetLink }
