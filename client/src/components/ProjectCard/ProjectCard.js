import React from 'react'
import { Redirect } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import moment from 'moment'
import { NEW_REVIEW, getReviews } from '../../query/query'
import ReviewCard from '../ReviewCard/ReviewCard'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import './ProjectCard.scss'

class ProjectCard extends React.Component {
  constructor(props) {
    super(props)
    if (this.props.users[0]) {
      const { users, reviews, project, loggedIn } = this.props

      let revs = reviews.filter((rev) => rev.ProjectReviewed.id === project.id)

      let visitor = [{ username: '' }]
      let authUser = { email: '' }
      // eslint-disable-next-line
      if (this.props.authUser != undefined) authUser = this.props.authUser
      // eslint-disable-next-line
      if (this.props.authUser != undefined)
        visitor = users.filter((u) => u.email === authUser.email)

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
        username: visitor[0].username,
      }
    } else {
      const { loggedIn } = this.props
      let authUser = { email: '' }
      // eslint-disable-next-line
      if (this.props.authUser != undefined) authUser = this.props.authUser
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
        username: '',
      }
    }
  }

  textChange = async (e) => {
    let value = e.target.value
    await this.setState({
      ...this.state,
      [e.target.name]: value,
    })
  }

  starChange = async (e) => {
    const stars = await parseInt(e.target.value)
    await this.setState({
      ...this.state,
      stars: stars,
    })

    if (this.state.stars === 0) {
      await this.setState({ ...this.state, starsDisabled: true })
    }

    if (this.state.stars > 0) {
      await this.setState({ ...this.state, starsDisabled: false })
    }
  }

  review = () => {
    if (this.state.loggedIn === true) {
      this.setState({ ...this.state, newReview: true })
    } else {
      return this.props.history.push('/signin')
    }
  }

  showMore = async () => {
    try {
      await this.setState({ ...this.state, showMore: true })
    } catch (err) {
      console.log({ showError: err })
    }
  }

  collapse = async () => {
    try {
      await this.setState({ ...this.state, showMore: false })
    } catch (err) {
      console.log({ showError: err })
    }
  }
  render() {
    if (this.props.users[0]) {
      const { project } = this.props
      const time = moment(project.timestamp).format('MMMM Do YYYY')
      

      let steps = JSON.parse(project.steps)

      if (this.state.edit) {
        return <Redirect to={`/projects/${project.id}/edit`} />
      }

      if (this.state.loggedIn === true) {
        // logged in

        if (this.state.reviews[0]) {
          // logged in, are reviews

          if (project.User.email === this.state.authUser.email) {
            // logged in, are reviews, your project, return
            return (
              <div className="project-card-container">
                <button
                  className="editButton"
                  onClick={() => {
                    this.setState({ edit: true })
                  }}
                >
                  Edit
                </button>
                <div className="header-info">
                  <h1>{`Project Title: ${project.name}`}</h1>
                  <p>{`Created By: ${project.User.username}`}</p>
                  {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                  <p>{`Rating: ${project.rating}`}</p>
                </div>

                <img
                  className="project-page-image"
                  src={`${project.titleImg}`}
                  alt="project"
                />
                <div className="project-step-section">
                  <h2>Steps:</h2>
                  <div className="steps-container">
                    {steps.map((step) => {
                      if (step.type === 'img') {
                        return (
                          <img key={step.body} src={step.body} alt="step" />
                        )
                      } else {
                        return <li key={step.body}>{`${step.body}`}</li>
                      }
                    })}
                  </div>
                  <h2>Reviews:</h2>
                  <div className="review-section">
                    {this.state.reviews.map((rev) => {
                      return (
                        <ReviewCard
                          key={rev.id}
                          review={rev}
                          users={this.props.users}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          } else {
            // logged in, are reviews, not your project

            if (this.state.newReview === true) {
              // logged in, are reviews, not your project, newReview

              if (this.state.visitor[0].RatedProjects[0]) {
                // logged in, are reviews, not your project, newReview, you've rated projs
                let rateCheck = this.state.visitor[0].RatedProjects.filter(
                  (proj) => proj.id === project.id
                )
                if (rateCheck.length >= 1) {
                  // logged in, are reviews, not your proj, newRev, you've rated projs, rated this one, return

                  return (
                    <div className="project-card-container">
                      <h1>{`aProject Title:${project.name}`}</h1>
                      <p>{`Created By:${project.User.username}`}</p>
                      {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                      <p>{`Rating:${project.rating}`}</p>
                      <img
                        className="project-page-image"
                        src={`${project.titleImg}`}
                        alt="project"
                      />
                      <p>{`${project.titleBlurb}`}</p>

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
                              )
                            } else {
                              return <div key={step.body}>{`${step.body}`}</div>
                            }
                          })}
                          <h2>Reviews:</h2>
                          {this.state.reviews.map((rev) => {
                            return (
                              <ReviewCard
                                key={rev.id}
                                review={rev}
                                users={this.props.users}
                              />
                            )
                          })}
                          <button
                            onClick={(e) => {
                              this.review()
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
                                )
                              if (error) {
                                console.log({ revError: error })
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
                                )
                              }
                              
                                return (
                                  <form
                                    onSubmit={async (e) => {
                                      e.preventDefault()
                                      const date = await new Date(Date.now())
                                      await newReview({
                                        variables: {
                                          name: this.state.name,
                                          text: this.state.text,
                                          timestamp: date,
                                          user: project.User.username,
                                          username: this.state.username,
                                          id: project.id,
                                          projRating: this.state.stars,
                                        },
                                      })
                                      await console.log({props: this.props})
                                      await this.props.revRefetch()
                                      
                                      const { reviews } = await this.props
                                      let revs = await reviews.filter(
                                        (rev) =>
                                          rev.ProjectReviewed.id === project.id
                                      )
                                      await this.setState({
                                        ...this.state,
                                        newReview: false,
                                        reviews: revs,
                                      })
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
                                )
                            }}
                          </Mutation>
                          <button onClick={this.collapse}>Collapse</button>
                        </div>
                      ) : null}
                    </div>
                  )
                } else {
                  // logged in, are reviews, not your proj, newRev, you've rated projs, didn't rate this one, return

                  return (
                    <div className="project-card-container">
                      <h1>{`bProject Title:${project.name}`}</h1>
                      <p>{`Created By:${project.User.username}`}</p>
                      {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                      <p>{`Rating:${project.rating}`}</p>
                      <img
                        className="project-page-image"
                        src={`${project.titleImg}`}
                        alt="project"
                      />
                      <p>{`${project.titleBlurb}`}</p>

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
                              )
                            } else {
                              return <div key={step.body}>{`${step.body}`}</div>
                            }
                          })}

                          <h2>Reviews:</h2>
                          {this.state.reviews.map((rev) => {
                            return (
                              <ReviewCard
                                key={rev.id}
                                review={rev}
                                users={this.props.users}
                              />
                            )
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
                                )
                              if (error) {
                                console.log({ revError: error })
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
                                )
                              }

                              return (
                                <form
                                  onSubmit={async (e) => {
                                    e.preventDefault()
                                    const date = await new Date(Date.now())

                                    await newReview({
                                      variables: {
                                        name: this.state.name,
                                        text: this.state.text,
                                        timestamp: date,
                                        user: project.User.username,
                                        username: this.state.username,
                                        id: project.id,
                                        projRating: this.state.stars,
                                      },
                                      // refetchQueries: [ { query: getReviews}]
                                    })
                                    await this.props.revRefetch()
                                    const { reviews } = await this.props
                                    let revs = await reviews.filter(
                                      (rev) =>
                                        rev.ProjectReviewed.id === project.id
                                    )
                                    await this.setState({
                                      ...this.state,
                                      newReview: false,
                                      reviews: revs,
                                    })
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
                              )
                            }}
                          </Mutation>
                          <button
                            onClick={(e) => {
                              this.review()
                            }}
                          >
                            Add a review
                          </button>
                          <button onClick={this.collapse}>Collapse</button>
                        </div>
                      ) : null}
                    </div>
                  )
                }
              } else {
                //logged in, are revs, not your proj, newReview, you've never rated, return

                return (
                  <div className="project-card-container">
                    <h1>{`Project Title:${project.name}`}</h1>
                    <p>{`Created By:${project.User.username}`}</p>
                    {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                    <p>{`Rating:${project.rating}`}</p>
                    <img
                      className="project-page-image"
                      src={`${project.titleImg}`}
                      alt="project"
                    />
                    <p>{`${project.titleBlurb}`}</p>

                    <button onClick={this.showMore}>View More</button>
                    {this.state.showMore ? (
                      <div>
                        <h2>Steps:</h2>
                        {steps.map((step) => {
                          if (step.type === 'img') {
                            return (
                              <img key={step.body} src={step.body} alt="step" />
                            )
                          } else {
                            return <div key={step.body}>{`${step.body}`}</div>
                          }
                        })}

                        <h2>Reviews:</h2>
                        {this.state.reviews.map((rev) => {
                          return (
                            <ReviewCard
                              key={rev.id}
                              review={rev}
                              users={this.props.users}
                            />
                          )
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
                              )
                            if (error) {
                              console.log({ revError: error })
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
                              )
                            }

                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault()
                                  const date = await new Date(Date.now())

                                  await newReview({
                                    variables: {
                                      name: this.state.name,
                                      text: this.state.text,
                                      timestamp: date,
                                      user: project.User.username,
                                      username: this.state.username,
                                      id: project.id,
                                      projRating: this.state.stars,
                                    },
                                    // refetchQueries: [ { query: getReviews}]
                                  })
                                  await this.props.revRefetch()
                                  const { reviews } = await this.props
                                  let revs = await reviews.filter(
                                    (rev) =>
                                      rev.ProjectReviewed.id === project.id
                                  )
                                  await this.setState({
                                    ...this.state,
                                    newReview: false,
                                    reviews: revs,
                                  })
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
                            )
                          }}
                        </Mutation>
                        <button
                          onClick={(e) => {
                            this.review()
                          }}
                        >
                          Add a review
                        </button>
                        <button onClick={this.collapse}>Collapse</button>
                      </div>
                    ) : null}
                  </div>
                )
              }
            } else {
              // logged in, are reviews, not your project, not newReview

              if (this.state.visitor[0].RatedProjects[0]) {
                // logged in, are reviews, not your project, not newReview, you've rated projs
                let rateCheck = this.state.visitor[0].RatedProjects.filter(
                  (proj) => proj.id === project.id
                )
                if (rateCheck.length >= 1) {
                  // logged in, are reviews, not your proj, not newRev, you've rated projs, rated this one, return

                  return (
                    <div className="project-card-container">
                      <div className="header-info">
                        <h1>{`Project Title: ${project.name}`}</h1>
                        <p>{`Created By: ${project.User.username}`}</p>
                        {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                        <p>{`Rating: ${project.rating}`}</p>
                      </div>
                      <img
                        className="project-page-image"
                        src={`${project.titleImg}`}
                        alt="project"
                      />

                      <div className="project-step-section">
                        <h2>Steps:</h2>
                        <div className="steps-container">
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              )
                            } else {
                              return <li key={step.body}>{`${step.body}`}</li>
                            }
                          })}
                        </div>
                        <h2>Reviews:</h2>
                        <div className="review-section">
                          {this.state.reviews.map((rev) => {
                            return (
                              <ReviewCard
                                key={rev.id}
                                review={rev}
                                users={this.props.users}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  // logged in, are reviews, not your proj, not newRev, you've rated projs, didn't rate this one, return

                  return (
                    <div className="project-card-container">
                      <div className="header-info">
                        <h1>{`Project Title: ${project.name}`}</h1>
                        <p>{`Created By: ${project.User.username}`}</p>
                        {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                        <p>{`Rating: ${project.rating}`}</p>
                      </div>

                      <img
                        className="project-page-image"
                        src={`${project.titleImg}`}
                        alt="project"
                      />
                      <div className="project-step-section">
                        <h2>Steps:</h2>
                        <div className="steps-container">
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              )
                            } else {
                              return <li key={step.body}>{`${step.body}`}</li>
                            }
                          })}
                        </div>

                        <h2>Reviews:</h2>
                        {this.state.reviews.map((rev) => {
                          return (
                            <ReviewCard
                              key={rev.id}
                              review={rev}
                              users={this.props.users}
                            />
                          )
                        })}
                        <button
                          onClick={(e) => {
                            this.review()
                          }}
                        >
                          Add a review
                        </button>
                      </div>
                    </div>
                  )
                }
              } else {
                //logged in, are revs, not your proj, not newReview, you've never rated, return

                return (
                  <div className="project-card-container">
                    <h1>{`Project Title:${project.name}`}</h1>
                    <p>{`Created By:${project.User.username}`}</p>
                    {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                    <p>{`Rating:${project.rating}`}</p>
                    <img
                      className="project-page-image"
                      src={`${project.titleImg}`}
                      alt="project"
                    />
                    <p>{`${project.titleBlurb}`}</p>

                    <button onClick={this.showMore}>View More</button>
                    {this.state.showMore ? (
                      <div>
                        <h2>Steps:</h2>
                        {steps.map((step) => {
                          if (step.type === 'img') {
                            return (
                              <img key={step.body} src={step.body} alt="step" />
                            )
                          } else {
                            return <div key={step.body}>{`${step.body}`}</div>
                          }
                        })}

                        <h2>Reviews:</h2>
                        {this.state.reviews.map((rev) => {
                          return (
                            <ReviewCard
                              key={rev.id}
                              review={rev}
                              users={this.props.users}
                            />
                          )
                        })}
                        <button
                          onClick={(e) => {
                            this.review()
                          }}
                        >
                          Add a review
                        </button>
                        <button onClick={this.collapse}>Collapse</button>
                      </div>
                    ) : null}
                  </div>
                )
              }
            }
          }
        } else {
          // logged in, no reviews

          if (project.User.email === this.state.authUser.email) {
            // logged in, no revs, your proj, return

            return (
              <div className="project-card-container">
                <button
                  className="editButton"
                  onClick={() => {
                    this.setState({ edit: true })
                  }}
                >
                  Edit
                </button>
                <div className="header-info">
                  <h1>{`Project Title: ${project.name}`}</h1>
                  <p>{`Created By: ${project.User.username}`}</p>
                  {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                  <p>{`Rating: ${project.rating}`}</p>
                </div>

                <img
                  className="project-page-image"
                  src={`${project.titleImg}`}
                  alt="project"
                />
                <div className="project-step-section">
                  <h2>Steps:</h2>
                  <div className="steps-container">
                    {steps.map((step) => {
                      if (step.type === 'img') {
                        return (
                          <img key={step.body} src={step.body} alt="step" />
                        )
                      } else {
                        return <li key={step.body}>{`${step.body}`}</li>
                      }
                    })}
                  </div>
                  <h2>Reviews:</h2>
                  <p>There are currently no reviews.</p>
                </div>
              </div>
            )
          } else {
            // logged in, no revs, not your proj

            if (this.state.newReview) {
              // logged in, no revs, not your proj, newRev

              if (this.state.visitor[0].RatedProjects[0]) {
                // logged in, no reviews, not your project, newReview, you've rated projs
                let rateCheck = this.state.visitor[0].RatedProjects.filter(
                  (proj) => proj.id === project.id
                )
                if (rateCheck.length >= 1) {
                  // logged in, no reviews, not your proj, newRev, you've rated projs, rated this one, return

                  return (
                    <div className="project-card-container">
                      <h1>{`Project Title:${project.name}`}</h1>
                      <p>{`Created By:${project.User.username}`}</p>
                      {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                      <p>{`Rating:${project.rating}`}</p>
                      <img
                        className="project-page-image"
                        src={`${project.titleImg}`}
                        alt="project"
                      />
                      <p>{`${project.titleBlurb}`}</p>

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
                              )
                            } else {
                              return <div key={step.body}>{`${step.body}`}</div>
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
                                )
                              if (error) {
                                console.log({ revError: error })
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
                                )
                              }
                              if (data)
                                return (
                                  <form
                                    onSubmit={async (e) => {
                                      e.preventDefault()
                                      const date = await new Date(Date.now())

                                      await newReview({
                                        variables: {
                                          name: this.state.name,
                                          text: this.state.text,
                                          timestamp: date,
                                          user: project.User.username,
                                          username: this.state.username,
                                          id: project.id,
                                          projRating: this.state.stars,
                                        },
                                        // refetchQueries: [ { query: getReviews}]
                                      })
                                      await this.props.revRefetch()
                                      const { reviews } = await this.props
                                      let revs = await reviews.filter(
                                        (rev) =>
                                          rev.ProjectReviewed.id === project.id
                                      )
                                      await this.setState({
                                        ...this.state,
                                        newReview: false,
                                        reviews: revs,
                                      })
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
                                )
                            }}
                          </Mutation>
                          <button
                            onClick={(e) => {
                              this.review()
                            }}
                          >
                            Add a review
                          </button>
                          <button onClick={this.collapse}>Collapse</button>
                        </div>
                      ) : null}
                    </div>
                  )
                } else {
                  // logged in, no reviews, not your proj, newRev, you've rated projs, didn't rate this one, return

                  return (
                    <div className="project-card-container">
                      <div className="header-info">
                        <h1>{`Project Title: ${project.name}`}</h1>
                        <p>{`Created By: ${project.User.username}`}</p>
                        {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                        <p>{`Rating: ${project.rating}`}</p>
                      </div>

                      <img
                        className="project-page-image"
                        src={`${project.titleImg}`}
                        alt="project"
                      />
                      <div className="project-step-section">
                        <h2>Steps:</h2>
                        <div className="steps-container">
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              )
                            } else {
                              return <li key={step.body}>{`${step.body}`}</li>
                            }
                          })}
                        </div>
                        <Mutation mutation={NEW_REVIEW}>
                          {(newReview, { loading, error, data }) => {
                            if (loading) return <h1>Loading...</h1>
                            if (error) {
                              console.log({ revError: error })
                              return (
                                <form className="reviewForm">
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
                              )
                            }

                            return (
                              <form
                                className="addReviewForm"
                                onSubmit={async (e) => {
                                  e.preventDefault()
                                  const date = await new Date(Date.now())

                                  await newReview({
                                    variables: {
                                      name: this.state.name,
                                      text: this.state.text,
                                      timestamp: date,
                                      user: project.User.username,
                                      username: this.state.username,
                                      id: project.id,
                                      projRating: this.state.stars,
                                    },
                                    refetchQueries: [{ query: getReviews }],
                                  })
                                  await this.props.revRefetch()
                                  const { reviews } = await this.props
                                  let revs = await reviews.filter(
                                    (rev) =>
                                      rev.ProjectReviewed.id === project.id
                                  )
                                  await this.setState({
                                    ...this.state,
                                    newReview: false,
                                    reviews: revs,
                                  })
                                }}
                              >
                                <div className="addReviewSection">
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
                                    className="titleInput"
                                    type="text"
                                    name="name"
                                    placeHolder="Add Title..."
                                    value={this.state.name}
                                    onChange={this.textChange}
                                  />
                                  <h3>Body:</h3>
                                  <textarea
                                    name="text"
                                    value={this.state.text}
                                    onChange={this.textChange}
                                    className="reviewBody"
                                  />
                                  <button type="submit">Submit</button>
                                </div>
                              </form>
                            )
                          }}
                        </Mutation>
                      </div>
                    </div>
                  )
                }
              } else {
                //logged in, no revs, not your proj, newReview, you've never rated, return

                return (
                  <div className="project-card-container">
                    <h1>{`Project Title:${project.name}`}</h1>
                    <p>{`Created By:${project.User.username}`}</p>
                    {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                    <p>{`Rating:${project.rating}`}</p>
                    <img
                      className="project-page-image"
                      src={`${project.titleImg}`}
                      alt="project"
                    />
                    <p>{`${project.titleBlurb}`}</p>

                    <button onClick={this.showMore}>View More</button>
                    {this.state.showMore ? (
                      <div>
                        <h2>Steps:</h2>
                        {steps.map((step) => {
                          if (step.type === 'img') {
                            return (
                              <img key={step.body} src={step.body} alt="step" />
                            )
                          } else {
                            return <div key={step.body}>{`${step.body}`}</div>
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
                              )
                            if (error) {
                              console.log({ revError: error })
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
                              )
                            }

                            return (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault()
                                  const date = await new Date(Date.now())

                                  await newReview({
                                    variables: {
                                      name: this.state.name,
                                      text: this.state.text,
                                      timestamp: date,
                                      user: project.User.username,
                                      username: this.state.username,
                                      id: project.id,
                                      projRating: this.state.stars,
                                    },
                                    // refetchQueries: [ { query: getReviews}]
                                  })
                                  await this.props.revRefetch()
                                  const { reviews } = await this.props
                                  let revs = await reviews.filter(
                                    (rev) =>
                                      rev.ProjectReviewed.id === project.id
                                  )
                                  await this.setState({
                                    ...this.state,
                                    newReview: false,
                                    reviews: revs,
                                  })
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
                            )
                          }}
                        </Mutation>
                        <button
                          onClick={(e) => {
                            this.review()
                          }}
                        >
                          Add a review
                        </button>
                        <button onClick={this.collapse}>Collapse</button>
                      </div>
                    ) : null}
                  </div>
                )
              }
            } else {
              // logged in, no revs, not your proj, not newRev

              if (this.state.visitor[0].RatedProjects[0]) {
                // logged in, no reviews, not your project, not newReview, you've rated projs
                let rateCheck = this.state.visitor[0].RatedProjects.filter(
                  (proj) => proj.id === project.id
                )

                if (rateCheck.length >= 1) {
                  // logged in, no reviews, not your proj, not newRev, you've rated projs, rated this one, return

                  return (
                    <div className="project-card-container">
                      <div className="header-info">
                        <h1>{`Project Title: ${project.name}`}</h1>
                        <p>{`Created By: ${project.User.username}`}</p>
                        {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                        <p>{`Rating: ${project.rating}`}</p>
                      </div>

                      <img
                        className="project-page-image"
                        src={`${project.titleImg}`}
                        alt="project"
                      />
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
                              )
                            } else {
                              return <div key={step.body}>{`${step.body}`}</div>
                            }
                          })}

                          <h2>Reviews:</h2>
                          <p>There are currently no reviews.</p>

                          <button
                            onClick={(e) => {
                              this.review()
                            }}
                          >
                            Add a review
                          </button>
                          <button onClick={this.collapse}>Collapse</button>
                        </div>
                      ) : null}
                    </div>
                  )
                } else {
                  // logged in, no reviews, not your proj, not newRev, you've rated projs, didn't rate this one, return

                  return (
                    <div className="project-card-container">
                      <div className="header-info">
                        <h1>{`Project Title: ${project.name}`}</h1>
                        <p>{`Created By: ${project.User.username}`}</p>
                        {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                        <p>{`Rating: ${project.rating}`}</p>
                      </div>

                      <img
                        className="project-page-image"
                        src={`${project.titleImg}`}
                        alt="project"
                      />
                      <div className="project-step-section">
                        <h2>Steps:</h2>
                        <div className="steps-container">
                          {steps.map((step) => {
                            if (step.type === 'img') {
                              return (
                                <img
                                  key={step.body}
                                  src={step.body}
                                  alt="step"
                                />
                              )
                            } else {
                              return <li key={step.body}>{`${step.body}`}</li>
                            }
                          })}
                        </div>
                        <h2>Reviews:</h2>
                        <p>There are currently no reviews</p>

                        <button
                          onClick={(e) => {
                            this.review()
                          }}
                        >
                          Add a review
                        </button>
                      </div>
                    </div>
                  )
                }
              } else {
                //logged in, no revs, not your proj, not newReview, you've never rated, return

                return (
                  <div className="project-card-container">
                    <button
                      className="editButton"
                      onClick={() => {
                        this.setState({ edit: true })
                      }}
                    >
                      Edit
                    </button>
                    <div className="header-info">
                      <h1>{`Project Title: ${project.name}`}</h1>
                      <p>{`Created By: ${project.User.username}`}</p>
                      {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                      <p>{`Rating: ${project.rating}`}</p>
                    </div>

                    <img
                      className="project-page-image"
                      src={`${project.titleImg}`}
                      alt="project"
                    />

                    <div className="project-step-section">
                      <h2>Steps:</h2>
                      <div className="steps-container">
                        {steps.map((step) => {
                          if (step.type === 'img') {
                            return (
                              <img key={step.body} src={step.body} alt="step" />
                            )
                          } else {
                            return <li key={step.body}>{`${step.body}`}</li>
                          }
                        })}
                      </div>

                      <h2>Reviews:</h2>
                      <p>There are currently no reviews.</p>

                      <button
                        onClick={(e) => {
                          this.review()
                        }}
                      >
                        Add a review
                      </button>
                    </div>
                  </div>
                )
              }
            }
          }
        }
      } else {
        // not logged in
        if (this.state.reviews[0]) {
          // not logged in, are reviews, return
          return (
            <div className="project-card-container">
              <div className="header-info">
                <h1>{`Project Title: ${project.name}`}</h1>
                <p>{`Created By: ${project.User.username}`}</p>
                {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                <p>{`Rating: ${project.rating}`}</p>
              </div>

              <img
                className="project-page-image"
                src={`${project.titleImg}`}
                alt="project"
              />
              <div className="project-step-section">
                <h2>Steps:</h2>
                <div className="steps-container">
                  {steps.map((step) => {
                    if (step.type === 'img') {
                      return <img key={step.body} src={step.body} alt="step" />
                    } else {
                      return <li key={step.body}>{`${step.body}`}</li>
                    }
                  })}
                </div>
                <h2>Reviews:</h2>
                <div className="review-section">
                  {this.state.reviews.map((rev) => {
                    return (
                      <ReviewCard
                        key={rev.id}
                        review={rev}
                        users={this.props.users}
                      />
                    )
                  })}
                </div>
                <button
                  onClick={(e) => {
                    this.review()
                  }}
                >
                  Add a review
                </button>
              </div>
            </div>
          )
        } else {
          // not logged in, no reviews, return

          return (
            <div className="project-card-container">
              <div className="header-info">
                <h1>{`Project Title: ${project.name}`}</h1>
                <p>{`Created By: ${project.User.username}`}</p>
                {time !== 'Invalid date' ? <p>{time}</p> : <p>{project.timestamp.slice(0, 10)}</p>}
                <p>{`Rating: ${project.rating}`}</p>
              </div>

              <img
                className="project-page-image"
                src={`${project.titleImg}`}
                alt="project"
              />

              <div className="project-step-section">
                <h2>Steps:</h2>
                <div className="steps-container">
                  {steps.map((step) => {
                    if (step.type === 'img') {
                      return <img key={step.body} src={step.body} alt="step" />
                    } else {
                      return <li key={step.body}>{`${step.body}`}</li>
                    }
                  })}
                  <h2>Reviews:</h2>
                  <p>There are no reviews yet</p>
                </div>
                <button
                  onClick={(e) => {
                    this.review()
                  }}
                >
                  Add a review
                </button>
              </div>
            </div>
          )
        }
      }
    } else {
      return (
        <div className="project-card-container">
          <SkeletonTheme highlightColor="#6fb3b8">
            <div className="header-info">
              <h1>
                <Skeleton />
              </h1>
              <p>
                <Skeleton />
              </p>
              <p>
                <Skeleton />
              </p>
              <p>
                <Skeleton />
              </p>
            </div>

            <div className="project-page-image">
              <Skeleton />
            </div>

            <div className="project-step-section">
              <h2>
                <Skeleton />
              </h2>
              <div className="steps-container">
                <Skeleton count={3} />
                <h2>
                  <Skeleton />
                </h2>
                <p>
                  <Skeleton />
                </p>
              </div>
              <button>
                <Skeleton />
              </button>
            </div>
          </SkeletonTheme>
        </div>
      )
    }
  }
}

export default ProjectCard
