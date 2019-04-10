import React from 'react';
import MicroModal from 'react-micro-modal';
import { Redirect } from 'react-router-dom';

class ProjectCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false
    };
  }
  render() {
    const { project } = this.props;
    let steps = JSON.parse(project.steps);
    const json = localStorage.getItem('authUser');
    const user = JSON.parse(json);

    if (this.state.edit) {
      return (
        <Redirect
          to={{
            pathname: '/createproject',
            state: project
          }}
        />
      );
    }

    if (project.User.email === user.email) {
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

export default ProjectCard;
