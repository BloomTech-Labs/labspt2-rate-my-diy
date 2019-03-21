import React, { Component } from "react";

export default class signInGithub extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  onSubmit = event => {
    this.props.firebase.doSignInWithGithub();
  };
  render() {
    return <div />;
  }
}
