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
       name
       value
       onChange
       type
       placeholder
       />
       <input
       name
       value
       onChange
       type
       placeholder
       />
       <input
       name
       value
       onChange
       type
       placeholder
       />
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