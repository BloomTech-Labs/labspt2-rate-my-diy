import React from 'react';
import MicroModal from 'react-micro-modal';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { editReview, likeAReview, dislikeAReview } from '../../query/query';
import moment from 'moment';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import './ReviewCard.scss';

class ReviewCard extends React.Component {
  constructor(props) {
    super(props);

    let authUser = { email: '' };

    // eslint-disable-next-line
    if (this.props.authUser != undefined) authUser = this.props.authUser;
    this.state = {
      edit: false,
      thumbsUp: this.props.review ? this.props.review.thumbsUp : null,
      thumbsDown: this.props.review ? this.props.review.thumbsDown : null,
      didThumbUp: this.props.users[0]
        ? this.props.review
          ? this.props.users.filter((u) => u.email === authUser.email)[0]
            ? this.props.users
                .filter((u) => u.email === authUser.email)[0]
                .LikedReviews.filter((r) => r.id === this.props.review.id)[0]
              ? true
              : false
            : false
          : false
        : false,
      didThumbDown: this.props.users[0]
        ? this.props.review
          ? this.props.users.filter((u) => u.email === authUser.email)[0]
            ? this.props.users
                .filter((u) => u.email === authUser.email)[0]
                .DislikedReviews.filter((r) => r.id === this.props.review.id)[0]
              ? true
              : false
            : false
          : false
        : false,
      thumbsUpDisabled: this.props.users[0]
        ? this.props.review
          ? this.props.users.filter((u) => u.email === authUser.email)[0]
            ? this.props.users
                .filter((u) => u.email === authUser.email)[0]
                .DislikedReviews.filter((r) => r.id === this.props.review.id)[0]
              ? true
              : false
            : false
          : false
        : false,
      thumbsDownDisabled: this.props.users[0]
        ? this.props.review
          ? this.props.users.filter((u) => u.email === authUser.email)[0]
            ? this.props.users
                .filter((u) => u.email === authUser.email)[0]
                .LikedReviews.filter((r) => r.id === this.props.review.id)[0]
              ? true
              : false
            : false
          : false
        : false,
      authUser: authUser,
      visitor: this.props.users[0]
        ? this.props.users.filter((u) => u.email === authUser.email)[0]
          ? this.props.users.filter((u) => u.email === authUser.email)[0]
          : {}
        : {},
      loggedIn: this.props.loggedIn !== undefined ? this.props.loggedIn : false,
      name: this.props.review ? this.props.review.name : '',
      text: this.props.review ? this.props.review.text : '',
      stars: 0,
      review: this.props.review ? this.props.review : {}
    };
  }

  componentDidMount() {
    if (this.props.users[0]) {
      const { users, review, authUser } = this.props;

      let visitor = users.filter((u) => u.email === authUser.email)[0];

      let disFilter = []
      let likeFilter = []

      if (visitor !== undefined && visitor !== {})
      disFilter = visitor.DislikedReviews.filter((r) => r.id === review.id);

      if (visitor !== undefined && visitor !== {})
      likeFilter = visitor.LikedReviews.filter((r) => r.id === review.id);
      
      if (disFilter[0]) {
        this.setState({
          ...this.state,
          thumbsUp: review.thumbsUp,
          thumbsDown: review.thumbsDown,
          authUser: authUser,
          visitor: visitor,
          name: review.name,
          text: review.text,
          review: review,
          didThumbDown: true,
          thumbsUpDisabled: true
        });
      }
      if (likeFilter[0]) {
        this.setState({
          ...this.state,
          thumbsUp: review.thumbsUp,
          thumbsDown: review.thumbsDown,
          authUser: authUser,
          visitor: visitor,
          name: review.name,
          text: review.text,
          review: review,
          didThumbUp: true,
          thumbsDownDisabled: true
        });
      }
    }
  }

  starChange = async (e) => {
    const stars = await parseInt(e.target.value);
    await this.setState({
      ...this.state,
      stars: stars
    });
  };

  textChange = async (e) => {
    let value = e.target.value;
    await this.setState({
      ...this.state,
      [e.target.name]: value
    });
  };

  thumbsUp = () => {
    this.setState({
      ...this.state,
      didThumbUp: !this.state.didThumbUp,
      thumbsDownDisabled: !this.state.thumbsDownDisabled
    });
  };

  thumbsDown = () => {
    this.setState({
      ...this.state,
      didThumbDown: !this.state.didThumbDown,
      thumbsUpDisabled: !this.state.thumbsUpDisabled
    });
  };

  render() {
    if (this.props.review && this.props.users[0]) {
      const { loggedIn, authUser, review } = this.props;
      const time = moment(review.timestamp).format('MMMM Do YYYY');

      if (loggedIn) {
        // console.log("logged in")

        if (review.Author.email === authUser.email) {
          // console.log("logged in, your review")
          if (review.projRating !== null && review.projRating !== undefined) {
            // console.log("logged in, your review, you rated the project")
            if (this.state.edit) {
              // console.log("logged in, your review, you rated the project, you want to edit, return")

              return (
                <React.Fragment>
                  <MicroModal
                    trigger={(handleOpen) => (
                      <div className="searchReviewCard">
                        <img
                          className="searchProjectImage"
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                        <h3>{`${review.ProjectReviewed.name}`}</h3>
                        <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                        {time !== 'Invalid date' ? (
                          <p>{time}</p>
                        ) : (
                          <p>{review.timestamp.slice(0, 10)}</p>
                        )}
                        <Link to={`/projects/${review.ProjectReviewed.id}`} />
                        <p>{`Title: ${review.name}`}</p>
                        <button id="reviewButton" onClick={handleOpen}>
                          See This Review
                        </button>
                      </div>
                    )}
                    children={(handleClose) => (
                      <Mutation mutation={editReview}>
                        {(editReview, { loading, error, data }) => {
                          if (loading)
                            return (
                              <form>
                                <div>
                                  <img
                                    className="searchProjectImage"
                                    src={`${review.ProjectReviewed.titleImg}`}
                                    alt="project"
                                  />
                                  <h3>{`${review.ProjectReviewed.name}`}</h3>
                                  <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                                  {time !== 'Invalid date' ? (
                                    <p>{time}</p>
                                  ) : (
                                    <p>{review.timestamp.slice(0, 10)}</p>
                                  )}
                                  <Link
                                    to={`/projects/${
                                      review.ProjectReviewed.id
                                    }`}
                                  />
                                  <p>{`Rating of Project: ${
                                    review.projRating
                                  }`}</p>
                                  <h3>Title:</h3>
                                  <input
                                    type="text"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.textChange}
                                    disabled
                                  />
                                  <h3>Body:</h3>
                                  <textarea
                                    name="text"
                                    value={this.state.text}
                                    onChange={this.textChange}
                                    disabled
                                  />
                                  <div>{`Thumbs Up: ${
                                    this.state.thumbsUp
                                  }`}</div>
                                  <div>{`Thumbs Down: ${
                                    this.state.thumbsDown
                                  }`}</div>
                                  <div>
                                    <span>Submitting your changes...</span>
                                    <button onClick={handleClose}>Close</button>
                                  </div>
                                </div>
                              </form>
                            );
                          if (error) {
                            console.log({ editRevError: error });
                            return (
                              <form>
                                <div>
                                  <div>{`${review.ProjectReviewed.name}`}</div>
                                  <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                                  {time !== 'Invalid date' ? (
                                    <p>{time}</p>
                                  ) : (
                                    <p>{review.timestamp.slice(0, 10)}</p>
                                  )}
                                  <Link
                                    to={`/projects/${
                                      review.ProjectReviewed.id
                                    }`}
                                  >
                                    <img
                                      className="searchProjectImage"
                                      src={`${review.ProjectReviewed.titleImg}`}
                                      alt="project"
                                    />
                                  </Link>
                                  <div>{`Rating of Project: ${
                                    review.projRating
                                  }`}</div>
                                  <h3>Title:</h3>
                                  <input
                                    type="text"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.textChange}
                                    disabled
                                  />
                                  <h3>Body:</h3>
                                  <textarea
                                    name="text"
                                    value={this.state.text}
                                    onChange={this.textChange}
                                    disabled
                                  />
                                  <div>{`Thumbs Up: ${
                                    this.state.thumbsUp
                                  }`}</div>

                                  <div>{`Thumbs Down: ${
                                    this.state.thumbsDown
                                  }`}</div>
                                  <div>
                                    <span>
                                      There was an error submitting your
                                      changes.
                                    </span>
                                    <button onClick={handleClose}>Close</button>
                                  </div>
                                </div>
                              </form>
                            );
                          }
                          if (data)
                            return (
                              <div className="reviewCardModal">
                                <div>{`${review.ProjectReviewed.name}`}</div>
                                <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                                {time !== 'Invalid date' ? (
                                  <p>{time}</p>
                                ) : (
                                  <p>{review.timestamp.slice(0, 10)}</p>
                                )}
                                <Link
                                  to={`/projects/${review.ProjectReviewed.id}`}
                                >
                                  <img
                                    className="searchProjectImage"
                                    src={`${review.ProjectReviewed.titleImg}`}
                                    alt="project"
                                  />
                                </Link>
                                <p>{`${review.name}`}</p>
                                <p>{`${review.text}`}</p>
                                <div>{`Thumbs Up: ${this.state.thumbsUp}`}</div>

                                <div>{`Thumbs Down: ${
                                  this.state.thumbsDown
                                }`}</div>
                                <button onClick={handleClose}>Close</button>
                              </div>
                            );
                          return (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const date = await new Date(Date.now());
                                await editReview({
                                  variables: {
                                    name: this.state.name,
                                    text: this.state.text,
                                    timestamp: date,
                                    projId: review.ProjectReviewed.id,
                                    revId: review.id
                                  }
                                });
                                await this.props.revRefetch();
                                let revs = this.props.review;
                                
                                await this.setState({
                                  ...this.state,
                                  review: revs,
                                  edit: false
                                });
                              }}
                            >
                              <div className="reviewCardModal">
                                <div>{`${review.ProjectReviewed.name}`}</div>
                                <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                                {time !== 'Invalid date' ? (
                                  <p>{time}</p>
                                ) : (
                                  <p>{review.timestamp.slice(0, 10)}</p>
                                )}
                                <Link
                                  to={`/projects/${review.ProjectReviewed.id}`}
                                >
                                  <img
                                    className="searchProjectImage"
                                    src={`${review.ProjectReviewed.titleImg}`}
                                    alt="project"
                                  />
                                </Link>
                                <div>{`Rating of Project: ${
                                  review.projRating
                                }`}</div>
                                <h3>Title:</h3>
                                <input
                                  type="text"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.textChange}
                                />
                                <h3>Body:</h3>
                                <textarea
                                  name="text"
                                  value={this.state.text}
                                  onChange={this.textChange}
                                />
                                <div>{`Thumbs Up: ${this.state.thumbsUp}`}</div>

                                <div>{`Thumbs Down: ${
                                  this.state.thumbsDown
                                }`}</div>
                                <div>
                                  <button type="submit">Submit</button>
                                  <button onClick={handleClose}>Close</button>
                                </div>
                              </div>
                            </form>
                          );
                        }}
                      </Mutation>
                    )}
                  />
                </React.Fragment>
              );
            } else {
              // console.log("logged in, your review, you rated, you don't want to edit, return")

              return (
                <React.Fragment>
                  <MicroModal
                    trigger={(handleOpen) => (
                      <div className="searchReviewCard">
                        <img
                          className="searchProjectImage"
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                        <h3>{`${review.ProjectReviewed.name}`}</h3>
                        <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                        {time !== 'Invalid date' ? (
                          <p>{`${time}`}</p>
                        ) : (
                          <p>{`${review.timestamp.slice(
                            0,
                            10
                          )}`}</p>
                        )}
                        <Link to={`/projects/${review.ProjectReviewed.id}`} />
                        <p>{`Title: ${review.name}`}</p>
                        <button id="reviewButton" onClick={handleOpen}>
                          See This Review
                        </button>
                      </div>
                    )}
                    children={(handleClose) => (
                      <div className="reviewCardModal">
                        <h3>{`${review.ProjectReviewed.name}`}</h3>
                        <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                        {time !== 'Invalid date' ? (
                          <p>{time}</p>
                        ) : (
                          <p>{review.timestamp.slice(0, 10)}</p>
                        )}
                        <Link to={`/projects/${review.ProjectReviewed.id}`}>
                          <img
                            className="searchProjectImage"
                            src={`${review.ProjectReviewed.titleImg}`}
                            alt="project"
                          />
                        </Link>
                        <div>{`Rating of Project: ${review.projRating}`}</div>
                        <h3>{`${review.name}`}</h3>
                        <p>{`${review.text}`}</p>
                        <div>{`Thumbs Up: ${this.state.thumbsUp}`}</div>
                        <div>{`Thumbs Down: ${this.state.thumbsDown}`}</div>
                        <div>
                          <button
                            onClick={() =>
                              this.setState({ ...this.state, edit: true })
                            }
                          >
                            Edit
                          </button>
                          <button onClick={handleClose}>Close</button>
                        </div>
                      </div>
                    )}
                  />
                </React.Fragment>
              );
            }
          } else {
            // console.log("logged in, your review, you didn't rate")
            if (this.state.edit) {
              // console.log("logged in, your review, you didn't rate, you want to edit, return")

              return (
                <React.Fragment>
                  <MicroModal
                    trigger={(handleOpen) => (
                      <div className="searchReviewCard">
                        <img
                          className="searchProjectImage"
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                        <h3>{`${review.ProjectReviewed.name}`}</h3>
                        <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                        {time !== 'Invalid date' ? (
                          <p>{`${time}`}</p>
                        ) : (
                          <p>{`${review.timestamp.slice(
                            0,
                            10
                          )}`}</p>
                        )}
                        <Link to={`/projects/${review.ProjectReviewed.id}`} />
                        <p>{`Title: ${review.name}`}</p>
                        <button id="reviewButton" onClick={handleOpen}>
                          See This Review
                        </button>
                      </div>
                    )}
                    children={(handleClose) => (
                      <Mutation mutation={editReview}>
                        {(editReview, { loading, error, data }) => {
                          if (loading)
                            return (
                              <form>
                                <div className="reviewCardModal">
                                  <h3>{`${review.ProjectReviewed.name}`}</h3>
                                  <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                                  {time !== 'Invalid date' ? (
                                    <p>{time}</p>
                                  ) : (
                                    <p>{review.timestamp.slice(0, 10)}</p>
                                  )}
                                  <Link
                                    to={`/projects/${
                                      review.ProjectReviewed.id
                                    }`}
                                  >
                                    <img
                                      className="searchProjectImage"
                                      src={`${review.ProjectReviewed.titleImg}`}
                                      alt="project"
                                    />
                                  </Link>
                                  <div>Rating of Project:</div>
                                  <select
                                    name="stars"
                                    onChange={this.starChange}
                                    value={this.state.stars}
                                    disabled
                                  >
                                    <option value="0">Rating</option>
                                    <option value="1">1 star</option>
                                    <option value="2">2 stars</option>
                                    <option value="3">3 stars</option>
                                    <option value="4">4 stars</option>
                                    <option value="5">5 stars</option>
                                  </select>
                                  <h3>Title:</h3>
                                  <input
                                    type="text"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.textChange}
                                    disabled
                                  />
                                  <h3>Body:</h3>
                                  <textarea
                                    name="text"
                                    value={this.state.text}
                                    onChange={this.textChange}
                                    disabled
                                  />
                                  <div>{`Thumbs Up: ${
                                    this.state.thumbsUp
                                  }`}</div>

                                  <div>{`Thumbs Down: ${
                                    this.state.thumbsDown
                                  }`}</div>
                                  <div>
                                    <span>Submitting your changes...</span>
                                    <button onClick={handleClose}>Close</button>
                                  </div>
                                </div>
                              </form>
                            );
                          if (error) {
                            console.log({ editRevError: error });
                            return (
                              <div>
                                <div>{`${review.ProjectReviewed.name}`}</div>
                                <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                                {time !== 'Invalid date' ? (
                                  <p>{time}</p>
                                ) : (
                                  <p>{review.timestamp.slice(0, 10)}</p>
                                )}
                                <Link
                                  to={`/projects/${review.ProjectReviewed.id}`}
                                >
                                  <img
                                    className="searchProjectImage"
                                    src={`${review.ProjectReviewed.titleImg}`}
                                    alt="project"
                                  />
                                </Link>
                                <div>Rating of Project:</div>
                                <select
                                  name="stars"
                                  onChange={this.starChange}
                                  value={this.state.stars}
                                  disabled
                                >
                                  <option value="0">Rating</option>
                                  <option value="1">1 star</option>
                                  <option value="2">2 stars</option>
                                  <option value="3">3 stars</option>
                                  <option value="4">4 stars</option>
                                  <option value="5">5 stars</option>
                                </select>
                                <h3>Title:</h3>
                                <input
                                  type="text"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.textChange}
                                  disabled
                                />
                                <h3>Body:</h3>
                                <textarea
                                  name="text"
                                  value={this.state.text}
                                  onChange={this.textChange}
                                  disabled
                                />
                                <div>{`Thumbs Up: ${this.state.thumbsUp}`}</div>

                                <div>{`Thumbs Down: ${
                                  this.state.thumbsDown
                                }`}</div>
                                <div>
                                  <span>
                                    There was trouble submitting your changes.
                                  </span>
                                  <button onClick={handleClose}>Close</button>
                                </div>
                              </div>
                            );
                          }
                          if (data)
                            return (
                              <div>
                                <div>{`${review.ProjectReviewed.name}`}</div>
                                <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                                {time !== 'Invalid date' ? (
                                  <p>{time}</p>
                                ) : (
                                  <p>{review.timestamp.slice(0, 10)}</p>
                                )}
                                <Link
                                  to={`/projects/${review.ProjectReviewed.id}`}
                                >
                                  <img
                                    className="searchProjectImage"
                                    src={`${review.ProjectReviewed.titleImg}`}
                                    alt="project"
                                  />
                                </Link>
                                <div>{`${review.name}`}</div>
                                <div>{`${review.text}`}</div>
                                <div>{`Thumbs Up: ${this.state.thumbsUp}`}</div>

                                <div>{`Thumbs Down: ${
                                  this.state.thumbsDown
                                }`}</div>
                                <div>
                                  <button onClick={handleClose}>Close</button>
                                </div>
                              </div>
                            );
                          return (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const date = await new Date(Date.now());
                                await editReview({
                                  variables: {
                                    name: this.state.name,
                                    text: this.state.text,
                                    timestamp: date,
                                    projId: review.ProjectReviewed.id,
                                    revId: review.id,
                                    projRating: this.state.projRating
                                  }
                                });
                                await this.props.revRefetch();
                                const revs = this.props.review;
                                await this.setState({
                                  ...this.state,
                                  edit: false,
                                  review: revs
                                });
                              }}
                            >
                              <div className="reviewCardModal">
                                <div>{`${review.ProjectReviewed.name}`}</div>
                                <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                                {time !== 'Invalid date' ? (
                                  <p>{time}</p>
                                ) : (
                                  <p>{review.timestamp.slice(0, 10)}</p>
                                )}
                                <Link
                                  to={`/projects/${review.ProjectReviewed.id}`}
                                >
                                  <img
                                    className="searchProjectImage"
                                    src={`${review.ProjectReviewed.titleImg}`}
                                    alt="project"
                                  />
                                </Link>
                                <div>Rating of Project:</div>
                                <select
                                  name="stars"
                                  onChange={this.starChange}
                                  value={this.state.stars}
                                >
                                  <option value="0">Rating</option>
                                  <option value="1">1 star</option>
                                  <option value="2">2 stars</option>
                                  <option value="3">3 stars</option>
                                  <option value="4">4 stars</option>
                                  <option value="5">5 stars</option>
                                </select>
                                <h3>Title:</h3>
                                <input
                                  type="text"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.textChange}
                                />
                                <h3>Body:</h3>
                                <textarea
                                  name="text"
                                  value={this.state.text}
                                  onChange={this.textChange}
                                />
                                <div>{`Thumbs Up: ${this.state.thumbsUp}`}</div>

                                <div>{`Thumbs Down: ${
                                  this.state.thumbsDown
                                }`}</div>
                                <div>
                                  <button type="submit">Submit</button>
                                  <button onClick={handleClose}>Close</button>
                                </div>
                              </div>
                            </form>
                          );
                        }}
                      </Mutation>
                    )}
                  />
                </React.Fragment>
              );
            } else {
              // console.log("logged in, your review, you didn't rate, you don't want to edit, return")

              return (
                <React.Fragment>
                  <MicroModal
                    trigger={(handleOpen) => (
                      <div className="searchReviewCard">
                        <img
                          className="searchProjectImage"
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                        <h3>{`${review.ProjectReviewed.name}`}</h3>
                        <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                        {time !== 'Invalid date' ? (
                          <p>{`${time}`}</p>
                        ) : (
                          <p>{`${review.timestamp.slice(
                            0,
                            10
                          )}`}</p>
                        )}
                        <Link to={`/projects/${review.ProjectReviewed.id}`} />
                        <p>{`Title: ${review.name}`}</p>
                        <button id="reviewButton" onClick={handleOpen}>
                          See This Review
                        </button>
                      </div>
                    )}
                    children={(handleClose) => (
                      <div className="reviewCardModal">
                        <h3>{`${review.ProjectReviewed.name}`}</h3>
                        <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                        {time !== 'Invalid date' ? (
                          <p>{time}</p>
                        ) : (
                          <p>{review.timestamp.slice(0, 10)}</p>
                        )}
                        <Link to={`/projects/${review.ProjectReviewed.id}`}>
                          <img
                            className="searchProjectImage"
                            src={`${review.ProjectReviewed.titleImg}`}
                            alt="project"
                          />
                        </Link>
                        <h3>{`${review.name}`}</h3>
                        <p>{`${review.text}`}</p>
                        <div>{`Thumbs Up: ${this.state.thumbsUp}`}</div>
                        <div>{`Thumbs Down: ${this.state.thumbsDown}`}</div>
                        <div>
                          <button
                            onClick={() =>
                              this.setState({ ...this.state, edit: true })
                            }
                          >
                            Edit
                          </button>
                          <button onClick={handleClose}>Close</button>
                        </div>
                      </div>
                    )}
                  />
                </React.Fragment>
              );
            }
          }
        } else {
          // console.log("logged in, not your review")

          if (review.projRating !== null && review.projRating !== undefined) {
            // console.log("logged in, not your rev, review w/rating")

            return (
              <React.Fragment>
                <MicroModal
                  trigger={(handleOpen) => (
                    <div className="searchReviewCard">
                      <img
                        className="searchProjectImage"
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                      <h3>{`${review.ProjectReviewed.name}`}</h3>
                      <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                      {time !== 'Invalid date' ? (
                        <p>{`${time}`}</p>
                      ) : (
                        <p>{`${review.timestamp.slice(
                          0,
                          10
                        )}`}</p>
                      )}
                      <Link to={`/projects/${review.ProjectReviewed.id}`} />
                      <p>{`Title: ${review.name}`}</p>
                      <button id="reviewButton" onClick={handleOpen}>
                        See This Review
                      </button>
                    </div>
                  )}
                  children={(handleClose) => (
                    <div className="reviewCardModal">
                      <h3>{`${review.ProjectReviewed.name}`}</h3>
                      <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                      {time !== 'Invalid date' ? (
                        <p>{time}</p>
                      ) : (
                        <p>{review.timestamp.slice(0, 10)}</p>
                      )}
                      <Link to={`/projects/${review.ProjectReviewed.id}`}>
                        <img
                          className="searchProjectImage"
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                      </Link>
                      <div>{`Rating of Project: ${review.projRating}`}</div>
                      <h3>{`${review.name}`}</h3>
                      <p>{`${review.text}`}</p>
                      <Mutation mutation={likeAReview}>
                        {(likeAReview, { loading, error, data }) => {
                          if (loading)
                            return (
                              <form>
                                <div>
                                  {this.state.thumbsUpDisabled ? (
                                    <button
                                      disabled={this.state.thumbsUpDisabled}
                                      className="disabled"
                                    >
                                      Like
                                    </button>
                                  ) : (
                                    <button
                                      disabled={this.state.thumbsUpDisabled}
                                      className="notDisabled"
                                    >
                                      Like
                                    </button>
                                  )}
                                  {`Thumbs Up: ${this.state.thumbsUp}`}
                                </div>
                              </form>
                            );
                          if (error) {
                            console.log({ likeError: error });
                            return (
                              <form>
                                <div>
                                  {this.state.thumbsUpDisabled ? (
                                    <button
                                      disabled={this.state.thumbsUpDisabled}
                                      className="disabled"
                                    >
                                      Like
                                    </button>
                                  ) : (
                                    <button
                                      disabled={this.state.thumbsUpDisabled}
                                      className="notDisabled"
                                    >
                                      Like
                                    </button>
                                  )}
                                  {`Thumbs Up: ${this.state.thumbsUp}`}
                                </div>

                                <span>
                                  There was an error submitting your rating.
                                </span>
                              </form>
                            );
                          }
                          if (data)
                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  await likeAReview({
                                    variables: {
                                      // eslint-disable-next-line
                                      revId: this.state.review.id,
                                      username: this.state.visitor.username,
                                      didThumbUp: this.state.didThumbUp
                                    }
                                  });

                                  await this.props.userRefetch();

                                  const { users } = await this.props;
                                  let user = users.filter(user => user.email === this.state.review.Author.email)[0]
                                  let review = user.ReviewList.filter(rev => rev.id === this.state.review.id)[0]

                                  await this.thumbsUp();
                                  await this.setState({
                                    ...this.state,
                                    review: review,
                                    thumbsUp: review.thumbsUp
                                  });
                                }}
                              >
                                <div>
                                  {this.state.thumbsUpDisabled ? (
                                    <button
                                      disabled={this.state.thumbsUpDisabled}
                                      className="disabled"
                                    >
                                      Like
                                    </button>
                                  ) : (
                                    <button
                                      type="submit"
                                      disabled={this.state.thumbsUpDisabled}
                                      className="notDisabled"
                                    >
                                      Like
                                    </button>
                                  )}
                                  {`Thumbs Up: ${this.state.thumbsUp}`}
                                </div>
                              </form>
                            );
                          return (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                await likeAReview({
                                  variables: {
                                    // eslint-disable-next-line
                                    revId: this.state.review.id,
                                    username: this.state.visitor.username,
                                    didThumbUp: this.state.didThumbUp
                                  }
                                });
                                await this.props.userRefetch();

                                const { users } = await this.props;
                                  let user = users.filter(user => user.email === this.state.review.Author.email)[0]
                                  let review = user.ReviewList.filter(rev => rev.id === this.state.review.id)[0]

                                await this.thumbsUp();
                                await this.setState({
                                  ...this.state,
                                  review: review,
                                  thumbsUp: review.thumbsUp
                                });
                              }}
                            >
                              <div>
                                {this.state.thumbsUpDisabled ? (
                                  <button
                                    disabled={this.state.thumbsUpDisabled}
                                    className="disabled"
                                  >
                                    Like
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    disabled={this.state.thumbsUpDisabled}
                                    className="notDisabled"
                                  >
                                    Like
                                  </button>
                                )}
                                {`Thumbs Up: ${this.state.thumbsUp}`}
                              </div>
                            </form>
                          );
                        }}
                      </Mutation>

                      <Mutation mutation={dislikeAReview}>
                        {(dislikeAReview, { loading, error, data }) => {
                          if (loading)
                            return (
                              <form>
                                <span>
                                  {this.state.thumbsDownDisabled ? (
                                    <button
                                      disabled={this.state.thumbsDownDisabled}
                                      className="disabled"
                                    >
                                      Dislike
                                    </button>
                                  ) : (
                                    <button
                                      disabled={this.state.thumbsDownDisabled}
                                      className="notDisabled"
                                    >
                                      Dislike
                                    </button>
                                  )}
                                  {`Thumbs Down: ${this.state.thumbsDown}`}
                                </span>
                              </form>
                            );
                          if (error) {
                            console.log({ disError: error });
                            return (
                              <form>
                                <span>
                                  {this.state.thumbsDownDisabled ? (
                                    <button
                                      disabled={this.state.thumbsDownDisabled}
                                      className="disabled"
                                    >
                                      Dislike
                                    </button>
                                  ) : (
                                    <button
                                      disabled={this.state.thumbsDownDisabled}
                                      className="notDisabled"
                                    >
                                      Dislike
                                    </button>
                                  )}
                                  {`Thumbs Down: ${this.state.thumbsDown}`}
                                </span>
                                <div>
                                  There was an error logging your rating.
                                </div>
                              </form>
                            );
                          }
                          if (data)
                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  await dislikeAReview({
                                    variables: {
                                      // eslint-disable-next-line
                                      revId: this.state.review.id,
                                      username: this.state.visitor.username,
                                      didThumbDown: this.state.didThumbDown
                                    }
                                  });

                                  await this.props.userRefetch();

                                  const { users } = await this.props;
                                  let user = users.filter(user => user.email === this.state.review.Author.email)[0]
                                  let review = user.ReviewList.filter(rev => rev.id === this.state.review.id)[0]

                                  await this.thumbsDown();
                                  await this.setState({
                                    ...this.state,
                                    review: review,
                                    thumbsDown: review.thumbsDown
                                  });
                                }}
                              >
                                <span>
                                  {this.state.thumbsDownDisabled ? (
                                    <button
                                      disabled={this.state.thumbsDownDisabled}
                                      className="disabled"
                                    >
                                      Dislike
                                    </button>
                                  ) : (
                                    <button
                                      type="submit"
                                      disabled={this.state.thumbsDownDisabled}
                                      className="notDisabled"
                                    >
                                      Dislike
                                    </button>
                                  )}
                                  {`Thumbs Down: ${this.state.thumbsDown}`}
                                </span>
                              </form>
                            );
                          return (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                await dislikeAReview({
                                  variables: {
                                    // eslint-disable-next-line
                                    revId: this.state.review.id,
                                    username: this.state.visitor.username,
                                    didThumbDown: this.state.didThumbDown
                                  }
                                });

                                await this.props.userRefetch();

                                const { users } = await this.props;
                                  let user = users.filter(user => user.email === this.state.review.Author.email)[0]
                                  let review = user.ReviewList.filter(rev => rev.id === this.state.review.id)[0]

                                await this.thumbsDown();
                                await this.setState({
                                  ...this.state,
                                  review: review,
                                  thumbsDown: review.thumbsDown
                                });
                              }}
                            >
                              <span>
                                {this.state.thumbsDownDisabled ? (
                                  <button
                                    disabled={this.state.thumbsDownDisabled}
                                    className="disabled"
                                  >
                                    Dislike
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    disabled={this.state.thumbsDownDisabled}
                                    className="notDisabled"
                                  >
                                    Dislike
                                  </button>
                                )}
                                {`Thumbs Down: ${this.state.thumbsDown}`}
                              </span>
                            </form>
                          );
                        }}
                      </Mutation>
                      <button onClick={handleClose}>Close</button>
                    </div>
                  )}
                />
              </React.Fragment>
            );
          } else {
            // console.log("logged in, not your rev,  review w/o rating")

            return (
              <React.Fragment>
                <MicroModal
                  trigger={(handleOpen) => (
                    <div className="searchReviewCard">
                      <img
                        className="searchProjectImage"
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                      <h3>{`${review.ProjectReviewed.name}`}</h3>
                      <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                      {time !== 'Invalid date' ? (
                        <p>{`${time}`}</p>
                      ) : (
                        <p>{`${review.timestamp.slice(
                          0,
                          10
                        )}`}</p>
                      )}
                      <Link to={`/projects/${review.ProjectReviewed.id}`} />
                      <p>{`Title: ${review.name}`}</p>
                      <button id="reviewButton" onClick={handleOpen}>
                        See This Review
                      </button>
                    </div>
                  )}
                  children={(handleClose) => (
                    <div className="reviewCardModal">
                      <h3>{`${review.ProjectReviewed.name}`}</h3>
                      <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                      {time !== 'Invalid date' ? (
                        <p>{time}</p>
                      ) : (
                        <p>{review.timestamp.slice(0, 10)}</p>
                      )}
                      <Link to={`/projects/${review.ProjectReviewed.id}`}>
                        <img
                          className="searchProjectImage"
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                      </Link>
                      <h3>{`${review.name}`}</h3>
                      <div>{`${review.text}`}</div>

                      <Mutation mutation={likeAReview}>
                        {(likeAReview, { loading, error, data }) => {
                          if (loading)
                            return (
                              <form>
                                <div>
                                  {this.state.thumbsUpDisabled ? (
                                    <button
                                      disabled={this.state.thumbsUpDisabled}
                                      className="disabled"
                                    >
                                      Like
                                    </button>
                                  ) : (
                                    <button
                                      disabled={this.state.thumbsUpDisabled}
                                      className="notDisabled"
                                    >
                                      Like
                                    </button>
                                  )}
                                  {`Thumbs Up: ${this.state.thumbsUp}`}
                                </div>
                              </form>
                            );
                          if (error) {
                            console.log({ likeError: error });
                            return (
                              <form>
                                <div>
                                  {this.state.thumbsUpDisabled ? (
                                    <button
                                      disabled={this.state.thumbsUpDisabled}
                                      className="disabled"
                                    >
                                      Like
                                    </button>
                                  ) : (
                                    <button
                                      disabled={this.state.thumbsUpDisabled}
                                      className="notDisabled"
                                    >
                                      Like
                                    </button>
                                  )}
                                  {`Thumbs Up: ${this.state.thumbsUp}`}
                                </div>
                              </form>
                            );
                          }
                          if (data)
                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  await likeAReview({
                                    variables: {
                                      revId: this.state.review.id,
                                      username: this.state.visitor.username,
                                      didThumbUp: this.state.didThumbUp
                                    }
                                  });
                                  await this.props.userRefetch();

                                  const { users } = await this.props;
                                  let user = users.filter(user => user.email === this.state.review.Author.email)[0]
                                  let review = user.ReviewList.filter(rev => rev.id === this.state.review.id)[0]

                                  console.log({props: this.props})
                                  await this.thumbsUp();
                                  await this.setState({
                                    ...this.state,
                                    review: review,
                                    thumbsUp: review.thumbsUp
                                  });
                                }}
                              >
                                <div>
                                  {this.state.thumbsUpDisabled ? (
                                    <button
                                      disabled={this.state.thumbsUpDisabled}
                                      className="disabled"
                                    >
                                      Like
                                    </button>
                                  ) : (
                                    <button
                                      type="submit"
                                      disabled={this.state.thumbsUpDisabled}
                                      className="notDisabled"
                                    >
                                      Like
                                    </button>
                                  )}
                                  {`Thumbs Up: ${this.state.thumbsUp}`}
                                </div>
                              </form>
                            );
                          return (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                await likeAReview({
                                  variables: {
                                    revId: this.state.review.id,
                                    username: this.state.visitor.username,
                                    didThumbUp: this.state.didThumbUp
                                  }
                                });
                                await this.props.userRefetch();

                                const { users } = await this.props;
                                  let user = users.filter(user => user.email === this.state.review.Author.email)[0]
                                  let review = user.ReviewList.filter(rev => rev.id === this.state.review.id)[0]

                                await this.thumbsUp();
                                await this.setState({
                                  ...this.state,
                                  review: review,
                                  thumbsUp: review.thumbsUp
                                });
                              }}
                            >
                              <div>
                                {this.state.thumbsUpDisabled ? (
                                  <button
                                    disabled={this.state.thumbsUpDisabled}
                                    className="disabled"
                                  >
                                    Like
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    disabled={this.state.thumbsUpDisabled}
                                    className="notDisabled"
                                  >
                                    Like
                                  </button>
                                )}
                                {`Thumbs Up: ${this.state.thumbsUp}`}
                              </div>
                            </form>
                          );
                        }}
                      </Mutation>
                      <Mutation mutation={dislikeAReview}>
                        {(dislikeAReview, { loading, error, data }) => {
                          if (loading)
                            return (
                              <form>
                                <span>
                                  {this.state.thumbsDownDisabled ? (
                                    <button
                                      disabled={this.state.thumbsDownDisabled}
                                      className="disabled"
                                    >
                                      Dislike
                                    </button>
                                  ) : (
                                    <button
                                      disabled={this.state.thumbsDownDisabled}
                                      className="notDisabled"
                                    >
                                      Dislike
                                    </button>
                                  )}
                                  {`Thumbs Down: ${this.state.thumbsDown}`}
                                </span>
                              </form>
                            );
                          if (error) {
                            console.log({ disError: error });
                            return (
                              <form>
                                <span>
                                  {this.state.thumbsDownDisabled ? (
                                    <button
                                      disabled={this.state.thumbsDownDisabled}
                                      className="disabled"
                                    >
                                      Dislike
                                    </button>
                                  ) : (
                                    <button
                                      disabled={this.state.thumbsDownDisabled}
                                      className="notDisabled"
                                    >
                                      Dislike
                                    </button>
                                  )}
                                  {`Thumbs Down: ${this.state.thumbsDown}`}
                                </span>
                                <div>
                                  There was an error logging your rating.
                                </div>
                              </form>
                            );
                          }
                          if (data)
                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  await dislikeAReview({
                                    variables: {
                                      revId: this.state.review.id,
                                      username: this.state.visitor.username,
                                      didThumbDown: this.state.didThumbDown
                                    }
                                  });
                                  await this.props.userRefetch();

                                  const { users } = await this.props;
                                  let user = users.filter(user => user.email === this.state.review.Author.email)[0]
                                  let review = user.ReviewList.filter(rev => rev.id === this.state.review.id)[0]

                                  await this.thumbsDown();
                                  await this.setState({
                                    ...this.state,
                                    review: review,
                                    thumbsDown: review.thumbsDown
                                  });
                                }}
                              >
                                <span>
                                  {this.state.thumbsDownDisabled ? (
                                    <button
                                      disabled={this.state.thumbsDownDisabled}
                                      className="disabled"
                                    >
                                      Dislike
                                    </button>
                                  ) : (
                                    <button
                                      type="submit"
                                      disabled={this.state.thumbsDownDisabled}
                                      className="notDisabled"
                                    >
                                      Dislike
                                    </button>
                                  )}
                                  {`Thumbs Down: ${this.state.thumbsDown}`}
                                </span>
                              </form>
                            );
                          return (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                await dislikeAReview({
                                  variables: {
                                    revId: this.props.review.id,
                                    username: this.state.visitor.username,
                                    didThumbDown: this.state.didThumbDown
                                  }
                                });
                                await this.props.userRefetch();

                                const { users } = await this.props;
                                  let user = users.filter(user => user.email === this.state.review.Author.email)[0]
                                  let review = user.ReviewList.filter(rev => rev.id === this.state.review.id)[0]

                                await this.thumbsDown();
                                await this.setState({
                                  ...this.state,
                                  review: review,
                                  thumbsDown: review.thumbsDown
                                });
                              }}
                            >
                              <span>
                                {this.state.thumbsDownDisabled ? (
                                  <button
                                    disabled={this.state.thumbsDownDisabled}
                                    className="disabled"
                                  >
                                    Dislike
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    disabled={this.state.thumbsDownDisabled}
                                    className="notDisabled"
                                  >
                                    Dislike
                                  </button>
                                )}
                                {`Thumbs Down: ${this.state.thumbsDown}`}
                              </span>
                            </form>
                          );
                        }}
                      </Mutation>
                      <button onClick={handleClose}>Close</button>
                    </div>
                  )}
                />
              </React.Fragment>
            );
          }
        }
      } else {
        // console.log("not logged in")

        const { review } = this.props;

        if (review.projRating !== null && review.projRating !== undefined) {
          // console.log("logged in, review includes rating, return")

          return (
            <React.Fragment>
              <MicroModal
                trigger={(handleOpen) => (
                  <div className="searchReviewCard">
                    <img
                      className="searchProjectImage"
                      src={`${review.ProjectReviewed.titleImg}`}
                      alt="project"
                    />
                    <h3>{`${review.ProjectReviewed.name}`}</h3>
                    <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                    {time !== 'Invalid date' ? (
                      <p>{`${time}`}</p>
                    ) : (
                      <p>{`${review.timestamp.slice(
                        0,
                        10
                      )}`}</p>
                    )}
                    <Link to={`/projects/${review.ProjectReviewed.id}`} />
                    <p>{`Title: ${review.name}`}</p>
                    <button id="reviewButton" onClick={handleOpen}>
                      See This Review
                    </button>
                  </div>
                )}
                children={(handleClose) => (
                  <div className="reviewCardModal">
                    <h3>{`${review.ProjectReviewed.name}`}</h3>
                    <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                    {time !== 'Invalid date' ? (
                      <p>{time}</p>
                    ) : (
                      <p>{review.timestamp.slice(0, 10)}</p>
                    )}
                    <Link to={`/projects/${review.ProjectReviewed.id}`}>
                      <img
                        className="searchProjectImage"
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                    </Link>
                    <div>{`Rating of Project: ${review.projRating}`}</div>
                    <h3>{`${review.name}`}</h3>
                    <div>{`${review.text}`}</div>
                    <div>{`Thumbs Up: ${this.state.thumbsUp}`}</div>
                    <div>{`Thumbs Down: ${this.state.thumbsDown}`}</div>
                    <button onClick={handleClose}>Close</button>
                  </div>
                )}
              />
            </React.Fragment>
          );
        } else {
          //console.log("")logged in, review w/o rating, return

          return (
            <React.Fragment>
              <MicroModal
                trigger={(handleOpen) => (
                  <div className="searchReviewCard">
                    <img
                      className="searchProjectImage"
                      src={`${review.ProjectReviewed.titleImg}`}
                      alt="project"
                    />
                    <h3>{`${review.ProjectReviewed.name}`}</h3>
                    <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                    {time !== 'Invalid date' ? (
                      <p>{`${time}`}</p>
                    ) : (
                      <p>{`${review.timestamp.slice(
                        0,
                        10
                      )}`}</p>
                    )}
                    <Link to={`/projects/${review.ProjectReviewed.id}`} />
                    <p>{`Title: ${review.name}`}</p>
                    <button id="reviewButton" onClick={handleOpen}>
                      See This Review
                    </button>
                  </div>
                )}
                children={(handleClose) => (
                  <div className="reviewCardModal">
                    <h3>{`${review.ProjectReviewed.name}`}</h3>
                    <Link to={`/${review.Author.username}/profile`}><p className="createdBy">{`@${review.Author.username}`}</p></Link>
                    {time !== 'Invalid date' ? (
                      <p>{time}</p>
                    ) : (
                      <p>{review.timestamp.slice(0, 10)}</p>
                    )}
                    <Link to={`/projects/${review.ProjectReviewed.id}`}>
                      <img
                        className="searchProjectImage"
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                    </Link>
                    <h3>{`${review.name}`}</h3>
                    <p>{`${review.text}`}</p>
                    <div>{`Thumbs Up: ${this.state.thumbsUp}`}</div>
                    <div>{`Thumbs Down: ${this.state.thumbsDown}`}</div>
                    <button onClick={handleClose}>Close</button>
                  </div>
                )}
              />
            </React.Fragment>
          );
        }
      }
    } else {
      return (
        <div className="searchReviewCard">
          <SkeletonTheme highlightColor="#6fb3b8">
            <div className="searchProjectImage">
              <Skeleton />
            </div>
            <h3>
              <Skeleton />
            </h3>
            <p>
              <Skeleton />
            </p>
            <p>
              <Skeleton />
            </p>
            <Skeleton />
            <p>
              <Skeleton />
            </p>
            <button id="reviewButton">
              <Skeleton />
            </button>
          </SkeletonTheme>
        </div>
      );
    }
  }
}

export default ReviewCard;
