import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
const SignUpPage = () => {
 <div>
   <h1>Sign Up</h1>
   <SignUpForm />
 </div>
}
export default class SignUpForm extends Component {
 constructor(props) {
  super(props)
 } 

 onSubmitHandler = () => {

 }

 onChangeHandler = () => {

 }
 render() {
    return (
      <form onSubmit={this.onSubmitHandler}>

      </form>
     )
  }
}

const SignUpLink = () => {
 <p>
  Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
 </p>
}

export default SignUpPage

export { SignUpForm, SignUpLink}