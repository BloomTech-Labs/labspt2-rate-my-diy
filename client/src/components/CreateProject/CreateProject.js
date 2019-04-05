import React, { Component } from 'react';

class CreateProject extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div>
				<div className='titleBar'>
					<input />
					// Stars Review Input Will Go Here
					<button>Reviews</button>
				</div>
				<div className='projectInfo'>
					// input for image
					<textarea />
					<button>Add Text Field</button>
					<button>Add Picture</button>
				</div>
			</div>
		);
	}
}

export default CreateProject;
