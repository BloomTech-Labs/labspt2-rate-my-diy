import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { withAuthorization } from "../Session/session";
import ProjectList from "./Lists/ProjectList"

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
            <Link to={ROUTES.SETTINGS}>Settings</Link>
          </li>
        </ul>
        </div>

        <Route path={ROUTES.MY_PROJECTS} component={ProjectList}/>
      </div>
    );
  }
}
const condition = authUser => authUser;

export default withAuthorization(condition)(Account);
