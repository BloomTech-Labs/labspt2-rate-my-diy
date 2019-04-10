import React, { Component } from 'react';
import ReactCloudinaryUploader from "@app-masters/react-cloudinary-uploader"

class CreateProject extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			steps: [] 
		};
	}

	addTextArea = () => {
		const step = (
			<textarea></textarea>
		);

		this.setState(prevState => ({ 
			steps: [...prevState.steps, step]
		}));
  };
  
  addImage=() => {
    const step = (
			<input type="file"/>
		);

    this.setState(prevState => ({
			steps: [...prevState.steps, step]
		}));
	}
	
	openCloudinary = () => {
		let options = {
			cloud_name: "dv1rhurfd",
			upload_preset: "korisbak",
			returnJustUrl: true
	};
	
	ReactCloudinaryUploader.open(options).then(image=>{
			if (this.props.returnJustUrl)
				image = image.url;
				console.log("image",image);
			}).catch(err=>{
					console.error(err);
			});
	}

	removeStep = (i) => {
		const steps = this.state.steps;
		const removedStep = steps.filter(step => {
			if(step !== steps[i]) {
				return step;
			}
		});

		this.setState({
			steps: removedStep
		});
	}

	render() {
		return (
			<div>
				<div className='titleBar'>
					<input />
					{/* { Stars Review Input Will Go Here} */}
					<button>Reviews</button>
				</div>
				<div className='projectInfo'>
					{/* {input for image} */}
					{this.state.steps.map((step, i) => (
						<div key={i}>
							{step}
							<button onClick={() => this.removeStep(i)}>Remove</button>
						</div>
					))}
					<button onClick={this.addTextArea}>Add Text Field</button>
					<button onClick={this.openCloudinary}>Upload Picture</button>
					<button onClick={this.addImage}>Add Picture</button>
				</div>
			</div>
		);
	}
}

export default CreateProject;
