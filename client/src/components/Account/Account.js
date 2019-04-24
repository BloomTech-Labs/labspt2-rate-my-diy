import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import { gql } from 'apollo-boost';
import ProfileInfo from '../Profile/ProfileInfo';
import * as ROUTES from '../../constants/routes';
import { withAuthorization } from '../Session/session';
import PasswordChange from '../PasswordChange/PasswordChange';
import './Account.scss';
import '../../styles/_globals.scss';

const createSubscriptionMutation = gql`
  mutation createSubscription($source: String!, $email: String!) {
    createSubscription(source: $source, email: $email) {
      id
      email
    }
  }
`;

class Account extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const user = this.props.firebase.auth.currentUser;
    return (
      <>
        <div className="settings-container">
          <h1>Settings</h1>
          <ProfileInfo email={this.props.email} user={this.props.user} />
          <PasswordChange />
          <div className="stripe-container">
            <h2>Want to Upgrade?</h2>
            <StripeCheckout
              className="btn"
              token={async (token) => {
                const response = await this.props.mutate({
                  variables: { source: token.id, email: user.email }
                });
              }}
              stripeKey="pk_test_c80Nc7ujL3MIYgeZj479Sn0H"
            />
          </div>
        </div>
      </>
    );
  }
}

const condition = (authUser) => authUser;

export default withAuthorization(condition)(Account);
