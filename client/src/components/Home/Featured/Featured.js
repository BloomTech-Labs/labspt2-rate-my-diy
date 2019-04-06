import React from "react";
import "../../../styles/card.scss";
import star from "../../../img/star.png";

function Featured(props) {
  const stars = [];

  for (let i = 0; i < Math.round(props.rating); i++) {
    stars.push(<img src={star} alt="star" key={i} />);
  }
  return (
    <div className="card" onClick={() => props.clickHandler(props.username)}>
      <img classNAme="profileImg" src={props.image} alt="project" />
      <div className="info-container">
        <h2>{props.title}</h2>
        <p>@{props.username}</p>
        <div className="rating-container">
          {stars.map(star => {
            return star;
          })}
        </div>
      </div>
    </div>
  );
}

export default Featured;
