import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { graphql } from "react-apollo";
import {gql} from "apollo-boost";

const createSubscriptionMutation = gql`
  mutation createSubscription($source: String!) {
    createSubscription(source: $source) {
      id
      email
    }
  }
`;

const Stripe = ({ mutate }) => {
  return (
    <StripeCheckout
      token={async token => {
        console.log({token: token});
        const response = await mutate({ variables: { source: token.id } });
        console.log({ response: response });
      }}
      stripeKey={process.env.REACT_APP_PUBLISHABLE_KEY}
    />
  );
};

const StripeWithMutation = graphql(createSubscriptionMutation)(Stripe);

export default StripeWithMutation;
