import React from 'react';
import * as ROUTES from '../../constants/routes';
import {Link} from 'react-router-dom';
import './Footer.scss';

function Footer() {
	return (
		<div className="footer">
			<nav className="bottomNav">
				<li>
					<Link to={ROUTES.HOME}>Home</Link>
				</li>
				<li>
					<Link to={ROUTES.ACCOUNT}>My Account</Link>
				</li>
				<li>
					<Link to={ROUTES.SEARCH}>Search</Link>
				</li>
				<li>
					<Link to={ROUTES.REVIEWS}>Reviews</Link>
				</li>
			</nav>
			<p>
				2019 Copyright <a href="/">Rate My DIY</a>{' '}
			</p>
		</div>
	);
}

export default Footer;
