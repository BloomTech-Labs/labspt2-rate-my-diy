import React from 'react'
import { withFirebase } from '../Firebase/Exports'

const SignOutButton = ({ firebase }) => (
  <div onClick={firebase.doSignOut}>Sign Out</div>
)

export default withFirebase(SignOutButton)
