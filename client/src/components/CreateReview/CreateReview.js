import React, { Component } from 'react';
import './CreateReview.scss';
class CreateReview extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			reviewText: '',
		};
	}


	render() {
		return (
      <div className="createReview">
      <h1>Create New Review</h1>
        <form>
          <h3>Title Of Your Review</h3>
          <input name='title' value={this.state.title} />
          <h3>Your Review</h3>
					<textarea name='reviewText' value={this.state.reviewText} />
				</form>
			</div>
		);
	}
}

export default CreateReview;
