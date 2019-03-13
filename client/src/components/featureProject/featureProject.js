import React from 'react';
import '../cards/card.scss';

function FeaturedAndMakers(props) {
	return (
		<div className="card">
			{props.type === 'featured' ? <p>{props.title}</p> : null}
			<p>{props.user}</p>
			<p>{props.stars}</p>
		</div>
	);
}

export default FeaturedAndMakers;
