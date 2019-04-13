import React, { Component } from 'react';
import ReactCloudinaryUploader from '@app-masters/react-cloudinary-uploader';

class ProjectInput extends Component {
  render() {
    return <textArea />;
  }
}

class Image extends Component {
  render() {
    return <input type="file" />;
  }
}

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = { steps: [] };
  }
  addTextArea = () => {
    const steps = this.state.steps.concat(ProjectInput);
    this.setState({ steps });
  };

  addImage = () => {
    const steps = this.state.steps.concat(Image);
    this.setState({ steps });
  };

  openCloudinary = () => {
    let options = {
      cloud_name: 'dv1rhurfd',
      upload_preset: 'korisbak',
      returnJustUrl: true
    };

    ReactCloudinaryUploader.open(options)
      .then((image) => {
        if (this.props.returnJustUrl) image = image.url;
        console.log('image', image);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    const steps = this.state.steps.map((Element, index) => {
      return <Element key={index} index={index} />;
    });

    return (
      <div>
        <div className="titleBar">
          <input />
          {/* { Stars Review Input Will Go Here} */}
          <button>Reviews</button>
        </div>
        <div className="projectInfo">
          {/* {input for image} */}
          <textarea />
          {steps}
          <button onClick={this.addTextArea}>Add Text Field</button>
          <button onClick={this.openCloudinary}>Upload Picture</button>
          <button onClick={this.addImage}>Add Picture</button>
        </div>
      </div>
    );
  }
}

export default CreateProject;
