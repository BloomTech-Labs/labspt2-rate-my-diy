import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import ProfileInfo from '../Profile/ProfileInfo';
import { withAuthorization } from '../Session/session';
import PasswordChange from '../PasswordChange/PasswordChange';
import gql from 'graphql-tag';

import { Query } from 'react-apollo';
import './Account.scss';

export const GET_NATIVE_USER = gql`
  query user($email: String!) {
    user(where: { email: $email }) {
      id
      username
      firebaseUID
    }
  }
`;

class Account extends Component {
  render() {
    const user = this.props.firebase.auth.currentUser;
    const email = user.providerData[0].email;
    return (
      <div className="settings-container">
        <h1>Settings</h1>
        <ProfileInfo email={this.props.email} user={this.props.user} />
        <Query query={GET_NATIVE_USER} variables={{ email: email }}>
          {({ loading, data, error }) => {
            if (loading) return null;
            if (error) {
              console.log({ accountError: error });
              return null;
            }
            if (data) {
              if (
                (data.user.firebaseUID !== null) &
                (data.user.firebaseUID !== undefined)
              ) {
                return <PasswordChange />;
              }
              return null;
            }
            return null;
          }}
        </Query>
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
