import React from 'react';

<<<<<<< HEAD
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
=======
const ReviewCard = ({ review }) => {
  return (
    <div>
      <div>{`@${review.ProjectReviewed.User.username}`}</div>
      <div>{`${review.ProjectReviewed.name}`}</div>
      <img src={`${review.ProjectReviewed.titleImg}`} alt="review" />
      <div>{`${review.ProjectReviewed.timestamp}`}</div>
    </div>
  );
};
>>>>>>> 756c6a9a7cc074cb44442952bfd2f36d70332a27

export default ReviewCard;
