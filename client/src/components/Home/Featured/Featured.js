import React from 'react';
import '../../../styles/card.scss';
import star from '../../../img/star.png';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import './Featured.scss';
// This is the base of all cards in the app.
function Featured(props) {
  const stars = [];

  for (let i = 0; i < Math.round(props.rating); i++) {
    stars.push(<img src={star} alt="star" key={i} />);
  }
  return (
    <div
      className="featuredCard"
      onClick={() => props.clickHandler(props.username)}
    >
      {console.log(props, 'props card')}
      <img className="img-responsive" src={props.image} alt="project" />
      <div className="infoContainer">
        <Link to={`/projects/${props.id}`}>
          <h3 className="projectTitle">{props.title}</h3>
        </Link>
        <Link to={`/${props.username}/profile`}>
          {props.category ? <p>Category: {props.category}</p> : null}
          <p>Created By: {props.username}</p>
          <p>Average Rating {props.rating}</p>
        </Link>
        <div className="stars">
          {stars.map((star) => {
            return star;
          })}
        </div>
      </div>
    </div>
  );
}

export default withRouter(Featured);
