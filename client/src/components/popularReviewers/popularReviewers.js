import React from 'react';
import '../cards/card.scss';

function PopularReviewerCard(props) {
	return (
		<div className="card">
			<img src={props.userProfileImage} />
			<p>{props.username}</p>
		</div>
	);
}

export default PopularReviewerCard;
