import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../../components/firebase/index";
import * as ROUTES from "../../constants/routes";

const SignUpPage = () => {
  return (
    <div>
      <h1>Changing This</h1>
      <SignUpForm />
    </div>
  );
};
const initState = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};
class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
  }
  onSubmitHandler = event => {
    event.preventDefault();
    const { email, passwordOne } = this.state;
    this.props.firebase
      .addUserWithCreds(email, passwordOne)
      .then(authUser => {
        this.setState({ ...initState });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
  };
  onChangeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";
    return (
      <form onSubmit={this.onSubmitHandler}>
        <input
          name="username"
          value={username}
          onChange={this.onChangeHandler}
          type="text"
          placeholder="Full name"
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
          {" "}
          Sign Up
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
const SignUpLink = () => {
  return (
    <p>
      Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
  );
};
const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);
// Allow SignUpForm to use Firebase and Router via recompose.

export default SignUpPage;
export { SignUpForm, SignUpLink };
