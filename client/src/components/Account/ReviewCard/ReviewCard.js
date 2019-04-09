import React from "react";

const ReviewCard = ({review}) => {
    return (
        <div>
            <div>{`@${review.ProjectReviewed.User.username}`}</div>
            <div>{`${review.ProjectReviewed.name}`}</div>
            <img alt="Reviewed Project title." src={`${review.ProjectReviewed.titleImg}`}/>
            <div>{`${review.ProjectReviewed.timestamp}`}</div>
        </div>
    )
}

export default ReviewCard