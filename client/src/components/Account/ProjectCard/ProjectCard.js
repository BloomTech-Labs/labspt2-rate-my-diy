import React from 'react';
import MicroModal from 'react-micro-modal';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { RATE_PROJECT } from '../../../query/query';

class ProjectCard extends React.Component {
  constructor(props) {
    super(props);
    const { users } = this.props;

    const json = localStorage.getItem('authUser');
    const user = JSON.parse(json);

    const visitor = users.filter((u) => u.email === user.email);
    this.state = {
      edit: false,
      stars: 0,
      starsDisabled: true,
      authUser: user,
      visitor: visitor
    };
  }

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

  render() {
    const { project } = this.props;

    let steps = JSON.parse(project.steps);

    console.log({ visitor: this.state.visitor });

    if (this.state.edit) {
      return <Redirect to={`/projects/${project.id}/edit`} />;
    }

    if (project.User.email === this.state.authUser.email) {
      console.log('this is your project');
      return (
        <>
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
        </>
      );
    } else {
      console.log('this is not your project');
      if (this.state.visitor[0].RatedProjects) {
        console.log("you've rated projects");
        let rateCheck = this.state.visitor[0].RatedProjects.filter(
          (proj) => proj.id === project.id
        );
        console.log({ rateCheck: rateCheck });
        if (rateCheck.length >= 1) {
          console.log("you've rated this project");
          return (
            <>
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

                      {/* {this.state.visitor.RatedProjects.map((proj) => {
                      if (proj.id === project.id) return null;
                      else
                        return (
                          <Mutation mutation={RATE_PROJECT}>
                            {(newRating, { loading, error, data }) => {
                              if (loading)
                                return <span>Submitting your rating...</span>;
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
                                        username: this.state.visitor[0].username
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
                        );
                    })} */}

                      <button onClick={handleClose}>Close</button>
                    </div>
                  )}
                />
              </div>
            </>
          );
        } else {
          console.log("you haven't rated this project");
          return (
            <>
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
                            <Mutation mutation={RATE_PROJECT}>
                              {(newRating, { loading, error, data }) => {
                                if (loading)
                                  return <span>Submitting your rating...</span>;
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
                          );
                      })}

                      <button onClick={handleClose}>Close</button>
                    </div>
                  )}
                />
              </div>
            </>
          );
        }
      } else {
        console.log("you don't yet have rated projects");
        return (
          <>
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
                    <Mutation mutation={RATE_PROJECT}>
                      {(newRating, { loading, error, data }) => {
                        if (loading)
                          return <span>Submitting your rating...</span>;
                        if (error) return <span>{`Error: ${error}`}</span>;
                        if (data)
                          return <Redirect to={`/projects/${project.id}`} />;
                        return (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              newRating({
                                variables: {
                                  rating: this.state.stars,
                                  id: project.id,
                                  username: this.state.visitor[0].username
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
                    <button onClick={handleClose}>Close</button>
                  </div>
                )}
              />
            </div>
          </>
        );
      }
    }
  }
}

export default ProjectCard;
