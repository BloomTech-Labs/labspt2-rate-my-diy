import React from 'react';
import MicroModal from 'react-micro-modal';
import { Mutation } from 'react-apollo';
import { editReview, likeAReview, dislikeAReview } from '../../../query/query';

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
      stars: 0,
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
  };

  thumbsDown = () => {
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
  };

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

            return (
              <div>
                <MicroModal
                  trigger={(handleOpen) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <img
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                      <div>{`${review.name}`}</div>
                      <button onClick={handleOpen}>View More</button>
                    </div>
                  )}
                  children={(handleClose) => (
                    <Mutation mutation={editReview}>
                      {(editReview, { loading, error, data }) => {
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
                              await this.setState({
                                ...this.state,
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
                              <img
                                src={`${review.ProjectReviewed.titleImg}`}
                                alt="project"
                              />
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
                              <span>{`Thumbs Up: ${review.thumbsUp}`}</span>|
                              <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
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
            // logged in, your review, you rated, you don't want to edit, return

            return (
              <div>
                <MicroModal
                  trigger={(handleOpen) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <img
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                      <div>{`${review.name}`}</div>
                      <button onClick={handleOpen}>View More</button>
                    </div>
                  )}
                  children={(handleClose) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <img
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                      <div>{`Rating of Project: ${review.projRating}`}</div>
                      <div>{`${review.name}`}</div>
                      <div>{`${review.text}`}</div>
                      <span>{`Thumbs Up: ${review.thumbsUp}`}</span>|
                      <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
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
          // logged in, your review, you didn't rate
          if (this.state.edit) {
            // logged in, your review, you didn't rate, you want to edit, return

            return (
              <div>
                <MicroModal
                  trigger={(handleOpen) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <img
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                      <div>{`${review.name}`}</div>
                      <button onClick={handleOpen}>View More</button>
                    </div>
                  )}
                  children={(handleClose) => (
                    <Mutation mutation={editReview}>
                      {(editReview, { loading, error, data }) => {
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
                              await this.setState({
                                ...this.state,
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
                              <img
                                src={`${review.ProjectReviewed.titleImg}`}
                                alt="project"
                              />
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
                              <span>{`Thumbs Up: ${review.thumbsUp}`}</span>|
                              <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
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
            // logged in, your review, you didn't rate, you don't want to edit, return

            return (
              <div>
                <MicroModal
                  trigger={(handleOpen) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <img
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                      <div>{`${review.name}`}</div>
                      <button onClick={handleOpen}>View More</button>
                    </div>
                  )}
                  children={(handleClose) => (
                    <div>
                      <div>{`${review.ProjectReviewed.name}`}</div>
                      <div>{`Review By: @${review.Author.username}`}</div>
                      <div>{`${review.timestamp}`}</div>
                      <img
                        src={`${review.ProjectReviewed.titleImg}`}
                        alt="project"
                      />
                      <div>{`${review.name}`}</div>
                      <div>{`${review.text}`}</div>
                      <span>{`Thumbs Up: ${review.thumbsUp}`}</span>|
                      <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
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
        // logged in, not your review

        if (review.projRating !== null || undefined) {
          // logged in, not your rev, review w/rating

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
                    <img
                      src={`${review.ProjectReviewed.titleImg}`}
                      alt="project"
                    />
                    <div>{`${review.name}`}</div>
                    <button onClick={handleOpen}>View More</button>
                  </div>
                )}
                children={(handleClose) => (
                  <div>
                    <div>{`${review.ProjectReviewed.name}`}</div>
                    <div>{`Review By: @${review.Author.username}`}</div>
                    <div>{`${review.timestamp}`}</div>
                    <img
                      src={`${review.ProjectReviewed.titleImg}`}
                      alt="project"
                    />
                    <div>{`Rating of Project: ${review.projRating}`}</div>
                    <div>{`${review.name}`}</div>
                    <div>{`${review.text}`}</div>
                    <Mutation mutation={likeAReview}>
                      {(likeAReview, { loading, error, data }) => {
                        return (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              await likeAReview({
                                variables: {
                                  id: review.id,
                                  username: this.state.visitor.username
                                }
                              });
                              await this.thumbsUp();
                            }}
                          >
                            <span>
                              <button
                                type="submit"
                                disabled={this.state.thumbsUpDisabled}
                              >
                                +
                              </button>
                              {`Thumbs Up: ${review.thumbsUp}`}
                            </span>
                            |
                          </form>
                        );
                      }}
                    </Mutation>

                    <Mutation mutation={dislikeAReview}>
                      {(dislikeAReview, { loading, error, data }) => {
                        return (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              await dislikeAReview({
                                variables: {
                                  id: review.id,
                                  username: this.state.visitor.username
                                }
                              });
                              await this.thumbsDown();
                            }}
                          >
                            <span>
                              <button
                                type="submit"
                                disabled={this.state.thumbsDownDisabled}
                              >
                                -
                              </button>
                              {`Thumbs Down: ${review.thumbsDown}`}
                            </span>
                            |
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
          // logged in, not your rev,  review w/o rating

          //   if (this.state.didThumbUp) {
          //     // logged in, not your rev, review w/o rating, added thumbUp, return
          //   } else if (this.state.didThumbDown) {
          //     // logged in, not your rev, review w/o rating, added thumbDown, return
          //   } else {
          //     // logged in, not your rev, review w/o rating, haven't thumbed yet, return
          //   }
          // }
          return (
            <div>
              <MicroModal
                trigger={(handleOpen) => (
                  <div>
                    <div>{`${review.ProjectReviewed.name}`}</div>
                    <div>{`Review By: @${review.Author.username}`}</div>
                    <div>{`${review.timestamp}`}</div>
                    <img
                      src={`${review.ProjectReviewed.titleImg}`}
                      alt="project"
                    />
                    <div>{`${review.name}`}</div>
                    <button onClick={handleOpen}>View More</button>
                  </div>
                )}
                children={(handleClose) => (
                  <div>
                    <div>{`${review.ProjectReviewed.name}`}</div>
                    <div>{`Review By: @${review.Author.username}`}</div>
                    <div>{`${review.timestamp}`}</div>
                    <img
                      src={`${review.ProjectReviewed.titleImg}`}
                      alt="project"
                    />
                    <div>{`${review.name}`}</div>
                    <div>{`${review.text}`}</div>

                    <Mutation mutation={likeAReview}>
                      {(likeAReview, { loading, error, data }) => {
                        return (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              await likeAReview({
                                variables: {
                                  id: review.id,
                                  username: this.state.visitor.username
                                }
                              });
                              await this.thumbsUp();
                            }}
                          >
                            <span>
                              <button
                                type="submit"
                                disabled={this.state.thumbsUpDisabled}
                              >
                                +
                              </button>
                              {`Thumbs Up: ${review.thumbsUp}`}
                            </span>
                            |
                          </form>
                        );
                      }}
                    </Mutation>
                    <Mutation mutation={dislikeAReview}>
                      {(dislikeAReview, { loading, error, data }) => {
                        return (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              await dislikeAReview({
                                variables: {
                                  id: review.id,
                                  username: this.state.visitor.username
                                }
                              });
                              await this.thumbsDown();
                            }}
                          >
                            <span>
                              <button
                                type="submit"
                                disabled={this.state.thumbsDownDisabled}
                              >
                                -
                              </button>
                              {`Thumbs Down: ${review.thumbsDown}`}
                            </span>
                            |
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
        }
      }
    } else {
      // not logged in

      if (review.projRating !== null || undefined) {
        // logged in, review includes rating, return

        return (
          <div>
            <MicroModal
              trigger={(handleOpen) => (
                <div>
                  <div>{`${review.ProjectReviewed.name}`}</div>
                  <div>{`Review By: @${review.Author.username}`}</div>
                  <div>{`${review.timestamp}`}</div>
                  <img
                    src={`${review.ProjectReviewed.titleImg}`}
                    alt="project"
                  />
                  <div>{`${review.name}`}</div>
                  <button onClick={handleOpen}>View More</button>
                </div>
              )}
              children={(handleClose) => (
                <div>
                  <div>{`${review.ProjectReviewed.name}`}</div>
                  <div>{`Review By: @${review.Author.username}`}</div>
                  <div>{`${review.timestamp}`}</div>
                  <img
                    src={`${review.ProjectReviewed.titleImg}`}
                    alt="project"
                  />
                  <div>{`Rating of Project: ${review.projRating}`}</div>
                  <div>{`${review.name}`}</div>
                  <div>{`${review.text}`}</div>
                  <span>{`Thumbs Up: ${review.thumbsUp}`}</span>
                  <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
                  <button onClick={handleClose}>Close</button>
                </div>
              )}
            />
          </div>
        );
      } else {
        //logged in, review w/o rating, return

        return (
          <div>
            <MicroModal
              trigger={(handleOpen) => (
                <div>
                  <div>{`${review.ProjectReviewed.name}`}</div>
                  <div>{`Review By: @${review.Author.username}`}</div>
                  <div>{`${review.timestamp}`}</div>
                  <img
                    src={`${review.ProjectReviewed.titleImg}`}
                    alt="project"
                  />
                  <div>{`${review.name}`}</div>
                  <button onClick={handleOpen}>View More</button>
                </div>
              )}
              children={(handleClose) => (
                <div>
                  <div>{`${review.ProjectReviewed.name}`}</div>
                  <div>{`Review By: @${review.Author.username}`}</div>
                  <div>{`${review.timestamp}`}</div>
                  <img
                    src={`${review.ProjectReviewed.titleImg}`}
                    alt="project"
                  />
                  <div>{`${review.name}`}</div>
                  <div>{`${review.text}`}</div>
                  <span>{`Thumbs Up: ${review.thumbsUp}`}</span>
                  <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
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
