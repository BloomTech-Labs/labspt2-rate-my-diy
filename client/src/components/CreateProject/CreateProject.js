import React, { Component } from 'react';
import ReactCloudinaryUploader from '@app-masters/react-cloudinary-uploader';
import CreatableSelect from 'react-select/lib/Creatable';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router';
import { CREATE_PROJECT } from '../../query/query';
import { GET_PROJECTS } from '../Lists/ProjectList';

class CreateProject extends Component {
  constructor(props) {
    super(props);

    const user = localStorage.getItem('authUser');
    const json = JSON.parse(user);
    const userPull = this.props.users.filter(
      (user) => user.email === json.email
    );
    const { username, email } = userPull[0];

    const categories = this.props.projects.map((project) => project.category);
    let filteredCategories = [...new Set(categories)];

    this.state = {
      imgDeleteDisabled: true,
      categories: filteredCategories,
      username: username,
      email: email,
      submitDisabled: true,
      project: {
        name: '',
        category: '',
        timestamp: '',
        titleImg: '',
        titleBlurb: '',
        steps: [{ type: '', body: '' }]
      }
    };
  }

  componentDidMount = () => {
    if (typeof this.state.project.steps === 'string') {
      let steps = this.state.project.steps;
      let array = JSON.parse(steps);
      this.setState({
        ...this.state,
        project: { ...this.state.project, steps: array }
      });
    }
  };

  textChange = async (e) => {
    let value = e.target.value;
    await this.setState({
      project: {
        ...this.state.project,
        [e.target.name]: value
      }
    });
  };

  textChangeHandler = (index) => (e) => {
    const newText = this.state.project.steps.map((step, sidx) => {
      if (index !== sidx) return step;
      return { type: 'text', body: e.target.value };
    });

    this.setState({
      project: {
        ...this.state.project,
        steps: newText
      }
    });
  };

  handleAddStep = () => {
    this.setState({
      ...this.state,
      project: {
        ...this.state.project,
        steps: this.state.project.steps.concat([{ type: '', body: '' }])
      }
    });
  };

  addImage = (img) => {
    const steps = this.state.project.steps.filter(
      (step) => step !== { type: '', body: '' }
    );

    const newSteps = steps.concat({ type: 'img', body: img });

    const extraStep = newSteps.concat({ type: '', body: '' });

    this.setState({
      project: {
        ...this.state.project,
        steps: extraStep
      }
    });
  };

  deletePhoto = (idx) => () => {
    const steps = this.state.project.steps.filter(
      (step) => step !== { type: '', body: '' }
    );
    const filtered = steps.filter((step, sidx) => idx !== sidx);
    this.setState({
      project: {
        steps: [filtered, { type: '', body: '' }]
      }
    });
  };

  removeTextStep = (idx) => () => {
    const steps = this.state.project.steps.filter((step, sidx) => idx !== sidx);
    this.setState({
      project: { steps: steps }
    });
  };

  openCloudinary = (e) => {
    e.preventDefault();
    let options = {
      cloud_name: 'dv1rhurfd',
      upload_preset: 'korisbak',
      returnJustUrl: true,
      maxImageWidth: 400,
      maxImageHeight: 500
    };
    ReactCloudinaryUploader.open(options)
      .then((image) => {
        if (this.props.returnJustUrl) image = image.url;
        this.addImage(image);
      })
      .catch((err) => {
        console.error({ error: err });
      });
  };

  mainImage = (e) => {
    e.preventDefault();
    let options = {
      cloud_name: 'dv1rhurfd',
      upload_preset: 'korisbak',
      returnJustUrl: true,
      maxImageWidth: 400,
      maxImageHeight: 500
    };
    ReactCloudinaryUploader.open(options)
      .then((image) => {
        if (this.props.returnJustUrl) image = image.url;
        this.setState({
          imgDeleteDisabled: false,
          project: {
            ...this.state.project,
            titleImg: image
          }
        });
      })
      .catch((err) => {
        console.error({ error: err });
      });
  };

  deleteMainImg = () => {
    this.setState({
      ...this.state,
      imgDeleteDisabled: true,
      project: {
        ...this.state.project,
        titleImg: ''
      }
    });
  };

  handleChange = async (newValue) => {
    let value = '';

    if (newValue !== null) value = await newValue.value;

    await this.setState({
      ...this.state,
      project: {
        ...this.state.project,
        category: value
      }
    });
  };

  finalize = async (e) => {
    e.preventDefault();
    try {
      const steps = await this.state.project['steps'];

      const filter = await steps.filter(
        (step) => step.type !== '' && step.body !== ''
      );

      const string = await JSON.stringify(filter);

      const date = await new Date(Date.now());

      const { name, category, titleImg, titleBlurb } = await this.state.project;

      await this.setState({
        ...this.state,
        submitDisabled: false,
        project: {
          name: name,
          category: category,
          titleImg: titleImg,
          titleBlurb: titleBlurb,
          steps: string,
          timestamp: date
        }
      });
    } catch (err) {
      console.log({ error: err });
    }
  };

  render() {
    const cats = this.state.categories.map((cat) => {
      return { value: cat, label: cat };
    });

    if (
      this.state.project.steps != null &&
      typeof this.state.project.steps === 'object'
    ) {
      return (
        <div className="projectInfo">
          <form>
            <h1>Create Project</h1>
            <h2>project name:</h2>
            <input
              type="text"
              name="name"
              value={this.state.project.name}
              onChange={this.textChange}
            />
            <h2>main image:</h2>
            <div>
              <img src={this.state.project.titleImg} alt="type" />
            </div>
            <button onClick={this.mainImage}>Set Main Image</button>
            <h2>project description:</h2>
            <textarea
              rows="6"
              cols="75"
              name="titleBlurb"
              value={this.state.project.titleBlurb}
              onChange={this.textChange}
            />
            <h2>category:</h2>
            <CreatableSelect
              isClearable
              onChange={this.handleChange}
              onInputChange={this.handleInputChange}
              options={cats}
              value={{
                value: this.state.project.category,
                label: this.state.project.category
              }}
            />

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
                  );
                } else {
                  return (
                    <div key={idx}>
                      <input
                        type="text"
                        value={step.body}
                        onChange={this.textChangeHandler(idx)}
                      />
                      <button
                        type="button"
                        onClick={this.removeTextStep(idx)}
                        className="small"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={this.handleAddStep}
                        className="small"
                      >
                        +
                      </button>
                      <button onClick={this.openCloudinary}>Add Picture</button>
                    </div>
                  );
                }
              })}
            </div>
            <button onClick={this.finalize}>Finalize</button>
            <button disabled={this.state.submitDisabled}>Submit</button>
          </form>
        </div>
      );
    } else {
      let steps = JSON.parse(this.state.project.steps);
      const json = localStorage.getItem('authUser');
      const user = JSON.parse(json);
      const email = user.email;

      return (
        <Mutation
          mutation={CREATE_PROJECT}
          refetchQueries={() => {
            return [
              {
                query: GET_PROJECTS,
                variables: { email: email }
              }
            ];
          }}
        >
          {(newProject, { loading, error, data }) => {
            if (loading) return <span>Submitting your project...</span>;
            if (error) return <span>{`Error: ${error}`}</span>;
            if (data)
              return <Redirect to={`/${this.state.username}/projects`} />;
            return (
              <div className="projectInfo">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    newProject({
                      variables: {
                        name: this.state.project.name,
                        category: this.state.project.category,
                        timestamp: this.state.project.timestamp,
                        titleImg: this.state.project.titleImg,
                        titleBlurb: this.state.project.titleBlurb,
                        steps: this.state.project.steps,
                        username: this.state.username
                      }
                    });
                  }}
                >
                  <h1>Create Project</h1>
                  <h2>project name:</h2>
                  <input
                    type="text"
                    name="name"
                    value={this.state.project.name}
                    onChange={this.textChange}
                  />
                  <h2>main image:</h2>
                  <div>
                    <img src={this.state.project.titleImg} alt="project" />
                  </div>
                  <button onClick={this.mainImage}>Set Main Image</button>
                  <h2>project description:</h2>
                  <textarea
                    rows="6"
                    cols="75"
                    name="titleBlurb"
                    value={this.state.project.titleBlurb}
                    onChange={this.textChange}
                  />
                  <h2>category:</h2>
                  <CreatableSelect
                    isClearable
                    onChange={this.handleChange}
                    onInputChange={this.handleInputChange}
                    options={cats}
                    value={{
                      value: this.state.project.category,
                      label: this.state.project.category
                    }}
                  />
                  <h2>Steps:</h2>
                  <div>
                    {steps.map((step, idx) => {
                      if (step.type === 'img') {
                        return (
                          <div key={idx}>
                            <img src={step.body} alt="step" />
                            <button onClick={this.deletePhoto(idx)}>
                              Delete Photo
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <div key={idx}>
                            <input
                              type="text"
                              value={step.body}
                              onChange={this.textChangeHandler(idx)}
                            />
                            <button
                              type="button"
                              onClick={this.removeTextStep(idx)}
                              className="small"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={this.handleAddStep}
                              className="small"
                            >
                              +
                            </button>
                            <button onClick={this.openCloudinary}>
                              Add Picture
                            </button>
                          </div>
                        );
                      }
                    })}
                  </div>

                  <button type="button" onClick={this.finalize}>
                    Finalize
                  </button>
                  <button type="submit" disabled={this.state.submitDisabled}>
                    Submit
                  </button>
                </form>
              </div>
            );
          }}
        </Mutation>
      );
    }
  }
}

export default CreateProject;
