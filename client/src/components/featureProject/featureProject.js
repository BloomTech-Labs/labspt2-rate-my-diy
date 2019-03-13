import React from 'react';
import '../cards/card.scss';

function FeaturedAndMakers(Props) {
	return (
		<div className="card">
			<p>Props.Image</p>
			<p>Props.Stars</p>

			{Props.type === 'featured' ? <p>Props.Title</p> : null}
			<p>Props.User</p>
		</div>
	);
}

export default FeaturedAndMakers;
