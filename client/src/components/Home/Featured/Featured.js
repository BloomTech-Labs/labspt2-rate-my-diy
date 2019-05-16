import React from 'react'
import '../../../styles/card.scss'
import star from '../../../img/star.png'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import './Featured.scss'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
// This is the base of all cards in the app.
function Featured(props) {
  const stars = []

  for (let i = 0; i < Math.round(props.rating); i++) {
    stars.push(<img src={star} alt="star" key={i} />)
  }

  if (props.image) {
    return (
      <div
        className="featuredCard"
        // onClick={() => props.clickHandler(props.username)}
      >
        <img className="img-responsive" src={props.image} alt="project" />
        <div className="infoContainer">
          {/* <div> */}
          <Link to={`/projects/${props.id}`}>
            <h3 className="projectTitle">{props.title}</h3>
          </Link>
          <Link to={`/${props.username}/profile`}>
            {props.category ? <p>Category: {props.category}</p> : null}
            <p>@{props.username}</p>
          </Link>
          {props.thumbsUp ? <p>{`Thumbs Up: ${props.thumbsUp}`}</p> : null}
          <div className="stars">
            {stars.map((star) => {
              return star
            })}
          </div>
        </div>
        {/* </div> */}
      </div>
    )
  } else {
    return (
      <div
        className="featuredCard"
        // onClick={() => props.clickHandler(props.username)}
      >
        <SkeletonTheme highlightColor="#6fb3b8">
          <div className="img-responsive">
            <Skeleton height={300} width={300} />
          </div>
          <div className="infoContainer">
            {/* <div> */}
            <h3 className="projectTitle">
              <Skeleton />
            </h3>

            <h3 className="projectTitle">
              <Skeleton />
            </h3>

            {props.category ? (
              <p>
                <Skeleton />
              </p>
            ) : null}
            <p>
              <Skeleton />
            </p>

            {/* <div className="stars">
                {stars.map((star) => {
                  return star;
                })}
              </div> */}
          </div>
          {/* </div> */}
        </SkeletonTheme>
      </div>
    )
  }
}

export default withRouter(Featured)
