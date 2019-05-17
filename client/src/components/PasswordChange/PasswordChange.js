import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import { withFirebase } from '../Firebase/Exports'
import './PasswordChange.scss'

const PasswordChangePage = () => (
  <div className="passwordChangeContainer">
    <h2>Want to Change Your Password?</h2>
    <PasswordChangeForm />
  </div>
)

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
}

class PasswordChangeBase extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }
  onSubmit = (e) => {
    e.preventDefault()
    const { passwordOne } = this.state
    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then((response) => {
        this.setState({
          ...INITIAL_STATE,
        })
      })
      .catch((error) => {
        this.setState({ error })
      })
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }
  render() {
    const { passwordOne, passwordTwo, error } = this.state
    const isInvalid = passwordOne !== passwordTwo || passwordOne === ''
    return (
      <form onSubmit={this.onSubmit}>
        <p>Passwords must be at least 6 characters long</p>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />

        <button disabled={isInvalid} type="submit">
          Submit
        </button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}
const PasswordChangeLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_CHANGE}>Change Password</Link>
  </p>
)

const PasswordChangeForm = withFirebase(PasswordChangeBase)

export { PasswordChangeLink, PasswordChangeForm }

export default withFirebase(PasswordChangePage)
