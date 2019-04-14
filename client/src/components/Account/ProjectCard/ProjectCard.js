import React from 'react';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { NEW_REVIEW, getReviews } from '../../../query/query';
import ReviewCard from '../ReviewCard/ReviewCard';

class ProjectCard extends React.Component {
  constructor(props) {
    super(props);
    const { users, reviews, project, user } = this.props;

    const json = localStorage.getItem('authUser');

    let revs = reviews.filter((rev) => rev.ProjectReviewed.id === project.id);

    const authUser = JSON.parse(json);
    let visitor = [];
    let loggedIn = false;
    if (user !== null)
      visitor = users.filter((u) => u.email === authUser.email);
    // if (!visitor[0]) visitor = user
    console.log({
      users: users,
      reviews: reviews,
      project: project,
      visitor: visitor,
      user: user
    });

    this.state = {
      edit: false,
      stars: 0,
      starsDisabled: true,
      authUser: authUser,
      visitor: visitor,
      loggedIn: loggedIn,
      newReview: false,
      name: '',
      text: '',
      reviews: revs,
      showMore: false
    };
  }

  componentDidMount = () => {
    console.log({ visitor: this.state.visitor });
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

  showMore = async () => {
    try {
      await this.setState({ ...this.state, showMore: true });
    } catch (err) {
      console.log({ showError: err });
    }
  };

  collapse = async () => {
    try {
      await this.setState({ ...this.state, showMore: false });
    } catch (err) {
      console.log({ showError: err });
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

              <button onClick={this.showMore}>View More</button>
              {this.state.showMore ? (
                <div>
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
                      this.setState({ edit: true });
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={this.collapse}>Collapse</button>
                </div>
              ) : null}
            </div>
          );
        } else {
          // logged in, are reviews, not your project

          if (this.state.newReview === true) {
            // logged in, are reviews, not your project, newReview

            if (this.state.visitor[0].RatedProjects[0]) {
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
                    <button onClick={this.showMore}>View More</button>
                    {this.state.showMore ? (
                      <div>
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
                        <Mutation mutation={NEW_REVIEW}>
                          {(newReview, { loading, error, data }) => {
                            if (loading)
                              return (
                                <form>
                                  <h2>New Review</h2>
                                  <h3>Rating:</h3>
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
                                  <span>Submitting your review...</span>
                                </form>
                              );
                            if (error) {
                              console.log({ revError: error });
                              return (
                                <form>
                                  <h2>New Review</h2>
                                  <h3>Rating:</h3>
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
                                  <span>
                                    There was an error submitting your review.
                                  </span>
                                  <button
                                    onClick={() => window.location.reload()}
                                  >
                                    Go Back
                                  </button>
                                </form>
                              );
                            }
                            if (data)
                              console.log({
                                data: data
                              }); /* return this.setState({...this.state, newReview: false}) */
                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const date = await new Date(Date.now());
                                  const { username } = await this.state
                                    .visitor[0];
                                  await newReview({
                                    variables: {
                                      name: this.state.name,
                                      text: this.state.text,
                                      timestamp: date,
                                      user: project.User.username,
                                      username: username,
                                      id: project.id,
                                      projRating: this.state.stars
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
                                <h3>Rating</h3>
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
                                <button type="submit">Submit</button>
                              </form>
                            );
                          }}
                        </Mutation>
                        <button onClick={this.collapse}>Collapse</button>
                      </div>
                    ) : null}
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
                    <button onClick={this.showMore}>View More</button>
                    {this.state.showMore ? (
                      <div>
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
                        <Mutation mutation={NEW_REVIEW}>
                          {(newReview, { loading, error, data }) => {
                            if (loading)
                              return (
                                <form>
                                  <h2>New Review</h2>
                                  <h3>Rating:</h3>
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
                                  <span>Submitting your review...</span>
                                </form>
                              );
                            if (error) {
                              console.log({ revError: error });
                              return (
                                <form>
                                  <h2>New Review</h2>
                                  <h3>Rating:</h3>
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
                                  <span>
                                    There was an error submitting your review.
                                  </span>
                                  <button
                                    onClick={() => window.location.reload()}
                                  >
                                    Go Back
                                  </button>
                                </form>
                              );
                            }
                            if (data) console.log({ data: data });
                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const date = await new Date(Date.now());
                                  console.log({
                                    username: this.state.visitor[0].username
                                  });
                                  const username = await this.state.visitor[0]
                                    .username;
                                  await newReview({
                                    variables: {
                                      name: this.state.name,
                                      text: this.state.text,
                                      timestamp: date,
                                      user: project.User.username,
                                      username: username,
                                      id: project.id,
                                      projRating: this.state.stars
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
                                <h3>Rating:</h3>
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
                        <button onClick={this.collapse}>Collapse</button>
                      </div>
                    ) : null}
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
                  <button onClick={this.showMore}>View More</button>
                  {this.state.showMore ? (
                    <div>
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
                      <Mutation mutation={NEW_REVIEW}>
                        {(newReview, { loading, error, data }) => {
                          if (loading)
                            return (
                              <form>
                                <h2>New Review</h2>
                                <h3>Rating:</h3>
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
                                <span>Submitting your review...</span>
                              </form>
                            );
                          if (error) {
                            console.log({ revError: error });
                            return (
                              <form>
                                <h2>New Review</h2>
                                <h3>Rating:</h3>
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
                                <span>
                                  There was an error submitting your review.
                                </span>
                                <button
                                  onClick={() => window.location.reload()}
                                >
                                  Go Back
                                </button>
                              </form>
                            );
                          }
                          if (data)
                            console.log({
                              data: data
                            }); /* return this.setState({...this.state, newReview: false}) */
                          return (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const date = await new Date(Date.now());
                                console.log({
                                  username: this.state.visitor[0].username
                                });
                                const username = await this.state.visitor[0]
                                  .username;
                                await newReview({
                                  variables: {
                                    name: this.state.name,
                                    text: this.state.text,
                                    timestamp: date,
                                    user: project.User.username,
                                    username: username,
                                    id: project.id,
                                    projRating: this.state.stars
                                  }
                                  // refetchQueries: [ { query: getReviews}]
                                });
                                await this.props.refetch();
                                const { reviews } = await this.props;
                                let revs = await reviews.filter(
                                  (rev) => rev.ProjectReviewed.id === project.id
                                );
                                await this.setState({
                                  ...this.state,
                                  newReview: false,
                                  reviews: revs
                                });
                              }}
                            >
                              <h2>New Review</h2>
                              <h3>Rating:</h3>
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
                      <button onClick={this.collapse}>Collapse</button>
                    </div>
                  ) : null}
                </div>
              );
            }
          } else {
            // logged in, are reviews, not your project, not newReview

            if (this.state.visitor[0].RatedProjects[0]) {
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
                    <button onClick={this.showMore}>View More</button>
                    {this.state.showMore ? (
                      <div>
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
                        <button onClick={this.collapse}>Collapse</button>
                      </div>
                    ) : null}
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
                    <button onClick={this.showMore}>View More</button>
                    {this.state.showMore ? (
                      <div>
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
                        <button onClick={this.collapse}>Collapse</button>
                      </div>
                    ) : null}
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
                  <button onClick={this.showMore}>View More</button>
                  {this.state.showMore ? (
                    <div>
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
                      <button onClick={this.collapse}>Collapse</button>
                    </div>
                  ) : null}
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

              <button onClick={this.showMore}>View More</button>
              {this.state.showMore ? (
                <div>
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
                      this.setState({ edit: true });
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={this.collapse}>Collapse</button>
                </div>
              ) : null}
            </div>
          );
        } else {
          // logged in, no revs, not your proj

          if (this.state.newReview) {
            // logged in, no revs, not your proj, newRev

            if (this.state.visitor[0].RatedProjects[0]) {
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
                    <button onClick={this.showMore}>View More</button>
                    {this.state.showMore ? (
                      <div>
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
                        <Mutation mutation={NEW_REVIEW}>
                          {(newReview, { loading, error, data }) => {
                            if (loading)
                              return (
                                <form>
                                  <h2>New Review</h2>
                                  <h3>Rating</h3>
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
                                  <span>Submitting your review...</span>
                                </form>
                              );
                            if (error) {
                              console.log({ revError: error });
                              return (
                                <form>
                                  <h2>New Review</h2>
                                  <h3>Rating:</h3>
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
                                  <span>
                                    There was an error submitting your review.
                                  </span>
                                  <button
                                    onClick={() => window.location.reload()}
                                  >
                                    Go Back
                                  </button>
                                </form>
                              );
                            }
                            if (data)
                              console.log({
                                data: data
                              }); /* return this.setState({...this.state, newReview: false}) */
                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const date = await new Date(Date.now());
                                  console.log({
                                    username: this.state.visitor[0].username
                                  });
                                  const username = await this.state.visitor[0]
                                    .username;
                                  await newReview({
                                    variables: {
                                      name: this.state.name,
                                      text: this.state.text,
                                      timestamp: date,
                                      user: project.User.username,
                                      username: username,
                                      id: project.id,
                                      projRating: this.state.stars
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
                                <h3>Rating:</h3>
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
                        <button onClick={this.collapse}>Collapse</button>
                      </div>
                    ) : null}
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
                    <button onClick={this.showMore}>View More</button>
                    {this.state.showMore ? (
                      <div>
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
                        <Mutation mutation={NEW_REVIEW}>
                          {(newReview, { loading, error, data }) => {
                            if (loading)
                              return (
                                <form>
                                  <h2>New Review</h2>
                                  <h3>Rating:</h3>
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
                                  <span>Submitting your review...</span>
                                </form>
                              );
                            if (error) {
                              console.log({ revError: error });
                              return (
                                <form>
                                  <h2>New Review</h2>
                                  <h3>Rating:</h3>
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
                                  <span>
                                    There was an error submitting your review.
                                  </span>
                                  <button
                                    onClick={() => window.location.reload()}
                                  >
                                    Go Back
                                  </button>
                                </form>
                              );
                            }
                            if (data) console.log({ data: data });
                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const date = await new Date(Date.now());
                                  console.log({
                                    username: this.state.visitor[0].username
                                  });
                                  const username = await this.state.visitor[0]
                                    .username;
                                  await newReview({
                                    variables: {
                                      name: this.state.name,
                                      text: this.state.text,
                                      timestamp: date,
                                      user: project.User.username,
                                      username: username,
                                      id: project.id,
                                      projRating: this.state.stars
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
                                <h3>Rating:</h3>
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
                        <button onClick={this.collapse}>Collapse</button>
                      </div>
                    ) : null}
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
                  <button onClick={this.showMore}>View More</button>
                  {this.state.showMore ? (
                    <div>
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
                      <Mutation mutation={NEW_REVIEW}>
                        {(newReview, { loading, error, data }) => {
                          if (loading)
                            return (
                              <form>
                                <h2>New Review</h2>
                                <h3>Rating:</h3>
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
                                <span>Submitting your review...</span>
                              </form>
                            );
                          if (error) {
                            console.log({ revError: error });
                            return (
                              <form>
                                <h2>New Review</h2>
                                <h3>Rating:</h3>
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
                                <span>
                                  There was an error submitting your review.
                                </span>
                                <button
                                  onClick={() => window.location.reload()}
                                >
                                  Go Back
                                </button>
                              </form>
                            );
                          }
                          if (data) console.log({ data: data });
                          return (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const date = await new Date(Date.now());
                                console.log({
                                  username: this.state.visitor[0].username
                                });
                                const username = await this.state.visitor[0]
                                  .username;
                                await newReview({
                                  variables: {
                                    name: this.state.name,
                                    text: this.state.text,
                                    timestamp: date,
                                    user: project.User.username,
                                    username: username,
                                    id: project.id,
                                    projRating: this.state.stars
                                  }
                                  // refetchQueries: [ { query: getReviews}]
                                });
                                await this.props.refetch();
                                const { reviews } = await this.props;
                                let revs = await reviews.filter(
                                  (rev) => rev.ProjectReviewed.id === project.id
                                );
                                await this.setState({
                                  ...this.state,
                                  newReview: false,
                                  reviews: revs
                                });
                              }}
                            >
                              <h2>New Review</h2>
                              <h3>Rating:</h3>
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
                      <button onClick={this.collapse}>Collapse</button>
                    </div>
                  ) : null}
                </div>
              );
            }
          } else {
            // logged in, no revs, not your proj, not newRev

            if (this.state.visitor[0].RatedProjects[0]) {
              // logged in, no reviews, not your project, not newReview, you've rated projs
              let rateCheck = this.state.visitor[0].RatedProjects.filter(
                (proj) => proj.id === project.id
              );
              // console.log({ rateCheck: rateCheck });
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
                    <button onClick={this.showMore}>View More</button>
                    {this.state.showMore ? (
                      <div>
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
                        <button onClick={this.collapse}>Collapse</button>
                      </div>
                    ) : null}
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
                    <button onClick={this.showMore}>View More</button>
                    {this.state.showMore ? (
                      <div>
                        <h2>Steps:</h2>
                        {steps.map((step) => {
                          if (step.type === 'img') {
                            return <img key={step.body} src={step.body} />;
                          } else {
                            return <div key={step.body}>{`${step.body}`}</div>;
                          }
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
                        <button onClick={this.collapse}>Collapse</button>
                      </div>
                    ) : null}
                  </div>
                );
              }
            } else {
              //logged in, no revs, not your proj, not newReview, you've never rated, return
              console.log(
                "logged in, no revs, not your proj, not newReview, you've never rated, return"
              );
              return (
                <div>
                  <h1>{`${project.name}`}</h1>
                  <div>{`${project.User.username}`}</div>
                  <div>{`${project.rating}`}</div>
                  <div>{`${project.timestamp}`}</div>
                  <img src={`${project.titleImg}`} alt="project" />
                  <div>{`${project.titleBlurb}`}</div>
                  <button onClick={this.showMore}>View More</button>
                  {this.state.showMore ? (
                    <div>
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
                      <button onClick={this.collapse}>Collapse</button>
                    </div>
                  ) : null}
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
            <button onClick={this.showMore}>View More</button>
            {this.state.showMore ? (
              <div>
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
                <button onClick={this.collapse}>Collapse</button>
              </div>
            ) : null}
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
            <button onClick={this.showMore}>View More</button>
            {this.state.showMore ? (
              <div>
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
                <button onClick={this.collapse}>Collapse</button>
              </div>
            ) : null}
          </div>
        );
      }
    }
  }
}

export default ProjectCard;
