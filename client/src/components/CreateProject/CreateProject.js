import React, { Component } from 'react';
import ReactCloudinaryUploader from '@app-masters/react-cloudinary-uploader';
import CreatableSelect from 'react-select/lib/Creatable';

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      username: '',
      email: '',
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

  componentDidMount = async () => {
    const user = localStorage.getItem('authUser');
    const json = JSON.parse(user);
    const userPull = this.props.users.filter(
      (user) => user.email === json.email
    );
    const { username, email } = userPull[0];

    const categories = this.props.projects.map((project) => project.category);
    let filteredCategories = [...new Set(categories)];

    if (this.props.location.state !== undefined) {
      const project = this.props.location.state;
      const steps = JSON.parse(project.steps);
      console.log({ steps: steps });

      await this.setState({
        ...this.state,
        imgDeleteDisabled: false,
        categories: filteredCategories,
        username: username,
        email: email,
        project: {
          name: project.name,
          steps: steps,
          category: project.category,
          timestamp: project.timestamp,
          titleImg: project.titleImg,
          titleBlurb: project.titleBlurb
        }
      });
    } else {
      await this.setState({
        imgDeleteDisabled: true,
        categories: filteredCategories,
        username: username,
        email: email
      });

      await console.log({ state: this.state });
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
    console.log({ name: this.state.project.titleBlurb });
  };
  textChangeHandler = (index) => (e) => {
    const newText = this.state.project.steps.map((step, sidx) => {
      if (index !== sidx) return step;
      return { type: 'text', body: e.target.value };
    });

    this.setState({ project: { steps: newText } });
    console.log({ steps: this.state.project.steps });
  };

  handleAddStep = () => {
    this.setState({
      project: {
        steps: this.state.project.steps.concat([{ type: '', body: '' }])
      }
    });
    console.log({ steps: this.state.project.steps });
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
    console.log({ steps: this.state.project.steps });
  };

  removeTextStep = (idx) => () => {
    const steps = this.state.project.steps.filter((step, sidx) => idx !== sidx);
    this.setState({
      project: { steps: steps }
    });
    console.log({ steps: this.state.project.steps });
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    const steps = this.state.project.steps;

    const filter = steps.filter((step) => step.type !== '' && step.body !== '');
    console.log({ filterAll: filter });
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
        category: ''
      }
    });
  };

  handleChange = (newValue, actionMeta) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };
  handleInputChange = (inputValue, actionMeta) => {
    this.setState({
      project: {
        ...this.state.project,
        category: inputValue
      }
    });

    console.group('Input Changed');
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.log(`state: ${this.state.project.category}`);
    console.groupEnd();
  };

  render() {
    const categories = this.props.projects.map((project) => project.category);
    let filteredCategories = [...new Set(categories)];
    const cats = filteredCategories.map((cat) => {
      return { value: cat, label: cat };
    });
    if (this.props.location.state) {
      const project = this.props.location.state;
      const steps = JSON.parse(project.steps);

      return (
        <div>
          <div className="projectInfo">
            <form onSubmit={this.handleSubmit}>
              <h1>{`Edit ${project.name}`}</h1>
              <h2>project name:</h2>
              <input
                type="text"
                name="name"
                value={this.state.project.name}
                onChange={this.textChange}
              />
              <h2>main image:</h2>
              <div>
                <img src={this.state.project.titleImg} />
                {/* <button disabled={this.state.imgDeleteDisabled} onClick={this.deleteMainImg}>Delete Photo</button> */}
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
              />
              <h2>Steps:</h2>
              {this.state.project.steps.map((step, idx) => {
                if (step.type === 'img') {
                  return (
                    <div key={idx}>
                      <img src={step.body} />
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
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="projectInfo">
            <form onSubmit={this.handleSubmit}>
              <h1>Create a Project</h1>
              <h2>project name:</h2>
              <input
                type="text"
                name="name"
                value={this.state.project.name}
                onChange={this.textChange}
              />
              <h2>main image:</h2>
              <div>
                <img src={this.state.project.titleImg} />
                {/* <button disabled={this.state.imgDeleteDisabled} onClick={this.deleteMainImg}>Delete Photo</button> */}
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
              />
              <h2>Steps:</h2>
              {this.state.project.steps.map((step, idx) => {
                if (step.type === 'img') {
                  return (
                    <div key={idx}>
                      <img src={step.body} />
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
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      );
    }
  }
}

export default CreateProject;
