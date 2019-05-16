import React from 'react'
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../Firebase/Exports'
import { compose } from 'recompose'
import * as ROUTES from '../../constants/routes'
import AuthUserContext from './context'

const withAuthorization = (condition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        (authUser) => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.SIGN_IN)
          }
        }
      )
    }

    componentWillUnmount() {
      this.listener()
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {(authUser) =>
            condition(authUser) ? (
              <Component {...this.props} />
            ) : (
              <h1>Not Authorized</h1>
            )
          }
        </AuthUserContext.Consumer>
      )
    }
  }

  return compose(
    withRouter,
    withFirebase
  )(WithAuthorization)
}

export default withAuthorization
