import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'

const SignUpPage = () => {
 <div>
   <h1>Sign Up</h1>
   <SignUpForm />
 </div>
}

const initState = {
 username: '',
 email: '',
 passwordOne: '',
 passwordTWo: '',
 error: null
}
export default class SignUpForm extends Component {
 constructor(props) {
  super(props)

  this.state = {...initState}
 } 

 onSubmitHandler = () => {

 }

 onChangeHandler = () => {
  this.setState({
   [event.target.name]: event.target.value
  })
 }
 render() {
    return (
      <form onSubmit={this.onSubmitHandler}>
       <input
       name="username"
       value={username}
       onChange={this.onChangeHandler}
       type='text'
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
       value={passwordTWo}
       type="text"
       placeholder="Confirm password."
       />
       <button type="submit"> Sign Up</button>
       {error && <p>{error.message}</p> }
      </form>
       )
  }
}

const SignUpLink = () => {
 <p>
  Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
 </p>
}

// export default SignUpPage

export {SignUpPage, SignUpForm, SignUpLink}