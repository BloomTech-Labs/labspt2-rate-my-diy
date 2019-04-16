import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { withAuthorization } from '../Session/session';
import ProjectList from './Lists/ProjectList';
import ReviewList from './Lists/ReviewList';
import Stripe from '../Stripe/Stripe';
import Settings from '../Account/Settings/Settings';

class Account extends Component {
  render() {
    return (
      <div>
        <div className="accountNav">
          <ul>
            <li>
              <Link to={ROUTES.MY_PROJECTS}>My Projects</Link>
            </li>
            <li>
              <Link to={ROUTES.MY_REVIEWS}>My Reviews</Link>
            </li>
            <li>
              <Link to={ROUTES.STRIPE}>Billing</Link>
            </li>
            <li>
              <Link to={`/${this.props.user.username}/account/settings`}>
                Settings
              </Link>
            </li>
          </ul>
        </div>

        <Route path={ROUTES.MY_PROJECTS} component={ProjectList} />
        <Route path={ROUTES.MY_REVIEWS} component={ReviewList} />
        <Route
          path={ROUTES.STRIPE}
          render={(props) => (
            <Stripe {...props} firebase={this.props.firebase} />
          )}
        />
      </div>
    );
  }
}
const condition = (authUser) => authUser;

export default withAuthorization(condition)(Account);
