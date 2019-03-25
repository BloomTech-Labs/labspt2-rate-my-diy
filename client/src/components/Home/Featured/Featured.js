import React from "react";
import "../../../styles/card.scss";
import star from '../../../img/star.png';

function Featured(props) {
  const stars = [];

  for(let i = 0; i < Math.round(props.rating); i++) {
    stars.push(<img src={star} alt="star" />);
  }
  return (
    <div className="card" onClick={() => props.clickHandler(props.username)}>
      <img src={props.image} alt="project" />
      {props.type === "featured" ? <h2>{props.title}</h2> : null}
      <p>@{props.username}</p>
      <div className="rating-container">
        {stars.map(star => {
          return star;
        })}
      </div>
    </div>
  );
}

export default Featured;
