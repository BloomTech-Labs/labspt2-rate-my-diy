/* 
1. User Gets Redirected To This Page If They Aren't a New User.
2. Pass email, username, back to fireBase.
3. .then() call the netlify function to run nodemailer
4. .then() send the users info to Prisma 
*/
import React, { Component } from 'react';
import './AdditionInfo.scss';

class AdditionInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      uid: ''
    };
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {};

  render() {
    const { email, username } = this.state;
    return (
      <div className="additionalInfoModal">
        <h1>Complete Your Sign Up.</h1>
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.onChange}
            placeholder="email"
            name="email"
            value={email}
          />
          <input
            onChange={this.onChange}
            placeholder="username"
            name="username"
            value={username}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default AdditionInfo;
