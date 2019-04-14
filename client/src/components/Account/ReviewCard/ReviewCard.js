import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div>
      <div>{`@${review.Author.username}`}</div>
      <div>{`${review.timestamp}`}</div>
      <img src={`${review.name}`} alt="review" />
      <div>{`${review.text}`}</div>
      <span>{`Thumbs Up: ${review.thumbsUp}`}</span>
      <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
    </div>
  );
};

export default ReviewCard;
