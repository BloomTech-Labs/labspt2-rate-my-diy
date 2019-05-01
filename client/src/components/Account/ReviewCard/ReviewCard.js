import React from 'react';
import MicroModal from 'react-micro-modal';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { editReview, likeAReview, dislikeAReview } from '../../../query/query';
import "./ReviewCard.scss"

class ReviewCard extends React.Component {
  constructor(props) {
    super(props);

    const { users, review } = this.props;

    const json = localStorage.getItem('authUser');
    const authUser = JSON.parse(json);
    let visitor = [];
    let loggedIn = false;
    if (authUser !== null)
      visitor = users.filter((u) => u.email === authUser.email)[0];
    console.log({ reviewCardUsers: users, visitor: visitor });
    // visitor = user

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
      name: review.name,
      text: review.text,
      stars: 0,
      review: review
    };
  }

  componentDidMount() {
    if (this.state.authUser != null) {
      let disFilter = this.state.visitor.DislikedReviews.filter(
        (r) => r.id === this.state.review.id
      );
      let likeFilter = this.state.visitor.LikedReviews.filter(
        (r) => r.id === this.state.review.id
      );
      if (disFilter[0]) {
        this.setState({
          ...this.state,
          didThumbDown: true,
          thumbsUpDisabled: true,
          loggedIn: true
        });
      }
      if (likeFilter[0]) {
        this.setState({
          ...this.state,
          didThumbUp: true,
          thumbsDownDisabled: true,
          loggedIn: true
        });
      } else {
        this.setState({ ...this.state, loggedIn: true });
      }
    } else {
      this.setState({ loggedIn: false });
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
    const { loggedIn, authUser } = this.state;

    if (loggedIn) {
      const { review } = this.props;
      // console.log("logged in")
      console.log({
        revAuthEmail: review.Author.email,
        visEmail: this.state.visitor.email
      });
      if (review.Author.email === authUser.email) {
        // console.log("logged in, your review")
        if (review.projRating !== null && review.projRating !== undefined) {
          // console.log("logged in, your review, you rated the project")
          if (this.state.edit) {
            // console.log("logged in, your review, you rated the project, you want to edit, return")

            return (
              <div>
                <MicroModal
                  trigger={(handleOpen) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <Link to={`/projects/${review.ProjectReviewed.id}`}>
                        <img
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                      </Link>
                      <div>{`${review.name}`}</div>
                      <button onClick={handleOpen}>View More</button>
                    </div>
                  )}
                  children={(handleClose) => (
                    <Mutation mutation={editReview}>
                      {(editReview, { loading, error, data }) => {
                        if (loading)
                          return (
                            <form>
                              <div>
                                <div>{`${review.ProjectReviewed.name}`}</div>
                                <div>{`Review By: @${
                                  review.Author.username
                                }`}</div>
                                <div>{`${review.timestamp}`}</div>
                                <Link
                                  to={`/projects/${review.ProjectReviewed.id}`}
                                >
                                  <img
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
                                <span>{`Thumbs Up: ${
                                  this.state.thumbsUp
                                }`}</span>
                                |
                                <span>{`Thumbs Down: ${
                                  this.state.thumbsDown
                                }`}</span>
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
                                <div>{`Review By: @${
                                  review.Author.username
                                }`}</div>
                                <div>{`${review.timestamp}`}</div>
                                <Link
                                  to={`/projects/${review.ProjectReviewed.id}`}
                                >
                                  <img
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
                                <span>{`Thumbs Up: ${
                                  this.state.thumbsUp
                                }`}</span>
                                |
                                <span>{`Thumbs Down: ${
                                  this.state.thumbsDown
                                }`}</span>
                                <div>
                                  <span>
                                    There was an error submitting your changes.
                                  </span>
                                  <button onClick={handleClose}>Close</button>
                                </div>
                              </div>
                            </form>
                          );
                        }
                        if (data)
                          return (
                            <div>
                              <div>{`${review.ProjectReviewed.name}`}</div>
                              <div>{`Review By: @${
                                review.Author.username
                              }`}</div>
                              <div>{`${review.timestamp}`}</div>
                              <Link
                                to={`/projects/${review.ProjectReviewed.id}`}
                              >
                                <img
                                  src={`${review.ProjectReviewed.titleImg}`}
                                  alt="project"
                                />
                              </Link>
                              <div>{`${review.name}`}</div>
                              <div>{`${review.text}`}</div>
                              <span>{`Thumbs Up: ${this.state.thumbsUp}`}</span>
                              |
                              <span>{`Thumbs Down: ${
                                this.state.thumbsDown
                              }`}</span>
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
                              await this.props.refetch();
                              let revs = this.props.review;
                              await this.setState({
                                ...this.state,
                                review: revs,
                                edit: false
                              });
                            }}
                          >
                            <div>
                              <div>{`${review.ProjectReviewed.name}`}</div>
                              <div>{`Review By: @${
                                review.Author.username
                              }`}</div>
                              <div>{`${review.timestamp}`}</div>
                              <Link
                                to={`/projects/${review.ProjectReviewed.id}`}
                              >
                                <img
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
                              <span>{`Thumbs Up: ${this.state.thumbsUp}`}</span>
                              |
                              <span>{`Thumbs Down: ${
                                this.state.thumbsDown
                              }`}</span>
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
              </div>
            );
          } else {
            // console.log("logged in, your review, you rated, you don't want to edit, return")

            return (
              <div>
                <MicroModal
                  trigger={(handleOpen) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <Link to={`/projects/${review.ProjectReviewed.id}`}>
                        <img
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                      </Link>
                      <div>{`${review.name}`}</div>
                      <button onClick={handleOpen}>View More</button>
                    </div>
                  )}
                  children={(handleClose) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <Link to={`/projects/${review.ProjectReviewed.id}`}>
                        <img
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                      </Link>
                      <div>{`Rating of Project: ${review.projRating}`}</div>
                      <div>{`${review.name}`}</div>
                      <div>{`${review.text}`}</div>
                      <span>{`Thumbs Up: ${this.state.thumbsUp}`}</span>|
                      <span>{`Thumbs Down: ${this.state.thumbsDown}`}</span>
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
              </div>
            );
          }
        } else {
          // console.log("logged in, your review, you didn't rate")
          if (this.state.edit) {
            // console.log("logged in, your review, you didn't rate, you want to edit, return")

            return (
              <div>
                <MicroModal
                  trigger={(handleOpen) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <Link to={`/projects/${review.ProjectReviewed.id}`}>
                        <img
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                      </Link>
                      <div>{`${review.name}`}</div>
                      <button onClick={handleOpen}>View More</button>
                    </div>
                  )}
                  children={(handleClose) => (
                    <Mutation mutation={editReview}>
                      {(editReview, { loading, error, data }) => {
                        if (loading)
                          return (
                            <form>
                              <div>
                                <div>{`${review.ProjectReviewed.name}`}</div>
                                <div>{`Review By: @${
                                  review.Author.username
                                }`}</div>
                                <div>{`${review.timestamp}`}</div>
                                <Link
                                  to={`/projects/${review.ProjectReviewed.id}`}
                                >
                                  <img
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
                                <span>{`Thumbs Up: ${
                                  this.state.thumbsUp
                                }`}</span>
                                |
                                <span>{`Thumbs Down: ${
                                  this.state.thumbsDown
                                }`}</span>
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
                              <div>{`Review By: @${
                                review.Author.username
                              }`}</div>
                              <div>{`${review.timestamp}`}</div>
                              <Link
                                to={`/projects/${review.ProjectReviewed.id}`}
                              >
                                <img
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
                              <span>{`Thumbs Up: ${this.state.thumbsUp}`}</span>
                              |
                              <span>{`Thumbs Down: ${
                                this.state.thumbsDown
                              }`}</span>
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
                              <div>{`Review By: @${
                                review.Author.username
                              }`}</div>
                              <div>{`${review.timestamp}`}</div>
                              <Link
                                to={`/projects/${review.ProjectReviewed.id}`}
                              >
                                <img
                                  src={`${review.ProjectReviewed.titleImg}`}
                                  alt="project"
                                />
                              </Link>
                              <div>{`${review.name}`}</div>
                              <div>{`${review.text}`}</div>
                              <span>{`Thumbs Up: ${this.state.thumbsUp}`}</span>
                              |
                              <span>{`Thumbs Down: ${
                                this.state.thumbsDown
                              }`}</span>
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
                              await this.props.refetch();
                              const revs = this.props.review;
                              await this.setState({
                                ...this.state,
                                edit: false,
                                review: revs
                              });
                            }}
                          >
                            <div>
                              <div>{`${review.ProjectReviewed.name}`}</div>
                              <div>{`Review By: @${
                                review.Author.username
                              }`}</div>
                              <div>{`${review.timestamp}`}</div>
                              <Link
                                to={`/projects/${review.ProjectReviewed.id}`}
                              >
                                <img
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
                              <span>{`Thumbs Up: ${this.state.thumbsUp}`}</span>
                              |
                              <span>{`Thumbs Down: ${
                                this.state.thumbsDown
                              }`}</span>
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
              </div>
            );
          } else {
            // console.log("logged in, your review, you didn't rate, you don't want to edit, return")

            return (
              <div>
                <MicroModal
                  trigger={(handleOpen) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <Link to={`/projects/${review.ProjectReviewed.id}`}>
                        <img
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                      </Link>
                      <div>{`${review.name}`}</div>
                      <button onClick={handleOpen}>View More</button>
                    </div>
                  )}
                  children={(handleClose) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <Link to={`/projects/${review.ProjectReviewed.id}`}>
                        <img
                          src={`${review.ProjectReviewed.titleImg}`}
                          alt="project"
                        />
                      </Link>
                      <div>{`${review.name}`}</div>
                      <div>{`${review.text}`}</div>
                      <span>{`Thumbs Up: ${this.state.thumbsUp}`}</span>|
                      <span>{`Thumbs Down: ${this.state.thumbsDown}`}</span>
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
              </div>
            );
          }
        }
      } else {
        // console.log("logged in, not your review")

        if (review.projRating !== null && review.projRating !== undefined) {
          // console.log("logged in, not your rev, review w/rating")

          // if (this.state.didThumbUp) {
          //   // logged in, not your rev, review w/ rating, added thumbUp, return
          // } else if (this.state.didThumbDown) {
          //   // logged in, not your rev, review w/ rating, added thumbDown, return
          // } else {
          //   // logged in, not your rev, review w/ rating, haven't thumbed yet, return
          // }

          return (
            <div>
              <MicroModal
                trigger={(handleOpen) => (
                  <div>
                    <div>{`${review.ProjectReviewed.name}`}</div>
                    <div>{`Review By: @${review.Author.username}`}</div>
                    <div>{`${review.timestamp}`}</div>
                    <Link to={`/projects/${review.ProjectReviewed.id}`}>
                      <img
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                    </Link>
                    <div>{`${review.name}`}</div>
                    <button onClick={handleOpen}>View More</button>
                  </div>
                )}
                children={(handleClose) => (
                  <div>
                    <div>{`${review.ProjectReviewed.name}`}</div>
                    <div>{`Review By: @${review.Author.username}`}</div>
                    <div>{`${review.timestamp}`}</div>
                    <Link to={`/projects/${review.ProjectReviewed.id}`}>
                      <img
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                    </Link>
                    <div>{`Rating of Project: ${review.projRating}`}</div>
                    <div>{`${review.name}`}</div>
                    <div>{`${review.text}`}</div>
                    <Mutation mutation={likeAReview}>
                      {(likeAReview, { loading, error, data }) => {
                        if (loading)
                          return (
                            <form>
                              <span>
                                <button disable={this.state.thumbsUpDisabled}>
                                  +
                                </button>
                                {`Thumbs Up: ${this.state.thumbsUp}`}
                              </span>
                              |
                            </form>
                          );
                        if (error) {
                          console.log({ likeError: error });
                          return (
                            <form>
                              <span>
                                <button disabled>+</button>
                                {`Thumbs Up: ${this.state.thumbsUp}`}
                              </span>
                              |
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
                                    revId: review.id,
                                    username: this.state.visitor.username,
                                    didThumbUp: this.state.didThumbUp
                                  }
                                });
                                await this.props.refetch();
                                const { review } = await this.props;
                                await this.thumbsUp();
                                await this.setState({
                                  ...this.state,
                                  review: review,
                                  thumbsUp: review.thumbsUp
                                });
                              }}
                            >
                              <span>
                                <button
                                  type="submit"
                                  disabled={this.state.thumbsUpDisabled}
                                >
                                  +
                                </button>
                                {`Thumbs Up: ${this.state.thumbsUp}`}
                              </span>
                              |
                            </form>
                          );
                        return (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              await likeAReview({
                                variables: {
                                  revId: review.id,
                                  username: this.state.visitor.username,
                                  didThumbUp: this.state.didThumbUp
                                }
                              });
                              await this.props.refetch();
                              const { review } = await this.props;
                              await this.thumbsUp();
                              await this.setState({
                                ...this.state,
                                review: review,
                                thumbsUp: review.thumbsUp
                              });
                            }}
                          >
                            <span>
                              <button
                                type="submit"
                                disabled={this.state.thumbsUpDisabled}
                              >
                                +
                              </button>
                              {`Thumbs Up: ${this.state.thumbsUp}`}
                            </span>
                            |
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
                                <button disabled>-</button>
                                {`Thumbs Down: ${this.state.thumbsDown}`}
                              </span>
                            </form>
                          );
                        if (error) {
                          console.log({ disError: error });
                          return (
                            <form>
                              <span>
                                <button disabled>-</button>
                                {`Thumbs Down: ${this.state.thumbsDown}`}
                              </span>
                              <div>There was an error logging your rating.</div>
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
                                    revId: review.id,
                                    username: this.state.visitor.username,
                                    didThumbDown: this.state.didThumbDown
                                  }
                                });
                                await this.props.refetch();
                                const { review } = await this.props;
                                await this.thumbsDown();
                                await this.setState({
                                  ...this.state,
                                  review: review,
                                  thumbsDown: review.thumbsDown
                                });
                              }}
                            >
                              <span>
                                <button
                                  type="submit"
                                  disabled={this.state.thumbsDownDisabled}
                                >
                                  -
                                </button>
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
                                  revId: review.id,
                                  username: this.state.visitor.username,
                                  didThumbDown: this.state.didThumbDown
                                }
                              });
                              await this.props.refetch();
                              const { review } = await this.props;
                              await this.thumbsDown();
                              await this.setState({
                                ...this.state,
                                review: review,
                                thumbsDown: review.thumbsDown
                              });
                            }}
                          >
                            <span>
                              <button
                                type="submit"
                                disabled={this.state.thumbsDownDisabled}
                              >
                                -
                              </button>
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
            </div>
          );
        } else {
          // console.log("logged in, not your rev,  review w/o rating")

          //   if (this.state.didThumbUp) {
          //     // logged in, not your rev, review w/o rating, added thumbUp, return
          //   } else if (this.state.didThumbDown) {
          //     // logged in, not your rev, review w/o rating, added thumbDown, return
          //   } else {
          //     // logged in, not your rev, review w/o rating, haven't thumbed yet, return
          //   }
          // }
          return (
           
              <MicroModal
                trigger={(handleOpen) => (
                  <div className="inner-review-card">
                    <div className="reviewed-name">{`${review.ProjectReviewed.name}`}</div>
                    <hr className="line-break"/>
                    <div>{`Review By: @${review.Author.username}`}</div>
                    <div>{`${review.timestamp}`}</div>
                    <Link to={`/projects/${review.ProjectReviewed.id}`}>
                      <img
                       className="review-img"
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                    </Link>
                    <div>{`${review.name}`}</div>
                    <button onClick={handleOpen}>View More</button>
                  </div>
                )}
                children={(handleClose) => (
                  <div>
                    <div>{`${review.ProjectReviewed.name}`}</div>
                    <div>{`Review By: @${review.Author.username}`}</div>
                    <div>{`${review.timestamp}`}</div>
                    <Link to={`/projects/${review.ProjectReviewed.id}`}>
                      <img
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                    </Link>
                    <div>{`${review.name}`}</div>
                    <div>{`${review.text}`}</div>

                    <Mutation mutation={likeAReview}>
                      {(likeAReview, { loading, error, data }) => {
                        if (loading)
                          return (
                            <form>
                              <span>
                                <button disabled>+</button>
                                {`Thumbs Up: ${this.state.thumbsUp}`}
                              </span>
                              |
                            </form>
                          );
                        if (error) {
                          console.log({ likeError: error });
                          return (
                            <form>
                              <span>
                                <button disabled>+</button>
                                {`Thumbs Up: ${this.state.thumbsUp}`}
                              </span>
                              |
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
                                await this.props.refetch();
                                const { review } = await this.props;
                                await this.thumbsUp();
                                await this.setState({
                                  ...this.state,
                                  review: review,
                                  thumbsUp: review.thumbsUp
                                });
                              }}
                            >
                              <span>
                                <button
                                  type="submit"
                                  disabled={this.state.thumbsUpDisabled}
                                >
                                  +
                                </button>
                                {`Thumbs Up: ${this.state.thumbsUp}`}
                              </span>
                              |
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
                              await this.props.refetch();
                              const { review } = await this.props;
                              await this.thumbsUp();
                              await this.setState({
                                ...this.state,
                                review: review,
                                thumbsUp: review.thumbsUp
                              });
                            }}
                          >
                            <span>
                              <button
                                type="submit"
                                disabled={this.state.thumbsUpDisabled}
                              >
                                +
                              </button>
                              {`Thumbs Up: ${this.state.thumbsUp}`}
                            </span>
                            |
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
                                <button disabled>-</button>
                                {`Thumbs Down: ${this.state.thumbsDown}`}
                              </span>
                            </form>
                          );
                        if (error) {
                          console.log({ disError: error });
                          return (
                            <form>
                              <span>
                                <button disabled>-</button>
                                {`Thumbs Down: ${this.state.thumbsDown}`}
                              </span>
                              <div>There was an error logging your rating.</div>
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
                                    revId: this.props.review.id,
                                    username: this.state.visitor.username,
                                    didThumbDown: this.state.didThumbDown
                                  }
                                });
                                await this.props.refetch();
                                const { review } = await this.props;
                                await this.thumbsDown();
                                await this.setState({
                                  ...this.state,
                                  review: review,
                                  thumbsDown: review.thumbsDown
                                });
                              }}
                            >
                              <span>
                                <button
                                  type="submit"
                                  disabled={this.state.thumbsDownDisabled}
                                >
                                  -
                                </button>
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
                              await this.props.refetch();
                              const { review } = await this.props;
                              await this.thumbsDown();
                              await this.setState({
                                ...this.state,
                                review: review,
                                thumbsDown: review.thumbsDown
                              });
                            }}
                          >
                            <span>
                              <button
                                type="submit"
                                disabled={this.state.thumbsDownDisabled}
                              >
                                -
                              </button>
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
           
          );
        }
      }
    } else {
      // console.log("not logged in")
      const { review } = this.props;

      if (review.projRating !== null && review.projRating !== undefined) {
        // console.log("logged in, review includes rating, return")

        return (
          <div>
            <MicroModal
              trigger={(handleOpen) => (
                <div>
                  <div>{`${review.ProjectReviewed.name}`}</div>
                  <div>{`Review By: @${review.Author.username}`}</div>
                  <div>{`${review.timestamp}`}</div>
                  <Link to={`/projects/${review.ProjectReviewed.id}`}>
                    <img
                      src={`${review.ProjectReviewed.titleImg}`}
                      alt="project"
                    />
                  </Link>
                  <div>{`${review.name}`}</div>
                  <button onClick={handleOpen}>View More</button>
                </div>
              )}
              children={(handleClose) => (
                <div>
                  <div>{`${review.ProjectReviewed.name}`}</div>
                  <div>{`Review By: @${review.Author.username}`}</div>
                  <div>{`${review.timestamp}`}</div>
                  <Link to={`/projects/${review.ProjectReviewed.id}`}>
                    <img
                      src={`${review.ProjectReviewed.titleImg}`}
                      alt="project"
                    />
                  </Link>
                  <div>{`Rating of Project: ${review.projRating}`}</div>
                  <div>{`${review.name}`}</div>
                  <div>{`${review.text}`}</div>
                  <span>{`Thumbs Up: ${this.state.thumbsUp}`}</span>
                  <span>{`Thumbs Down: ${this.state.thumbsDown}`}</span>
                  <button onClick={handleClose}>Close</button>
                </div>
              )}
            />
          </div>
        );
      } else {
        //console.log("")logged in, review w/o rating, return

        return (
          <div>
            <MicroModal
              trigger={(handleOpen) => (
                <div>
                  <div>{`${review.ProjectReviewed.name}`}</div>
                  <div>{`Review By: @${review.Author.username}`}</div>
                  <div>{`${review.timestamp}`}</div>
                  <Link to={`/projects/${review.ProjectReviewed.id}`}>
                    <img
                      src={`${review.ProjectReviewed.titleImg}`}
                      alt="project"
                    />
                  </Link>
                  <div>{`${review.name}`}</div>
                  <button onClick={handleOpen}>View More</button>
                </div>
              )}
              children={(handleClose) => (
                <div>
                  <div>{`${review.ProjectReviewed.name}`}</div>
                  <div>{`Review By: @${review.Author.username}`}</div>
                  <div>{`${review.timestamp}`}</div>
                  <Link to={`/projects/${review.ProjectReviewed.id}`}>
                    <img
                      src={`${review.ProjectReviewed.titleImg}`}
                      alt="project"
                    />
                  </Link>
                  <div>{`${review.name}`}</div>
                  <div>{`${review.text}`}</div>
                  <span>{`Thumbs Up: ${this.state.thumbsUp}`}</span>
                  <span>{`Thumbs Down: ${this.state.thumbsDown}`}</span>
                  <button onClick={handleClose}>Close</button>
                </div>
              )}
            />
          </div>
        );
      }
    }
  }
}

export default ReviewCard;
