import React from 'react';
import MicroModal from 'react-micro-modal';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { RATE_PROJECT, NEW_REVIEW, getReviews } from '../../../query/query';
import ReviewCard from '../ReviewCard/ReviewCard';

class ProjectCard extends React.Component {
  constructor(props) {
    super(props);
    const { users, reviews, project } = this.props;

    const json = localStorage.getItem('authUser');

    let revs = reviews.filter((rev) => rev.ProjectReviewed.id === project.id);

    const user = JSON.parse(json);
    let visitor = [];
    let loggedIn = false;
    if (user !== null) visitor = users.filter((u) => u.email === user.email);

    this.state = {
      edit: false,
      stars: 0,
      starsDisabled: true,
      authUser: user,
      visitor: visitor,
      loggedIn: loggedIn,
      newReview: false,
      name: '',
      text: '',
      reviews: revs
    };
  }

  componentDidMount = () => {
    if (this.state.authUser != null) {
      this.setState({ ...this.state, loggedIn: true });
    } else {
      this.setState({ loggedIn: false });
    }
  };

  textChange = async (e) => {
    let value = e.target.value;
    await this.setState({
      ...this.state,
      [e.target.name]: value
    });
  };

  starChange = async (e) => {
    const stars = await parseInt(e.target.value);
    await this.setState({
      ...this.state,
      stars: stars
    });

    if (this.state.stars === 0) {
      await this.setState({ ...this.state, starsDisabled: true });
    }

    if (this.state.stars > 0) {
      await this.setState({ ...this.state, starsDisabled: false });
    }
  };

  review = () => {
    if (this.state.loggedIn === true) {
      this.setState({ ...this.state, newReview: true });
    } else {
      return this.props.history.push('/signin');
    }
  };

  render() {
    const { project } = this.props;

    let steps = JSON.parse(project.steps);

    // let revs = this.state.reviews.filter((rev) => rev.ProjectReviewed.id === project.id);

    // console.log({ visitor: this.state.visitor, revs: this.state.reviews });

    if (this.state.edit) {
      return <Redirect to={`/projects/${project.id}/edit`} />;
    }

    if (this.state.loggedIn === true) {
      // logged in

      if (this.state.reviews[0]) {
        // logged in, are reviews

        if (project.User.email === this.state.authUser.email) {
          // logged in, are reviews, your project, return
          return (
            <div>
              <h1>{`${project.name}`}</h1>
              <div>{`${project.User.username}`}</div>
              <div>{`${project.rating}`}</div>
              <div>{`${project.timestamp}`}</div>
              <img src={`${project.titleImg}`} alt="project" />
              <div>{`${project.titleBlurb}`}</div>
              <MicroModal
                trigger={(handleOpen) => (
                  <button onClick={handleOpen}>View More</button>
                )}
                children={(handleClose) => (
                  <div>
                    <h1>{`${project.name}`}</h1>
                    <div>{`${project.User.username}`}</div>
                    <div>{`${project.rating}`}</div>
                    <div>{`${project.timestamp}`}</div>
                    <img src={`${project.titleImg}`} alt="project" />
                    <div>{`${project.titleBlurb}`}</div>
                    <h2>Steps:</h2>
                    {steps.map((step) => {
                      if (step.type === 'img') {
                        return <img key={step.body} src={step.body} />;
                      } else {
                        return <div key={step.body}>{`${step.body}`}</div>;
                      }
                    })}
                    <h2>Reviews:</h2>
                    {this.state.reviews.map((rev) => {
                      return <ReviewCard key={rev.id} review={rev} />;
                    })}
                    <button
                      onClick={() => {
                        handleClose();
                        this.setState({ edit: true });
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={handleClose}>Close</button>
                  </div>
                )}
              />
            </div>
          );
        } else {
          // logged in, are reviews, not your project

          if (this.state.newReview === true) {
            // logged in, are reviews, not your project, newReview

            if (this.state.visitor[0].RatedProjects) {
              // logged in, are reviews, not your project, newReview, you've rated projs
              let rateCheck = this.state.visitor[0].RatedProjects.filter(
                (proj) => proj.id === project.id
              );
              // console.log({ rateCheck: rateCheck });
              if (rateCheck.length >= 1) {
                // logged in, are reviews, not your proj, newRev, you've rated projs, rated this one, return

                return (
                  <div>
                    <h1>{`${project.name}`}</h1>
                    <div>{`${project.User.username}`}</div>
                    <div>{`${project.rating}`}</div>
                    <div>{`${project.timestamp}`}</div>
                    <img src={`${project.titleImg}`} alt="project" />
                    <div>{`${project.titleBlurb}`}</div>
                    <MicroModal
                      trigger={(handleOpen) => (
                        <button onClick={handleOpen}>View More</button>
                      )}
                      children={(handleClose) => (
                        <div>
                          <h1>{`${project.name}`}</h1>
                          <div>{`${project.User.username}`}</div>
                          <div>{`${project.rating}`}</div>
                          <div>{`${project.timestamp}`}</div>
                          <img src={`${project.titleImg}`} alt="project" />
                          <div>{`${project.titleBlurb}`}</div>
                          <h2>Steps:</h2>
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return <img key={step.body} src={step.body} />;
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}
                          <h2>Reviews:</h2>
                          {this.state.reviews.map((rev) => {
                            return <ReviewCard key={rev.id} review={rev} />;
                          })}
                          <button
                            onClick={(e) => {
                              this.review();
                            }}
                          >
                            Add a review
                          </button>
                          <Mutation mutation={NEW_REVIEW}>
                            {(newReview, { loading, error, data }) => {
                              if (loading)
                                return (
                                  <form>
                                    <h2>New Review</h2>
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
                                    <span>Submitting your review...</span>
                                  </form>
                                );
                              if (error)
                                return (
                                  <form>
                                    <h2>New Review</h2>
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
                                    <span>
                                      There was an error submitting your review.
                                    </span>
                                    <button onClick={window.location.reload()}>
                                      Go Back
                                    </button>
                                  </form>
                                );
                              if (data)
                                console.log({
                                  data: data
                                }); /* return this.setState({...this.state, newReview: false}) */
                              return (
                                <form
                                  onSubmit={async (e) => {
                                    e.preventDefault();
                                    const date = await new Date(Date.now());

                                    await newReview({
                                      variables: {
                                        name: this.state.name,
                                        text: this.state.text,
                                        timestamp: date,
                                        user: project.User.username,
                                        username: this.state.visitor[0]
                                          .username,
                                        id: project.id
                                      }
                                      // refetchQueries: [ { query: getReviews}]
                                    });

                                    await this.props.refetch();
                                    const { reviews } = await this.props;
                                    let revs = await reviews.filter(
                                      (rev) =>
                                        rev.ProjectReviewed.id === project.id
                                    );
                                    await this.setState({
                                      ...this.state,
                                      newReview: false,
                                      reviews: revs
                                    });
                                  }}
                                >
                                  <h2>New Review</h2>
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
                                  <button type="submit">Submit</button>
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
                // logged in, are reviews, not your proj, newRev, you've rated projs, didn't rate this one, return

                return (
                  <div>
                    <h1>{`${project.name}`}</h1>
                    <div>{`${project.User.username}`}</div>
                    <div>{`${project.rating}`}</div>
                    <div>{`${project.timestamp}`}</div>
                    <img src={`${project.titleImg}`} alt="project" />
                    <div>{`${project.titleBlurb}`}</div>
                    <MicroModal
                      trigger={(handleOpen) => (
                        <button onClick={handleOpen}>View More</button>
                      )}
                      children={(handleClose) => (
                        <div>
                          <h1>{`${project.name}`}</h1>
                          <div>{`${project.User.username}`}</div>
                          <div>{`${project.rating}`}</div>
                          <div>{`${project.timestamp}`}</div>
                          <img src={`${project.titleImg}`} alt="project" />
                          <div>{`${project.titleBlurb}`}</div>
                          <h2>Steps:</h2>
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return <img key={step.body} src={step.body} />;
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}
                          {this.state.visitor[0].RatedProjects.map((proj) => {
                            if (proj.id === project.id) return null;
                            else
                              return (
                                <div key={proj.id}>
                                  <Mutation mutation={RATE_PROJECT}>
                                    {(newRating, { loading, error, data }) => {
                                      if (loading)
                                        return (
                                          <span>Submitting your rating...</span>
                                        );
                                      if (error)
                                        return <span>{`Error: ${error}`}</span>;
                                      if (data) return <Redirect to={`/`} />;
                                      return (
                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            newRating({
                                              variables: {
                                                rating: this.state.stars,
                                                id: project.id,
                                                username: this.state.visitor[0]
                                                  .username
                                              }
                                            });
                                          }}
                                        >
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
                                          <button
                                            type="submit"
                                            disabled={this.state.starsDisabled}
                                          >
                                            Submit Rating
                                          </button>
                                        </form>
                                      );
                                    }}
                                  </Mutation>
                                </div>
                              );
                          })}
                          <h2>Reviews:</h2>
                          {this.state.reviews.map((rev) => {
                            return <ReviewCard key={rev.id} review={rev} />;
                          })}
                          <Mutation mutation={NEW_REVIEW}>
                            {(newReview, { loading, error, data }) => {
                              if (loading)
                                return (
                                  <form>
                                    <h2>New Review</h2>
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
                                    <span>Submitting your review...</span>
                                  </form>
                                );
                              if (error)
                                return (
                                  <form>
                                    <h2>New Review</h2>
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
                                    <span>
                                      There was an error submitting your review.
                                    </span>
                                    <button onClick={window.location.reload()}>
                                      Go Back
                                    </button>
                                  </form>
                                );
                              if (data) console.log({ data: data });
                              return (
                                <form
                                  onSubmit={async (e) => {
                                    e.preventDefault();
                                    const date = await new Date(Date.now());
                                    await newReview({
                                      variables: {
                                        name: this.state.name,
                                        text: this.state.text,
                                        timestamp: date,
                                        user: project.User.username,
                                        username: this.state.visitor[0]
                                          .username,
                                        id: project.id
                                      }
                                      // refetchQueries: [ { query: getReviews}]
                                    });
                                    await this.props.refetch();
                                    const { reviews } = await this.props;
                                    let revs = await reviews.filter(
                                      (rev) =>
                                        rev.ProjectReviewed.id === project.id
                                    );
                                    await this.setState({
                                      ...this.state,
                                      newReview: false,
                                      reviews: revs
                                    });
                                  }}
                                >
                                  <h2>New Review</h2>
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
                                  <button type="submit">Submit</button>
                                </form>
                              );
                            }}
                          </Mutation>
                          <button
                            onClick={(e) => {
                              this.review();
                            }}
                          >
                            Add a review
                          </button>
                          <button onClick={handleClose}>Close</button>
                        </div>
                      )}
                    />
                  </div>
                );
              }
            } else {
              //logged in, are revs, not your proj, newReview, you've never rated, return

              return (
                <div>
                  <h1>{`${project.name}`}</h1>
                  <div>{`${project.User.username}`}</div>
                  <div>{`${project.rating}`}</div>
                  <div>{`${project.timestamp}`}</div>
                  <img src={`${project.titleImg}`} alt="project" />
                  <div>{`${project.titleBlurb}`}</div>
                  <MicroModal
                    trigger={(handleOpen) => (
                      <button onClick={handleOpen}>View More</button>
                    )}
                    children={(handleClose) => (
                      <div>
                        <h1>{`${project.name}`}</h1>
                        <div>{`${project.User.username}`}</div>
                        <div>{`${project.rating}`}</div>
                        <div>{`${project.timestamp}`}</div>
                        <img src={`${project.titleImg}`} alt="project" />
                        <div>{`${project.titleBlurb}`}</div>
                        <h2>Steps:</h2>
                        {steps.map((step) => {
                          if (step.type === 'img') {
                            return <img key={step.body} src={step.body} />;
                          } else {
                            return <div key={step.body}>{`${step.body}`}</div>;
                          }
                        })}
                        {this.state.visitor[0].RatedProjects.map((proj) => {
                          if (proj.id === project.id) return null;
                          else
                            return (
                              <div key={proj.id}>
                                <Mutation mutation={RATE_PROJECT}>
                                  {(newRating, { loading, error, data }) => {
                                    if (loading)
                                      return (
                                        <span>Submitting your rating...</span>
                                      );
                                    if (error)
                                      return <span>{`Error: ${error}`}</span>;
                                    if (data) return <Redirect to={`/`} />;
                                    return (
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          newRating({
                                            variables: {
                                              rating: this.state.stars,
                                              id: project.id,
                                              username: this.state.visitor[0]
                                                .username
                                            }
                                          });
                                        }}
                                      >
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
                                        <button
                                          type="submit"
                                          disabled={this.state.starsDisabled}
                                        >
                                          Submit Rating
                                        </button>
                                      </form>
                                    );
                                  }}
                                </Mutation>
                              </div>
                            );
                        })}
                        <h2>Reviews:</h2>
                        {this.state.reviews.map((rev) => {
                          return <ReviewCard key={rev.id} review={rev} />;
                        })}
                        <Mutation mutation={NEW_REVIEW}>
                          {(newReview, { loading, error, data }) => {
                            if (loading)
                              return (
                                <form>
                                  <h2>New Review</h2>
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
                                  <span>Submitting your review...</span>
                                </form>
                              );
                            if (error)
                              return (
                                <form>
                                  <h2>New Review</h2>
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
                                  <span>
                                    There was an error submitting your review.
                                  </span>
                                  <button onClick={window.location.reload()}>
                                    Go Back
                                  </button>
                                </form>
                              );
                            if (data)
                              console.log({
                                data: data
                              }); /* return this.setState({...this.state, newReview: false}) */
                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const date = await new Date(Date.now());
                                  await newReview({
                                    variables: {
                                      name: this.state.name,
                                      text: this.state.text,
                                      timestamp: date,
                                      user: project.User.username,
                                      username: this.state.visitor[0].username,
                                      id: project.id
                                    }
                                    // refetchQueries: [ { query: getReviews}]
                                  });
                                  await this.props.refetch();
                                  const { reviews } = await this.props;
                                  let revs = await reviews.filter(
                                    (rev) =>
                                      rev.ProjectReviewed.id === project.id
                                  );
                                  await this.setState({
                                    ...this.state,
                                    newReview: false,
                                    reviews: revs
                                  });
                                }}
                              >
                                <h2>New Review</h2>
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
                                <button type="submit">Submit</button>
                              </form>
                            );
                          }}
                        </Mutation>
                        <button
                          onClick={(e) => {
                            this.review();
                          }}
                        >
                          Add a review
                        </button>
                        <button onClick={handleClose}>Close</button>
                      </div>
                    )}
                  />
                </div>
              );
            }
          } else {
            // logged in, are reviews, not your project, not newReview

            if (this.state.visitor[0].RatedProjects) {
              // logged in, are reviews, not your project, not newReview, you've rated projs
              let rateCheck = this.state.visitor[0].RatedProjects.filter(
                (proj) => proj.id === project.id
              );
              if (rateCheck.length >= 1) {
                // logged in, are reviews, not your proj, not newRev, you've rated projs, rated this one, return

                return (
                  <div>
                    <h1>{`${project.name}`}</h1>
                    <div>{`${project.User.username}`}</div>
                    <div>{`${project.rating}`}</div>
                    <div>{`${project.timestamp}`}</div>
                    <img src={`${project.titleImg}`} alt="project" />
                    <div>{`${project.titleBlurb}`}</div>
                    <MicroModal
                      trigger={(handleOpen) => (
                        <button onClick={handleOpen}>View More</button>
                      )}
                      children={(handleClose) => (
                        <div>
                          <h1>{`${project.name}`}</h1>
                          <div>{`${project.User.username}`}</div>
                          <div>{`${project.rating}`}</div>
                          <div>{`${project.timestamp}`}</div>
                          <img src={`${project.titleImg}`} alt="project" />
                          <div>{`${project.titleBlurb}`}</div>
                          <h2>Steps:</h2>
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return <img key={step.body} src={step.body} />;
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}
                          <h2>Reviews:</h2>
                          {this.state.reviews.map((rev) => {
                            return <ReviewCard key={rev.id} review={rev} />;
                          })}
                          <button
                            onClick={(e) => {
                              this.review();
                            }}
                          >
                            Add a review
                          </button>
                          <button onClick={handleClose}>Close</button>
                        </div>
                      )}
                    />
                  </div>
                );
              } else {
                // logged in, are reviews, not your proj, not newRev, you've rated projs, didn't rate this one, return

                return (
                  <div>
                    <h1>{`${project.name}`}</h1>
                    <div>{`${project.User.username}`}</div>
                    <div>{`${project.rating}`}</div>
                    <div>{`${project.timestamp}`}</div>
                    <img src={`${project.titleImg}`} alt="project" />
                    <div>{`${project.titleBlurb}`}</div>
                    <MicroModal
                      trigger={(handleOpen) => (
                        <button onClick={handleOpen}>View More</button>
                      )}
                      children={(handleClose) => (
                        <div>
                          <h1>{`${project.name}`}</h1>
                          <div>{`${project.User.username}`}</div>
                          <div>{`${project.rating}`}</div>
                          <div>{`${project.timestamp}`}</div>
                          <img src={`${project.titleImg}`} alt="project" />
                          <div>{`${project.titleBlurb}`}</div>
                          <h2>Steps:</h2>
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return <img key={step.body} src={step.body} />;
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}
                          {this.state.visitor[0].RatedProjects.map((proj) => {
                            if (proj.id === project.id) return null;
                            else
                              return (
                                <div key={proj.id}>
                                  <Mutation mutation={RATE_PROJECT}>
                                    {(newRating, { loading, error, data }) => {
                                      if (loading)
                                        return (
                                          <span>Submitting your rating...</span>
                                        );
                                      if (error)
                                        return <span>{`Error: ${error}`}</span>;
                                      if (data) return <Redirect to={`/`} />;
                                      return (
                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            newRating({
                                              variables: {
                                                rating: this.state.stars,
                                                id: project.id,
                                                username: this.state.visitor[0]
                                                  .username
                                              }
                                            });
                                          }}
                                        >
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
                                          <button
                                            type="submit"
                                            disabled={this.state.starsDisabled}
                                          >
                                            Submit Rating
                                          </button>
                                        </form>
                                      );
                                    }}
                                  </Mutation>
                                </div>
                              );
                          })}
                          <h2>Reviews:</h2>
                          {this.state.reviews.map((rev) => {
                            return <ReviewCard key={rev.id} review={rev} />;
                          })}
                          <button
                            onClick={(e) => {
                              this.review();
                            }}
                          >
                            Add a review
                          </button>
                          <button onClick={handleClose}>Close</button>
                        </div>
                      )}
                    />
                  </div>
                );
              }
            } else {
              //logged in, are revs, not your proj, not newReview, you've never rated, return

              return (
                <div>
                  <h1>{`${project.name}`}</h1>
                  <div>{`${project.User.username}`}</div>
                  <div>{`${project.rating}`}</div>
                  <div>{`${project.timestamp}`}</div>
                  <img src={`${project.titleImg}`} alt="project" />
                  <div>{`${project.titleBlurb}`}</div>
                  <MicroModal
                    trigger={(handleOpen) => (
                      <button onClick={handleOpen}>View More</button>
                    )}
                    children={(handleClose) => (
                      <div>
                        <h1>{`${project.name}`}</h1>
                        <div>{`${project.User.username}`}</div>
                        <div>{`${project.rating}`}</div>
                        <div>{`${project.timestamp}`}</div>
                        <img src={`${project.titleImg}`} alt="project" />
                        <div>{`${project.titleBlurb}`}</div>
                        <h2>Steps:</h2>
                        {steps.map((step) => {
                          if (step.type === 'img') {
                            return <img key={step.body} src={step.body} />;
                          } else {
                            return <div key={step.body}>{`${step.body}`}</div>;
                          }
                        })}
                        {this.state.visitor[0].RatedProjects.map((proj) => {
                          if (proj.id === project.id) return null;
                          else
                            return (
                              <div key={proj.id}>
                                <Mutation mutation={RATE_PROJECT}>
                                  {(newRating, { loading, error, data }) => {
                                    if (loading)
                                      return (
                                        <span>Submitting your rating...</span>
                                      );
                                    if (error)
                                      return <span>{`Error: ${error}`}</span>;
                                    if (data) return <Redirect to={`/`} />;
                                    return (
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          newRating({
                                            variables: {
                                              rating: this.state.stars,
                                              id: project.id,
                                              username: this.state.visitor[0]
                                                .username
                                            }
                                          });
                                        }}
                                      >
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
                                        <button
                                          type="submit"
                                          disabled={this.state.starsDisabled}
                                        >
                                          Submit Rating
                                        </button>
                                      </form>
                                    );
                                  }}
                                </Mutation>
                              </div>
                            );
                        })}
                        <h2>Reviews:</h2>
                        {this.state.reviews.map((rev) => {
                          return <ReviewCard key={rev.id} review={rev} />;
                        })}
                        <button
                          onClick={(e) => {
                            this.review();
                          }}
                        >
                          Add a review
                        </button>
                        <button onClick={handleClose}>Close</button>
                      </div>
                    )}
                  />
                </div>
              );
            }
          }
        }
      } else {
        // logged in, no reviews

        if (project.User.email === this.state.authUser.email) {
          // logged in, no revs, your proj, return

          return (
            <div>
              <h1>{`${project.name}`}</h1>
              <div>{`${project.User.username}`}</div>
              <div>{`${project.rating}`}</div>
              <div>{`${project.timestamp}`}</div>
              <img src={`${project.titleImg}`} alt="project" />
              <div>{`${project.titleBlurb}`}</div>
              <MicroModal
                trigger={(handleOpen) => (
                  <button onClick={handleOpen}>View More</button>
                )}
                children={(handleClose) => (
                  <div>
                    <h1>{`${project.name}`}</h1>
                    <div>{`${project.User.username}`}</div>
                    <div>{`${project.rating}`}</div>
                    <div>{`${project.timestamp}`}</div>
                    <img src={`${project.titleImg}`} alt="project" />
                    <div>{`${project.titleBlurb}`}</div>
                    <h2>Steps:</h2>
                    {steps.map((step) => {
                      if (step.type === 'img') {
                        return <img key={step.body} src={step.body} />;
                      } else {
                        return <div key={step.body}>{`${step.body}`}</div>;
                      }
                    })}
                    <h2>Reviews:</h2>
                    <p>There are currently no reviews.</p>
                    <button
                      onClick={() => {
                        handleClose();
                        this.setState({ edit: true });
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={handleClose}>Close</button>
                  </div>
                )}
              />
            </div>
          );
        } else {
          // logged in, no revs, not your proj

          if (this.state.newReview) {
            // logged in, no revs, not your proj, newRev

            if (this.state.visitor[0].RatedProjects) {
              // logged in, no reviews, not your project, newReview, you've rated projs
              let rateCheck = this.state.visitor[0].RatedProjects.filter(
                (proj) => proj.id === project.id
              );
              console.log({ rateCheck: rateCheck });
              if (rateCheck.length >= 1) {
                // logged in, no reviews, not your proj, newRev, you've rated projs, rated this one, return

                return (
                  <div>
                    <h1>{`${project.name}`}</h1>
                    <div>{`${project.User.username}`}</div>
                    <div>{`${project.rating}`}</div>
                    <div>{`${project.timestamp}`}</div>
                    <img src={`${project.titleImg}`} alt="project" />
                    <div>{`${project.titleBlurb}`}</div>
                    <MicroModal
                      trigger={(handleOpen) => (
                        <button onClick={handleOpen}>View More</button>
                      )}
                      children={(handleClose) => (
                        <div>
                          <h1>{`${project.name}`}</h1>
                          <div>{`${project.User.username}`}</div>
                          <div>{`${project.rating}`}</div>
                          <div>{`${project.timestamp}`}</div>
                          <img src={`${project.titleImg}`} alt="project" />
                          <div>{`${project.titleBlurb}`}</div>
                          <h2>Steps:</h2>
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return <img key={step.body} src={step.body} />;
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}
                          <h2>Reviews:</h2>
                          <p>There are currently no reviews.</p>
                          <Mutation mutation={NEW_REVIEW}>
                            {(newReview, { loading, error, data }) => {
                              if (loading)
                                return (
                                  <form>
                                    <h2>New Review</h2>
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
                                    <span>Submitting your review...</span>
                                  </form>
                                );
                              if (error)
                                return (
                                  <form>
                                    <h2>New Review</h2>
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
                                    <span>
                                      There was an error submitting your review.
                                    </span>
                                    <button onClick={window.location.reload()}>
                                      Go Back
                                    </button>
                                  </form>
                                );
                              if (data)
                                console.log({
                                  data: data
                                }); /* return this.setState({...this.state, newReview: false}) */
                              return (
                                <form
                                  onSubmit={async (e) => {
                                    e.preventDefault();
                                    const date = await new Date(Date.now());
                                    await newReview({
                                      variables: {
                                        name: this.state.name,
                                        text: this.state.text,
                                        timestamp: date,
                                        user: project.User.username,
                                        username: this.state.visitor[0]
                                          .username,
                                        id: project.id
                                      }
                                      // refetchQueries: [ { query: getReviews}]
                                    });
                                    await this.props.refetch();
                                    const { reviews } = await this.props;
                                    let revs = await reviews.filter(
                                      (rev) =>
                                        rev.ProjectReviewed.id === project.id
                                    );
                                    await this.setState({
                                      ...this.state,
                                      newReview: false,
                                      reviews: revs
                                    });
                                  }}
                                >
                                  <h2>New Review</h2>
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
                                  <button type="submit">Submit</button>
                                </form>
                              );
                            }}
                          </Mutation>
                          <button
                            onClick={(e) => {
                              this.review();
                            }}
                          >
                            Add a review
                          </button>
                          <button onClick={handleClose}>Close</button>
                        </div>
                      )}
                    />
                  </div>
                );
              } else {
                // logged in, no reviews, not your proj, newRev, you've rated projs, didn't rate this one, return

                return (
                  <div>
                    <h1>{`${project.name}`}</h1>
                    <div>{`${project.User.username}`}</div>
                    <div>{`${project.rating}`}</div>
                    <div>{`${project.timestamp}`}</div>
                    <img src={`${project.titleImg}`} alt="project" />
                    <div>{`${project.titleBlurb}`}</div>
                    <MicroModal
                      trigger={(handleOpen) => (
                        <button onClick={handleOpen}>View More</button>
                      )}
                      children={(handleClose) => (
                        <div>
                          <h1>{`${project.name}`}</h1>
                          <div>{`${project.User.username}`}</div>
                          <div>{`${project.rating}`}</div>
                          <div>{`${project.timestamp}`}</div>
                          <img src={`${project.titleImg}`} alt="project" />
                          <div>{`${project.titleBlurb}`}</div>
                          <h2>Steps:</h2>
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return <img key={step.body} src={step.body} />;
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}
                          {this.state.visitor[0].RatedProjects.map((proj) => {
                            if (proj.id === project.id) return null;
                            else
                              return (
                                <div key={proj.id}>
                                  <Mutation mutation={RATE_PROJECT}>
                                    {(newRating, { loading, error, data }) => {
                                      if (loading)
                                        return (
                                          <span>Submitting your rating...</span>
                                        );
                                      if (error)
                                        return <span>{`Error: ${error}`}</span>;
                                      if (data) return <Redirect to={`/`} />;
                                      return (
                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            newRating({
                                              variables: {
                                                rating: this.state.stars,
                                                id: project.id,
                                                username: this.state.visitor[0]
                                                  .username
                                              }
                                            });
                                          }}
                                        >
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
                                          <button
                                            type="submit"
                                            disabled={this.state.starsDisabled}
                                          >
                                            Submit Rating
                                          </button>
                                        </form>
                                      );
                                    }}
                                  </Mutation>
                                </div>
                              );
                          })}
                          <h2>Reviews:</h2>
                          <p>There are currently no reviews.</p>
                          <Mutation mutation={NEW_REVIEW}>
                            {(newReview, { loading, error, data }) => {
                              if (loading)
                                return (
                                  <form>
                                    <h2>New Review</h2>
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
                                    <span>Submitting your review...</span>
                                  </form>
                                );
                              if (error)
                                return (
                                  <form>
                                    <h2>New Review</h2>
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
                                    <span>
                                      There was an error submitting your review.
                                    </span>
                                    <button onClick={window.location.reload()}>
                                      Go Back
                                    </button>
                                  </form>
                                );
                              if (data) console.log({ data: data });
                              return (
                                <form
                                  onSubmit={async (e) => {
                                    e.preventDefault();
                                    const date = await new Date(Date.now());
                                    await newReview({
                                      variables: {
                                        name: this.state.name,
                                        text: this.state.text,
                                        timestamp: date,
                                        user: project.User.username,
                                        username: this.state.visitor[0]
                                          .username,
                                        id: project.id
                                      },
                                      refetchQueries: [{ query: getReviews }]
                                    });
                                    await this.props.refetch();
                                    const { reviews } = await this.props;
                                    let revs = await reviews.filter(
                                      (rev) =>
                                        rev.ProjectReviewed.id === project.id
                                    );
                                    await this.setState({
                                      ...this.state,
                                      newReview: false,
                                      reviews: revs
                                    });
                                  }}
                                >
                                  <h2>New Review</h2>
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
                                  <button type="submit">Submit</button>
                                </form>
                              );
                            }}
                          </Mutation>
                          <button
                            onClick={(e) => {
                              this.review();
                            }}
                          >
                            Add a review
                          </button>
                          <button onClick={handleClose}>Close</button>
                        </div>
                      )}
                    />
                  </div>
                );
              }
            } else {
              //logged in, no revs, not your proj, newReview, you've never rated, return

              return (
                <div>
                  <h1>{`${project.name}`}</h1>
                  <div>{`${project.User.username}`}</div>
                  <div>{`${project.rating}`}</div>
                  <div>{`${project.timestamp}`}</div>
                  <img src={`${project.titleImg}`} alt="project" />
                  <div>{`${project.titleBlurb}`}</div>
                  <MicroModal
                    trigger={(handleOpen) => (
                      <button onClick={handleOpen}>View More</button>
                    )}
                    children={(handleClose) => (
                      <div>
                        <h1>{`${project.name}`}</h1>
                        <div>{`${project.User.username}`}</div>
                        <div>{`${project.rating}`}</div>
                        <div>{`${project.timestamp}`}</div>
                        <img src={`${project.titleImg}`} alt="project" />
                        <div>{`${project.titleBlurb}`}</div>
                        <h2>Steps:</h2>
                        {steps.map((step) => {
                          if (step.type === 'img') {
                            return <img key={step.body} src={step.body} />;
                          } else {
                            return <div key={step.body}>{`${step.body}`}</div>;
                          }
                        })}
                        {this.state.visitor[0].RatedProjects.map((proj) => {
                          if (proj.id === project.id) return null;
                          else
                            return (
                              <div key={proj.id}>
                                <Mutation mutation={RATE_PROJECT}>
                                  {(newRating, { loading, error, data }) => {
                                    if (loading)
                                      return (
                                        <span>Submitting your rating...</span>
                                      );
                                    if (error)
                                      return <span>{`Error: ${error}`}</span>;
                                    if (data) return <Redirect to={`/`} />;
                                    return (
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          newRating({
                                            variables: {
                                              rating: this.state.stars,
                                              id: project.id,
                                              username: this.state.visitor[0]
                                                .username
                                            }
                                          });
                                        }}
                                      >
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
                                        <button
                                          type="submit"
                                          disabled={this.state.starsDisabled}
                                        >
                                          Submit Rating
                                        </button>
                                      </form>
                                    );
                                  }}
                                </Mutation>
                              </div>
                            );
                        })}
                        <h2>Reviews:</h2>
                        <p>There are currently no reviews.</p>
                        <Mutation mutation={NEW_REVIEW}>
                          {(newReview, { loading, error, data }) => {
                            if (loading)
                              return (
                                <form>
                                  <h2>New Review</h2>
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
                                  <span>Submitting your review...</span>
                                </form>
                              );
                            if (error)
                              return (
                                <form>
                                  <h2>New Review</h2>
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
                                  <span>
                                    There was an error submitting your review.
                                  </span>
                                  <button onClick={window.location.reload()}>
                                    Go Back
                                  </button>
                                </form>
                              );
                            if (data) console.log({ data: data });
                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const date = await new Date(Date.now());
                                  await newReview({
                                    variables: {
                                      name: this.state.name,
                                      text: this.state.text,
                                      timestamp: date,
                                      user: project.User.username,
                                      username: this.state.visitor[0].username,
                                      id: project.id
                                    }
                                    // refetchQueries: [ { query: getReviews}]
                                  });
                                  await this.props.refetch();
                                  const { reviews } = await this.props;
                                  let revs = await reviews.filter(
                                    (rev) =>
                                      rev.ProjectReviewed.id === project.id
                                  );
                                  await this.setState({
                                    ...this.state,
                                    newReview: false,
                                    reviews: revs
                                  });
                                }}
                              >
                                <h2>New Review</h2>
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
                                <button type="submit">Submit</button>
                              </form>
                            );
                          }}
                        </Mutation>
                        <button
                          onClick={(e) => {
                            this.review();
                          }}
                        >
                          Add a review
                        </button>
                        <button onClick={handleClose}>Close</button>
                      </div>
                    )}
                  />
                </div>
              );
            }
          } else {
            // logged in, no revs, not your proj, not newRev

            if (this.state.visitor[0].RatedProjects) {
              // logged in, no reviews, not your project, not newReview, you've rated projs
              let rateCheck = this.state.visitor[0].RatedProjects.filter(
                (proj) => proj.id === project.id
              );
              console.log({ rateCheck: rateCheck });
              if (rateCheck.length >= 1) {
                // logged in, no reviews, not your proj, not newRev, you've rated projs, rated this one, return

                return (
                  <div>
                    <h1>{`${project.name}`}</h1>
                    <div>{`${project.User.username}`}</div>
                    <div>{`${project.rating}`}</div>
                    <div>{`${project.timestamp}`}</div>
                    <img src={`${project.titleImg}`} alt="project" />
                    <div>{`${project.titleBlurb}`}</div>
                    <MicroModal
                      trigger={(handleOpen) => (
                        <button onClick={handleOpen}>View More</button>
                      )}
                      children={(handleClose) => (
                        <div>
                          <h1>{`${project.name}`}</h1>
                          <div>{`${project.User.username}`}</div>
                          <div>{`${project.rating}`}</div>
                          <div>{`${project.timestamp}`}</div>
                          <img src={`${project.titleImg}`} alt="project" />
                          <div>{`${project.titleBlurb}`}</div>
                          <h2>Steps:</h2>
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return <img key={step.body} src={step.body} />;
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}

                          <h2>Reviews:</h2>
                          <p>There are currently no reviews.</p>

                          <button
                            onClick={(e) => {
                              this.review();
                            }}
                          >
                            Add a review
                          </button>
                          <button onClick={handleClose}>Close</button>
                        </div>
                      )}
                    />
                  </div>
                );
              } else {
                // logged in, no reviews, not your proj, not newRev, you've rated projs, didn't rate this one, return

                return (
                  <div>
                    <h1>{`${project.name}`}</h1>
                    <div>{`${project.User.username}`}</div>
                    <div>{`${project.rating}`}</div>
                    <div>{`${project.timestamp}`}</div>
                    <img src={`${project.titleImg}`} alt="project" />
                    <div>{`${project.titleBlurb}`}</div>
                    <MicroModal
                      trigger={(handleOpen) => (
                        <button onClick={handleOpen}>View More</button>
                      )}
                      children={(handleClose) => (
                        <div>
                          <h1>{`${project.name}`}</h1>
                          <div>{`${project.User.username}`}</div>
                          <div>{`${project.rating}`}</div>
                          <div>{`${project.timestamp}`}</div>
                          <img src={`${project.titleImg}`} alt="project" />
                          <div>{`${project.titleBlurb}`}</div>
                          <h2>Steps:</h2>
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return <img key={step.body} src={step.body} />;
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}
                          {this.state.visitor[0].RatedProjects.map((proj) => {
                            if (proj.id === project.id) return null;
                            else
                              return (
                                <div key={proj.id}>
                                  <Mutation mutation={RATE_PROJECT}>
                                    {(newRating, { loading, error, data }) => {
                                      if (loading)
                                        return (
                                          <span>Submitting your rating...</span>
                                        );
                                      if (error)
                                        return <span>{`Error: ${error}`}</span>;
                                      if (data) return <Redirect to={`/`} />;
                                      return (
                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            newRating({
                                              variables: {
                                                rating: this.state.stars,
                                                id: project.id,
                                                username: this.state.visitor[0]
                                                  .username
                                              }
                                            });
                                          }}
                                        >
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
                                          <button
                                            type="submit"
                                            disabled={this.state.starsDisabled}
                                          >
                                            Submit Rating
                                          </button>
                                        </form>
                                      );
                                    }}
                                  </Mutation>
                                </div>
                              );
                          })}
                          <h2>Reviews:</h2>
                          <p>There are currently no reviews</p>

                          <button
                            onClick={(e) => {
                              this.review();
                            }}
                          >
                            Add a review
                          </button>
                          <button onClick={handleClose}>Close</button>
                        </div>
                      )}
                    />
                  </div>
                );
              }
            } else {
              //logged in, no revs, not your proj, not newReview, you've never rated, return

              return (
                <div>
                  <h1>{`${project.name}`}</h1>
                  <div>{`${project.User.username}`}</div>
                  <div>{`${project.rating}`}</div>
                  <div>{`${project.timestamp}`}</div>
                  <img src={`${project.titleImg}`} alt="project" />
                  <div>{`${project.titleBlurb}`}</div>
                  <MicroModal
                    trigger={(handleOpen) => (
                      <button onClick={handleOpen}>View More</button>
                    )}
                    children={(handleClose) => (
                      <div>
                        <h1>{`${project.name}`}</h1>
                        <div>{`${project.User.username}`}</div>
                        <div>{`${project.rating}`}</div>
                        <div>{`${project.timestamp}`}</div>
                        <img src={`${project.titleImg}`} alt="project" />
                        <div>{`${project.titleBlurb}`}</div>
                        <h2>Steps:</h2>
                        {steps.map((step) => {
                          if (step.type === 'img') {
                            return <img key={step.body} src={step.body} />;
                          } else {
                            return <div key={step.body}>{`${step.body}`}</div>;
                          }
                        })}
                        {this.state.visitor[0].RatedProjects.map((proj) => {
                          if (proj.id === project.id) return null;
                          else
                            return (
                              <div key={proj.id}>
                                <Mutation mutation={RATE_PROJECT}>
                                  {(newRating, { loading, error, data }) => {
                                    if (loading)
                                      return (
                                        <span>Submitting your rating...</span>
                                      );
                                    if (error)
                                      return <span>{`Error: ${error}`}</span>;
                                    if (data) return <Redirect to={`/`} />;
                                    return (
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          newRating({
                                            variables: {
                                              rating: this.state.stars,
                                              id: project.id,
                                              username: this.state.visitor[0]
                                                .username
                                            }
                                          });
                                        }}
                                      >
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
                                        <button
                                          type="submit"
                                          disabled={this.state.starsDisabled}
                                        >
                                          Submit Rating
                                        </button>
                                      </form>
                                    );
                                  }}
                                </Mutation>
                              </div>
                            );
                        })}
                        <h2>Reviews:</h2>
                        <p>There are currently no reviews.</p>

                        <button
                          onClick={(e) => {
                            this.review();
                          }}
                        >
                          Add a review
                        </button>
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
    } else {
      // not logged in
      if (this.state.reviews[0]) {
        // not logged in, are reviews, return
        return (
          <div>
            <h1>{`${project.name}`}</h1>
            <div>{`${project.User.username}`}</div>
            <div>{`${project.rating}`}</div>
            <div>{`${project.timestamp}`}</div>
            <img src={`${project.titleImg}`} alt="project" />
            <div>{`${project.titleBlurb}`}</div>
            <MicroModal
              trigger={(handleOpen) => (
                <button onClick={handleOpen}>View More</button>
              )}
              children={(handleClose) => (
                <div>
                  <h1>{`${project.name}`}</h1>
                  <div>{`${project.User.username}`}</div>
                  <div>{`${project.rating}`}</div>
                  <div>{`${project.timestamp}`}</div>
                  <img src={`${project.titleImg}`} alt="project" />
                  <div>{`${project.titleBlurb}`}</div>
                  <h2>Steps:</h2>
                  {steps.map((step) => {
                    if (step.type === 'img') {
                      return <img key={step.body} src={step.body} />;
                    } else {
                      return <div key={step.body}>{`${step.body}`}</div>;
                    }
                  })}
                  <h2>Reviews:</h2>
                  {this.state.reviews.map((rev) => {
                    return <ReviewCard key={rev.id} review={rev} />;
                  })}
                  <button
                    onClick={(e) => {
                      this.review();
                    }}
                  >
                    Add a review
                  </button>
                  <button onClick={handleClose}>Close</button>
                </div>
              )}
            />
          </div>
        );
      } else {
        // not logged in, no reviews, return

        return (
          <div>
            <h1>{`${project.name}`}</h1>
            <div>{`${project.User.username}`}</div>
            <div>{`${project.rating}`}</div>
            <div>{`${project.timestamp}`}</div>
            <img src={`${project.titleImg}`} alt="project" />
            <div>{`${project.titleBlurb}`}</div>
            <MicroModal
              trigger={(handleOpen) => (
                <button onClick={handleOpen}>View More</button>
              )}
              children={(handleClose) => (
                <div>
                  <h1>{`${project.name}`}</h1>
                  <div>{`${project.User.username}`}</div>
                  <div>{`${project.rating}`}</div>
                  <div>{`${project.timestamp}`}</div>
                  <img src={`${project.titleImg}`} alt="project" />
                  <div>{`${project.titleBlurb}`}</div>
                  <h2>Steps:</h2>
                  {steps.map((step) => {
                    if (step.type === 'img') {
                      return <img key={step.body} src={step.body} />;
                    } else {
                      return <div key={step.body}>{`${step.body}`}</div>;
                    }
                  })}
                  <h2>Reviews:</h2>
                  <p>There are currently no reviews.</p>
                  <button
                    onClick={(e) => {
                      this.review();
                    }}
                  >
                    Add a review
                  </button>
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

export default ProjectCard;
