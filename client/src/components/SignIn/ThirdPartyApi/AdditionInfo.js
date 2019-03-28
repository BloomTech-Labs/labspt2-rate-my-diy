/* 
1. User Gets Redirected To This Page If They Aren't a New User.
2. Pass email, username, back to fireBase.
3. .then() call the netlify function to run nodemailer
4. .then() send the users info to Prisma 
*/


import React, { Component } from 'react'

 class AdditionInfo extends Component {
  render() {
    return (
      <div>
        <h1>WE NEED MORE INFO</h1>
      </div>
    )
  }
}

export default AdditionInfo;
