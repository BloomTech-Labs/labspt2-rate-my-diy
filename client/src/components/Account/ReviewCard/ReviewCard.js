import React from "react";

const ReviewCard = ({review}) => {
    return (
        <div>
            <div>{`@${review.ProjectReviewed.User.username}`}</div>
            <div>{`${review.projectReviewed.name}`}</div>
            <img src={`${review.projectReviewed.titleImg}`}/>
            <div>{`${review.projectReviewed.timestamp}`}</div>
        </div>
    )
}

export default ReviewCard