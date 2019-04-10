import React, { Component } from 'react';
import ReactCloudinaryUploader from '@app-masters/react-cloudinary-uploader';

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldText: '',
      newText: '',
      project: {
        name: '',
        category: '',
        timestamp: '',
        titleImg: '',
        titleBlurb: '',
        steps: [{ type: '', body: '' }],
        User: {
          username: '',
          email: ''
        }
      }
    };
  }

  componentDidMount() {
    const user = localStorage.getItem('authUser');
    const json = JSON.parse(user);

    if (
      this.props.location.state.User &&
      this.props.location.state.User.email === json.email
    ) {
      const project = this.props.location.state;
      const steps = JSON.parse(project.steps);
      console.log({ steps: steps });

      this.setState({
        project: {
          name: project.name,
          steps: steps,
          category: project.category,
          timestamp: project.timestamp,
          titleImg: project.titleImg,
          User: {
            username: project.User.username,
            email: project.User.email
          }
        }
      });
    } else {
      this.setState({
        project: {
          User: {
            email: json.email
          }
        }
      });
    }
  }

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
    console.log({ state: this.state });
  };

  openCloudinary = (e) => {
    e.preventDefault();
    let options = {
      cloud_name: 'dv1rhurfd',
      upload_preset: 'korisbak',
      returnJustUrl: true
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

  render() {
    if (this.props.location.state) {
      const project = this.props.location.state;
      const steps = JSON.parse(project.steps);

      return (
        <div>
          <div className="projectInfo">
            <form onSubmit={this.handleSubmit}>
              <h1>{`Edit ${project.name}`}</h1>
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
                        Add Step
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
                        Add Step
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
