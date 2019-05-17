import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import ProfileInfo from '../Profile/ProfileInfo'
import { withAuthorization } from '../Session/session'
import PasswordChange from '../PasswordChange/PasswordChange'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import gql from 'graphql-tag'

import { Query } from 'react-apollo'
import './Account.scss'

export const GET_NAT_USER = gql`
  query user($email: String!) {
    user(where: { email: $email }) {
      id
      username
      firebaseUID
    }
  }
`

class Account extends Component {
  render() {
    if (this.props.user) {
      const user = this.props.authUser
      const email = user.email
      return (
        <div className="settings-container">
          <h1>Settings</h1>
          <ProfileInfo
            email={this.props.email}
            user={this.props.user}
            authUser={this.props.authUser}
          />
          <Query query={GET_NAT_USER} variables={{ email: email }}>
            {({ loading, data, error }) => {
              if (loading) return null
              if (error) {
                return null
              }
              if (data) {
                if (
                  (data.user.firebaseUID !== null) &
                  (data.user.firebaseUID !== undefined)
                ) {
                  return <PasswordChange />
                }
                return null
              }
              return null
            }}
          </Query>
          <div className="stripe-container">
            <h2>Want to Buy Us a Coffee?</h2>
            <StripeCheckout
              className="stripeButton"
              token={async (token) => {
                await this.props.mutate({
                  variables: { source: token.id, email: user.email },
                })
              }}
              stripeKey="pk_test_c80Nc7ujL3MIYgeZj479Sn0H"
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="settings-container">
          <SkeletonTheme highlightColor="#6fb3b8">
            <h1>
              <Skeleton />
            </h1>
            <ProfileInfo authUser={this.props.authUser} />
            <div className="pass-change-skeleton">
              <h2>
                <Skeleton />
              </h2>
              <Skeleton count={3} />
            </div>
            <div className="stripe-container">
              <Skeleton />
            </div>
          </SkeletonTheme>
        </div>
      )
    }
  }
}

const condition = (authUser) => authUser

export default withAuthorization(condition)(Account)
