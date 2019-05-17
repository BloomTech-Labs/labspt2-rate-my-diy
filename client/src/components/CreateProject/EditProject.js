import React, { Component } from 'react'
import ReactCloudinaryUploader from '@app-masters/react-cloudinary-uploader'
import CreatableSelect from 'react-select/lib/Creatable'
import { Mutation } from 'react-apollo'
import { Redirect } from 'react-router'
import { UPDATE_PROJECT } from '../../query/query'
import { GET_PROJECTS } from '../Lists/ProjectList'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import './CreateProject.scss'

class EditProject extends Component {
  constructor(props) {
    super(props)

    if (this.props.projects[0]) {
      const userPull = this.props.users.filter(
        (user) => user.email === this.props.authUser.email
      )
      const { username, email } = userPull[0]
      const categories = this.props.projects.map((project) => project.category)
      let filteredCategories = [...new Set(categories)]

      const {
        name,
        category,
        timestamp,
        titleImg,
        titleBlurb,
        steps,
        id,
      } = this.props.project
      let newSteps = []
      if (typeof steps === 'string')
        newSteps = JSON.parse(steps).concat([{ type: '', body: '' }])
      if (!typeof steps === 'string')
        newSteps = steps.concat([{ type: '', body: '' }])

      this.state = {
        imgDeleteDisabled: true,
        categories: filteredCategories,
        username: username,
        email: email,
        submitDisabled: true,
        project: {
          name: name,
          category: category,
          timestamp: timestamp,
          titleImg: titleImg,
          titleBlurb: titleBlurb,
          steps: newSteps,
          id: id,
        },
      }
    } else {
      this.state = {
        imgDeleteDisabled: true,
        categories: [],
        username: '',
        email: '',
        submitDisabled: true,
        project: {
          name: '',
          category: '',
          timestamp: '',
          titleImg: '',
          titleBlurb: '',
          steps: [],
          id: '',
        },
      }
    }
  }

  componentDidMount = () => {
    if (this.props.users[0]) {
      if (typeof this.state.project.steps === 'string') {
        let steps = this.state.project.steps
        let array = JSON.parse(steps)
        this.setState({
          ...this.state,
          project: { ...this.state.project, steps: array },
        })
      }
    }
  }

  textChange = async (e) => {
    let value = e.target.value
    await this.setState({
      project: {
        ...this.state.project,
        [e.target.name]: value,
      },
    })
  }
  textChangeHandler = (index) => (e) => {
    const newText = this.state.project.steps.map((step, sidx) => {
      if (index !== sidx) return step
      return { type: 'text', body: e.target.value }
    })

    this.setState({
      project: {
        ...this.state.project,
        steps: newText,
      },
    })
  }

  handleAddStep = () => {
    this.setState({
      ...this.state,
      project: {
        ...this.state.project,
        steps: this.state.project.steps.concat([{ type: '', body: '' }]),
      },
    })
  }

  addImage = (img) => {
    const steps = this.state.project.steps.filter(
      (step) => step !== { type: '', body: '' }
    )

    const newSteps = steps.concat({ type: 'img', body: img })

    const extraStep = newSteps.concat({ type: '', body: '' })

    this.setState({
      project: {
        ...this.state.project,
        steps: extraStep,
      },
    })
  }

  deletePhoto = (idx) => () => {
    const steps = this.state.project.steps.filter(
      (step) => step !== { type: '', body: '' }
    )
    const filtered = steps.filter((step, sidx) => idx !== sidx)
    this.setState({
      project: {
        ...this.state.project,
        steps: filtered,
      },
    })
  }

  removeTextStep = (idx) => () => {
    const steps = this.state.project.steps.filter((step, sidx) => idx !== sidx)
    this.setState({
      ...this.state,
      project: {
        ...this.state.project,
        steps: steps,
      },
    })
  }

  openCloudinary = (e) => {
    e.preventDefault()
    let options = {
      cloud_name: 'dv1rhurfd',
      upload_preset: 'korisbak',
      returnJustUrl: true,
      maxImageWidth: 400,
      maxImageHeight: 500,
    }
    ReactCloudinaryUploader.open(options)
      .then((image) => {
        if (this.props.returnJustUrl) image = image.url
        this.addImage(image)
      })
      .catch((err) => {
        console.error({ error: err })
      })
  }

  mainImage = (e) => {
    e.preventDefault()
    let options = {
      cloud_name: 'dv1rhurfd',
      upload_preset: 'korisbak',
      returnJustUrl: true,
      maxImageWidth: 400,
      maxImageHeight: 500,
    }
    ReactCloudinaryUploader.open(options)
      .then((image) => {
        if (this.props.returnJustUrl) image = image.url
        this.setState({
          imgDeleteDisabled: false,
          project: {
            ...this.state.project,
            titleImg: image,
          },
        })
      })
      .catch((err) => {
        console.error({ error: err })
      })
  }

  deleteMainImg = () => {
    this.setState({
      ...this.state,
      imgDeleteDisabled: true,
      project: {
        ...this.state.project,
        category: '',
      },
    })
  }

  handleChange = async (newValue, actionMeta) => {
    let value = ''

    if (newValue !== null) value = await newValue.value

    await this.setState({
      ...this.state,
      project: {
        ...this.state.project,
        category: value,
      },
    })
  }

  finalize = async (e) => {
    e.preventDefault()

    try {
      const steps = await this.state.project['steps']

      const filter = await steps.filter(
        (step) => step.type !== '' && step.body !== ''
      )

      const string = await JSON.stringify(filter)

      const date = await new Date(Date.now())

      const { name, category, titleImg, titleBlurb, id } = await this.state
        .project

      await this.setState({
        ...this.state,
        submitDisabled: false,
        project: {
          name: name,
          category: category,
          titleImg: titleImg,
          titleBlurb: titleBlurb,
          steps: string,
          timestamp: date,
          id: id,
        },
      })
    } catch (err) {
      console.log({ error: err })
    }
  }

  render() {
    // eslint-disable-next-line
    if (this.props.project != undefined) {
      let categories = this.props.projects.map((project) => project.category)
      let cats = [
        ...new Set(
          categories.map((category) => {
            return { value: category, label: category }
          })
        ),
      ]

      if (
        this.state.project.steps != null &&
        typeof this.state.project.steps === 'object'
      ) {
        return (
          <div className="projectInfo">
            <form>
              <h1>{`Edit ${this.state.project.name}`}</h1>
              <div className="projectTitle">
                <h2>Title</h2>

                <input
                  type="text"
                  name="name"
                  className="projectTitleInput"
                  value={this.state.project.name}
                  onChange={this.textChange}
                />
              </div>
              <div className="titleImage">
                <div className="setThumbnail">
                  <h3>Category</h3>
                  <CreatableSelect
                    isClearable
                    onChange={this.handleChange}
                    className="category"
                    onInputChange={this.handleInputChange}
                    options={cats}
                    value={{
                      value: this.state.project.category,
                      label: this.state.project.category,
                    }}
                  />
                </div>
                <div className="imageArea">
                  {/* <button disabled={this.state.imgDeleteDisabled} onClick={this.deleteMainImg}>Delete Photo</button> */}
                  <div className="descriptionRow">
                    <h2>Project Description</h2>
                    <div className="image-description">
                      {this.state.project.titleImg ? (
                        <img
                          src={this.state.project.titleImg}
                          alt="mainImage"
                        />
                      ) : (
                        <div className="emptyMainImage">
                          <button onClick={this.mainImage}>
                            Set Main Image
                          </button>
                        </div>
                      )}

                      <textarea
                        rows="6"
                        cols="75"
                        name="titleBlurb"
                        value={this.state.project.titleBlurb}
                        onChange={this.textChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="conditionalImage">
                  {this.state.project.titleImg ? (
                    <button
                      className="conditionalButton"
                      onClick={this.mainImage}
                    >
                      Change Main Image
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="stepSection">
                <h2>Steps:</h2>
                <div>
                  {this.state.project['steps'].map((step, idx) => {
                    if (step.type === 'img') {
                      return (
                        <div key={idx}>
                          <img src={step.body} alt="step" />
                          <button onClick={this.deletePhoto(idx)}>
                            Delete Photo
                          </button>
                        </div>
                      )
                    } else {
                      return (
                        <div key={idx}>
                          <textarea
                            type="text"
                            placeholder="Add Step..."
                            value={step.body}
                            onChange={this.textChangeHandler(idx)}
                          />

                          <button
                            type="button"
                            onClick={this.handleAddStep}
                            className="addStep"
                          >
                            Add Step
                          </button>
                          <button
                            className="addPicture"
                            onClick={this.openCloudinary}
                          >
                            Add Picture
                          </button>
                          <button
                            type="button"
                            onClick={this.removeTextStep(idx)}
                            className="removeStep"
                          >
                            Remove This Step
                          </button>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
              {this.state.submitDisabled ? (
                <button
                  className="submitButton"
                  type="button"
                  onClick={this.finalize}
                >
                  Finalize
                </button>
              ) : (
                <button
                  className="submitButton"
                  type="submit"
                  disabled={this.state.submitDisabled}
                >
                  Submit
                </button>
              )}
            </form>
          </div>
        )
      } else {
        let steps = JSON.parse(this.state.project.steps)

        const email = this.props.authUser.email
        const username = this.props.users.filter(
          (user) => user.email === email
        )[0].username
        return (
          <Mutation
            mutation={UPDATE_PROJECT}
            refetchQueries={() => {
              return [
                {
                  query: GET_PROJECTS,
                  variables: { email: email },
                },
              ]
            }}
          >
            {(editProject, { loading, error, data }) => {
              if (loading) return <span>Submitting your changes...</span>
              if (error) return <span>{`Error: ${error}`}</span>
              if (data) return <Redirect to={`/${username}/projects`} />
              return (
                <div className="projectInfo">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()

                      editProject({
                        variables: {
                          name: this.state.project.name,
                          category: this.state.project.category,
                          timestamp: this.state.project.timestamp,
                          titleImg: this.state.project.titleImg,
                          titleBlurb: this.state.project.titleBlurb,
                          steps: this.state.project.steps,
                          username: this.state.username,
                          id: this.state.project.id,
                        },
                      })
                    }}
                  >
                    {' '}
                    <div className="projectInfo">
                      <h1>{`Edit ${this.state.project.name}`}</h1>
                      <div className="projectTitle">
                        <h2>Title</h2>

                        <input
                          type="text"
                          name="name"
                          className="projectTitleInput"
                          value={this.state.project.name}
                          onChange={this.textChange}
                        />
                      </div>
                      <div className="titleImage">
                        <div className="setThumbnail">
                          <h3>Category</h3>
                          <CreatableSelect
                            isClearable
                            onChange={this.handleChange}
                            className="category"
                            onInputChange={this.handleInputChange}
                            options={cats}
                            value={{
                              value: this.state.project.category,
                              label: this.state.project.category,
                            }}
                          />
                        </div>
                        <div className="imageArea">
                          {/* <button disabled={this.state.imgDeleteDisabled} onClick={this.deleteMainImg}>Delete Photo</button> */}
                          <div className="descriptionRow">
                            <h2>Project Description:</h2>
                            <div className="image-description">
                              {this.state.project.titleImg ? (
                                <img
                                  src={this.state.project.titleImg}
                                  alt="mainImage"
                                />
                              ) : (
                                <div className="emptyMainImage">
                                  <button onClick={this.mainImage}>
                                    Set Main Image
                                  </button>
                                </div>
                              )}

                              <textarea
                                rows="6"
                                cols="75"
                                name="titleBlurb"
                                value={this.state.project.titleBlurb}
                                onChange={this.textChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="conditionalImage">
                          {this.state.project.titleImg ? (
                            <button
                              className="conditionalButton"
                              onClick={this.mainImage}
                            >
                              Change Main Image
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <div className="stepSection">
                        <h2>Steps:</h2>
                          {steps.map((step, idx) => {
                            if (step.type === 'img') {
                              return (
                                <div key={idx}>
                                  <img src={step.body} alt="step" />
                                  <button onClick={this.deletePhoto(idx)}>
                                    Delete Photo
                                  </button>
                                </div>
                              )
                            } else {
                              return (
                                <div key={idx}>
                                  <textarea
                                    type="text"
                                    placeholder="Add Step..."
                                    value={step.body}
                                    onChange={this.textChangeHandler(idx)}
                                  />

                                  <button
                                    type="button"
                                    onClick={this.handleAddStep}
                                    className="addStep"
                                  >
                                    Add Step
                                  </button>
                                  <button
                                    className="addPicture"
                                    onClick={this.openCloudinary}
                                  >
                                    Add Picture
                                  </button>
                                  <button
                                    type="button"
                                    onClick={this.removeTextStep(idx)}
                                    className="removeStep"
                                  >
                                    Remove This Step
                                  </button>
                                </div>
                              )
                            }
                          })}
                       
                      </div>
                      {this.state.submitDisabled ? (
                        <button
                          className="submitButton"
                          type="button"
                          onClick={this.finalize}
                        >
                          Finalize
                        </button>
                      ) : (
                        <button
                          className="submitButton"
                          type="submit"
                          disabled={this.state.submitDisabled}
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )
            }}
          </Mutation>
        )
      }
    } else {
      return (
        <div className="projectInfo">
          <form>
            <h1>Edit Project</h1>
            <div>
              <SkeletonTheme highlightColor="#6fb3b8">
                <div className="projectTitle">
                  <h2>
                    <Skeleton />
                  </h2>

                  <div className="projectTitleInput">
                    <Skeleton />
                  </div>
                </div>
                <div className="titleImage">
                  <div className="setThumbnail">
                    <h3>
                      <Skeleton />
                    </h3>
                    {/* <CreatableSelect className="category">
                      <Skeleton />
                    </CreatableSelect> */}
                  </div>
                  <div className="imageArea">
                    <div className="descriptionRow">
                      <h2>
                        <Skeleton />
                      </h2>
                      <div className="image-description">
                        <div className="emptyMainImage">
                          <Skeleton width={290} height={250} />
                        </div>
                        <div className="skeletonContainer">
                          <Skeleton count={10} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="conditionalImage">
                    <button className="conditionalButton">
                      <Skeleton />
                    </button>
                  </div>
                </div>

                <div className="stepSection">
                  <h2>
                    <Skeleton />
                  </h2>
                  <div>
                    <div>
                      <div className="skeletonContainer">
                        <Skeleton count={6} />
                      </div>

                      <button className="addStep">
                        <Skeleton />
                      </button>
                      <button className="addPicture">
                        <Skeleton />
                      </button>
                      <button className="removeStep">
                        <Skeleton />
                      </button>
                    </div>
                  </div>
                </div>

                <button className="submitButton">
                  <Skeleton />
                </button>
              </SkeletonTheme>
            </div>
          </form>
        </div>
      )
    }
  }
}

export default EditProject
