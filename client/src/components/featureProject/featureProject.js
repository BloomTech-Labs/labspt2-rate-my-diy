import React from 'react';
import '../cards/card.scss';

function Featured() {
	return (
		<div className="card">
			<p>Props.Image</p>
			<p>Props.Stars</p>

			{Props.Type === 'featured' ? <p>Props.Title</p> : null}
			<p>Props.User</p>
		</div>
	);
}

export default Featured;
