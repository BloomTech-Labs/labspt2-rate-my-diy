import React from 'react'
import * as ROUTES from '../constants/routes'
import SignOutButton from '../components/SignOut/SignOut'
import { withAuthentication } from '../components/Session/session'
import { AuthUserContext } from '../components/Session/session'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { slide as Menu } from 'react-burger-menu'

import './reactRouter.scss'

export const GET_THIRD_USER = gql`
  query user($thirdPartyUID: String!) {
    user(where: { thirdPartyUID: $thirdPartyUID }) {
      id
      username
      email
    }
  }
`

export const GET_NATIVE_USER = gql`
  query user($firebaseUID: String!) {
    user(where: { firebaseUID: $firebaseUID }) {
      id
      username
    }
  }
`

const AuthNavigation = (props) => (
  <AuthUserContext.Consumer>
    {(authUser) =>
      authUser ? (
        <Navigation authUser={authUser} props={props} />
      ) : (
        <NavigationNonAuth />
      )
    }
  </AuthUserContext.Consumer>
)

const Navigation = ({ authUser }) => {
  const thirdPartyUID = authUser.providerData['0'].uid
  const uid = authUser.uid

  return (
    <Query query={GET_THIRD_USER} variables={{ thirdPartyUID: thirdPartyUID }}>
      {({ loading: thirdLoading, data: thirdData, error: thirdError }) => (
        <Query query={GET_NATIVE_USER} variables={{ firebaseUID: uid }}>
          {({
            loading: nativeLoading,
            data: nativeData,
            error: nativeError,
          }) => {
            if (thirdLoading || nativeLoading) {
              return (
                <Menu>
                  <a href={ROUTES.HOME} className="menu-item">
                    <div>Home</div>
                  </a>
                  <a href={'/search'} className="menu-item">
                    <div>Search</div>
                  </a>
                  <a id="create" className="menu-item" href={'/createproject'}>
                    <div>Create Project</div>
                  </a>

                  <a id="signOut" href="/" className="menu-item">
                    <SignOutButton />
                  </a>
                </Menu>
              )
            }
            if (thirdError || nativeError) {
              console.log({
                navErrorNative: nativeError,
                navErrorThird: thirdError,
              })
              return null
            }
            if (thirdData || nativeData)
              if (thirdData.user || nativeData.user) {
                let data
                if (thirdData.user) data = thirdData
                if (nativeData.user) data = nativeData

                return (
                  <Menu>
                    <a href={ROUTES.HOME} className="menu-item">
                      <div>Home</div>
                    </a>

                    <a href={'/search'} className="menu-item">
                      <div>Search</div>
                    </a>

                    <a
                      href={`/${data.user.username}/account`}
                      className="menu-item"
                    >
                      <div>My Account</div>
                    </a>

                    <a
                      id="profile"
                      href={`/${data.user.username}/profile`}
                      className="menu-item"
                    >
                      <div>My Profile</div>
                    </a>

                    <a
                      id="projects"
                      href={`/${data.user.username}/projects`}
                      className="menu-item"
                    >
                      <div>My Projects</div>
                    </a>

                    <a
                      id="reviews"
                      href={`/${data.user.username}/reviews`}
                      className="menu-item"
                    >
                      <div>My Reviews</div>
                    </a>

                    <a
                      id="create"
                      className="menu-item"
                      href={'/createproject'}
                    >
                      <div>Create Project</div>
                    </a>

                    <a id="signOut" href="/" className="menu-item">
                      <SignOutButton />
                    </a>
                  </Menu>
                )
              }

            return <NavigationNonAuth />
          }}
        </Query>
      )}
    </Query>
  )
}

const NavigationNonAuth = () => {
  return (
    <React.Fragment>
      <Menu>
        <a id="home" className="menu-item" href={ROUTES.HOME}>
          <div>Home</div>
        </a>
        <a id="search" className="menu-item" href={ROUTES.SEARCH}>
          <div>Search</div>
        </a>
        <a id="signIn" className="menu-item" href={ROUTES.SIGN_IN}>
          <div>Sign In</div>
        </a>
      </Menu>
    </React.Fragment>
  )
}

export default withAuthentication(AuthNavigation)
