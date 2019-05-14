import React from 'react';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { NEW_REVIEW, getReviews } from '../../query/query';
import ReviewCard from '../ReviewCard/ReviewCard';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import './ProjectCard.scss';

class ProjectCard extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.users[0]) {
      const { users, reviews, project, loggedIn } = this.props;

      let revs = reviews.filter((rev) => rev.ProjectReviewed.id === project.id);

      let visitor = [{ username: '' }];
      let authUser = { email: '' };
      if (this.props.authUser != undefined) authUser = this.props.authUser;
      if (this.props.authUser != undefined)
        visitor = users.filter((u) => u.email === authUser.email);

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
        showMore: false,
        username: visitor[0].username
      };
    } else {
      const { loggedIn } = this.props;
      let authUser = { email: '' };
      if (this.props.authUser != undefined) authUser = this.props.authUser;
      this.state = {
        edit: false,
        stars: 0,
        starsDisabled: true,
        authUser: authUser,
        visitor: [],
        loggedIn: loggedIn,
        newReview: false,
        name: '',
        text: '',
        reviews: [],
        showMore: false,
        username: ''
      };
    }
  }


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
    if (this.props.users[0]) {
      const { project } = this.props;

      let steps = JSON.parse(project.steps);

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
                        return (
                          <img key={step.body} src={step.body} alt="step" />
                        );
                      } else {
                        return <div key={step.body}>{`${step.body}`}</div>;
                      }
                    })}
                    <h2>Reviews:</h2>
                    {this.state.reviews.map((rev) => {
                      return (
                        <ReviewCard
                          key={rev.id}
                          review={rev}
                          users={this.props.users}
                          loggedIn={this.props.loggedIn}
                          authUser={this.props.authUser}
                          refetch={this.props.userRefetch}
                        />
                      );
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
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              );
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}
                          <h2>Reviews:</h2>
                          {this.state.reviews.map((rev) => {
                            return (
                              <ReviewCard
                                key={rev.id}
                                review={rev}
                                users={this.props.users}
                                loggedIn={this.props.loggedIn}
                                authUser={this.props.authUser}
                                refetch={this.props.userRefetch}
                              />
                            );
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
                                          username: this.state.username,
                                          id: project.id,
                                          projRating: this.state.stars
                                        }
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
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              );
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}

                          <h2>Reviews:</h2>
                          {this.state.reviews.map((rev) => {
                            return (
                              <ReviewCard
                                key={rev.id}
                                review={rev}
                                users={this.props.users}
                                loggedIn={this.props.loggedIn}
                                authUser={this.props.authUser}
                                refetch={this.props.userRefetch}
                              />
                            );
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
                                        username: this.state.username,
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
                            return (
                              <img key={step.body} src={step.body} alt="step" />
                            );
                          } else {
                            return <div key={step.body}>{`${step.body}`}</div>;
                          }
                        })}

                        <h2>Reviews:</h2>
                        {this.state.reviews.map((rev) => {
                          return (
                            <ReviewCard
                              key={rev.id}
                              review={rev}
                              users={this.props.users}
                              loggedIn={this.props.loggedIn}
                              authUser={this.props.authUser}
                              refetch={this.props.userRefetch}
                            />
                          );
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
                                      username: this.state.username,
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
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              );
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}
                          <h2>Reviews:</h2>
                          {this.state.reviews.map((rev) => {
                            return (
                              <ReviewCard
                                key={rev.id}
                                review={rev}
                                users={this.props.users}
                                loggedIn={this.props.loggedIn}
                                authUser={this.props.authUser}
                                refetch={this.props.userRefetch}
                              />
                            );
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
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              );
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
                            }
                          })}

                          <h2>Reviews:</h2>
                          {this.state.reviews.map((rev) => {
                            return (
                              <ReviewCard
                                key={rev.id}
                                review={rev}
                                users={this.props.users}
                                loggedIn={this.props.loggedIn}
                                authUser={this.props.authUser}
                                refetch={this.props.userRefetch}
                              />
                            );
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
                            return (
                              <img key={step.body} src={step.body} alt="step" />
                            );
                          } else {
                            return <div key={step.body}>{`${step.body}`}</div>;
                          }
                        })}

                        <h2>Reviews:</h2>
                        {this.state.reviews.map((rev) => {
                          return (
                            <ReviewCard
                              key={rev.id}
                              review={rev}
                              users={this.props.users}
                              loggedIn={this.props.loggedIn}
                              authUser={this.props.authUser}
                              refetch={this.props.userRefetch}
                            />
                          );
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
                        return (
                          <img key={step.body} src={step.body} alt="step" />
                        );
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
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              );
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
                                          username: this.state.username,
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
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              );
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
                                        username: this.state.username,
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
                            return (
                              <img key={step.body} src={step.body} alt="step" />
                            );
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
                                      username: this.state.username,
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
              // logged in, no revs, not your proj, not newRev

              if (this.state.visitor[0].RatedProjects[0]) {
                // logged in, no reviews, not your project, not newReview, you've rated projs
                let rateCheck = this.state.visitor[0].RatedProjects.filter(
                  (proj) => proj.id === project.id
                );

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
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              );
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
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              );
                            } else {
                              return (
                                <div key={step.body}>{`${step.body}`}</div>
                              );
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

                return (
                  <div>
                    <div>
                      <h3>{`${project.name}`}</h3>
                      <hr className="line-break" />
                      <div>{`${project.User.username}`}</div>
                      <div>{`${project.rating}`}</div>
                      <div>{`${project.timestamp}`}</div>
                      <img src={`${project.titleImg}`} alt="project" />
                      <div>{`${project.titleBlurb}`}</div>
                      <button onClick={this.showMore}>View More</button>
                    </div>
                    {this.state.showMore ? (
                      <div>
                        <h2>Steps:</h2>
                        {steps.map((step) => {
                          if (step.type === 'img') {
                            return (
                              <img key={step.body} src={step.body} alt="step" />
                            );
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
                      return <img key={step.body} src={step.body} alt="step" />;
                    } else {
                      return <div key={step.body}>{`${step.body}`}</div>;
                    }
                  })}
                  <h2>Reviews:</h2>
                  {this.state.reviews.map((rev) => {
                    return (
                      <ReviewCard
                        key={rev.id}
                        review={rev}
                        users={this.props.users}
                        loggedIn={this.props.loggedIn}
                        authUser={this.props.authUser}
                        refetch={this.props.userRefetch}
                      />
                    );
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
                      return <img key={step.body} src={step.body} alt="step" />;
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
    } else {
      return (
        <div>
          <SkeletonTheme highlightColor="#6fb3b8">
            <h1>
              <Skeleton />
            </h1>
            <div>
              <Skeleton />
            </div>
            <div>
              <Skeleton />
            </div>
            <div>
              <Skeleton />
            </div>
            <Skeleton />
            <div>
              <Skeleton />
            </div>
            <button>
              <Skeleton />
            </button>

            <button>
              <Skeleton />
            </button>
            <button>
              <Skeleton />
            </button>
          </SkeletonTheme>
        </div>
      );
    }
  }
}

export default ProjectCard;
