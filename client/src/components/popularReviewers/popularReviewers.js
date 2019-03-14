import React from 'react';
import '../cards/card.scss';

function PopularReviewerCard(props) {
	return (
		<div className="card" onClick={() => props.clickHandler(props.username)}>
			<img src={props.userProfileImage} alt='user profile' />
			<p>{props.username}</p>
		</div>
	);
}

export default PopularReviewerCard;
