import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import ProfileInfo from '../Profile/ProfileInfo';
import { withAuthorization } from '../Session/session';
import PasswordChange from '../PasswordChange/PasswordChange';
import './Account.scss';

class Account extends Component {
  render() {
    const user = this.props.firebase.auth.currentUser;
    return (
      <div className="settings-container">
        <h1>Settings</h1>
        <ProfileInfo email={this.props.email} user={this.props.user} />
        <PasswordChange />
        <div className="stripe-container">
          <h2>Want to Upgrade?</h2>
          <StripeCheckout
            className="btn"
            token={async (token) => {
              await this.props.mutate({
                variables: { source: token.id, email: user.email }
              });
            }}
            stripeKey="pk_test_c80Nc7ujL3MIYgeZj479Sn0H"
          />
        </div>
      </div>
    );
  }
}

const condition = (authUser) => authUser;

export default withAuthorization(condition)(Account);
