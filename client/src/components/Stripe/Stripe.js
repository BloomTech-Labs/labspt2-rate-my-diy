import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

const createSubscriptionMutation = gql`
  mutation createSubscription($source: String!, $email: String!) {
    createSubscription(source: $source, email: $email) {
      id
      email
    }
  }
`;

const Stripe = (props) => {
  const loggedIn = props.firebase.auth.currentUser !== null;
  if (loggedIn) {
    const user = props.firebase.auth.currentUser;
    console.log(user.email);
    return (
      <>
        <h1>Want to upgrade?</h1>
        <StripeCheckout
          token={async (token) => {
            console.log({ token: token });
            console.log({ stripeProps: props });
            const response = await props.mutate({
              variables: { source: token.id, email: user.email }
            });
            console.log({ response: response });
          }}
          stripeKey="pk_test_c80Nc7ujL3MIYgeZj479Sn0H"
        />
      </>
    );
  } else {
    return (
      <>
        <h1>Want to Upgrade?</h1>
        <p>Please log in first</p>
      </>
    );
  }
};

const StripeWithMutation = graphql(createSubscriptionMutation)(Stripe);

export default StripeWithMutation;
