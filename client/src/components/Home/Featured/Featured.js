import React from "react";
import "../../../styles/card.scss";

function Featured(props) {
  return (
    <div className="card" onClick={() => props.clickHandler(props.username)}>
      <img src={props.image} alt="project" />
      {props.type === "featured" ? <h2>{props.title}</h2> : null}
      <p>@{props.username}</p>
      <p>{props.stars}</p>
    </div>
  );
}

export default Featured;
