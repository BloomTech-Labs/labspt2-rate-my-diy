import React from 'react';
import MicroModal from 'react-micro-modal';

class ReviewCard extends React.Component {
  constructor(props) {
    super(props);

    const { users, review, user } = this.props;

    const json = localStorage.getItem('authUser');
    const authUser = JSON.parse(json);
    let visitor = [];
    let loggedIn = false;
    if (user !== null)
      visitor = users.filter((u) => u.email === authUser.email)[0];

    this.state = {
      edit: false,
      thumbsUp: review.thumbsUp,
      thumbsDown: review.thumbsDown,
      didThumbUp: false,
      didThumbDown: false,
      thumbsUpDisabled: false,
      thumbsDownDisabled: false,
      authUser: authUser,
      visitor: visitor,
      loggedIn: loggedIn,
      name: '',
      text: '',
      review: review
    };
  }

  componentDidMount() {
    if (this.state.authUser != null) {
      this.setState({ ...this.state, loggedIn: true });
    } else {
      this.setState({ loggedIn: false });
    }
  }

  textChange = async (e) => {
    let value = e.target.value;
    await this.setState({
      ...this.state,
      [e.target.name]: value
    });
  };

  thumbsUp() {
    let thumbsUp = this.state.thumbsUp;
    this.state.thumbsUp === this.props.review.thumbsUp
      ? (thumbsUp = thumbsUp + 1)
      : (thumbsUp = thumbsUp - 1);
    this.setState({
      ...this.state,
      didThumbUp: !this.state.didThumbUp,
      thumbsUp: thumbsUp,
      thumbsDownDisabled: !this.state.thumbsDownDisabled
    });
  }

  thumbsDown() {
    let thumbsDown = this.state.thumbsDown;
    this.state.thumbsDown === this.props.review.thumbsDown
      ? (thumbsDown = thumbsDown + 1)
      : (thumbsDown = thumbsDown - 1);
    this.setState({
      ...this.state,
      didThumbDown: !this.state.didThumbDown,
      thumbsDown: thumbsDown,
      thumbsUpDisabled: !this.state.thumbsUpDisabled
    });
  }

  render() {
    const { review, loggedIn, authUser } = this.state;
    if (loggedIn) {
      // logged in
      if (review.Author.email === authUser.email) {
        // logged in, your review
        if (review.projRating !== null || undefined) {
          // logged in, your review, you rated the project
          if (this.state.edit) {
            // logged in, your review, you rated the project, you want to edit, return
          } else {
            // logged in, your review, you rated, you don't want to edit, return
          }
        } else {
          // logged in, your review, you didn't rate
          if (this.state.edit) {
            // logged in, your review, you didn't rate, you want to edit, return
          } else {
            // logged in, your review, you didn't rate, you don't want to edit, return
          }
        }
      } else {
        // logged in, not your review

        if (review.projRating !== null || undefined) {
          // logged in, not your rev, review w/rating

          if (this.state.didThumbUp) {
            // logged in, not your rev, review w/ rating, added thumbUp, return
          } else if (this.state.didThumbDown) {
            // logged in, not your rev, review w/ rating, added thumbDown, return
          } else {
            // logged in, not your rev, review w/ rating, haven't thumbed yet, return
          }
        } else {
          // logged in, not your rev,  review w/o rating

          if (this.state.didThumbUp) {
            // logged in, not your rev, review w/o rating, added thumbUp, return
          } else if (this.state.didThumbDown) {
            // logged in, not your rev, review w/o rating, added thumbDown, return
          } else {
            // logged in, not your rev, review w/o rating, haven't thumbed yet, return
          }
        }
      }
    } else {
      // not logged in

      if (review.projRating !== null || undefined) {
        // logged in, review includes rating, return
      } else {
        //logged in, review w/o rating, return
      }
    }
  }
}

export default ReviewCard;
