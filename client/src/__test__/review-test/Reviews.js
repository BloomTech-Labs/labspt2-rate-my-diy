import React from 'react';
import { Query } from 'react-apollo';
import { GET_REVIEWS } from '../test-queries/test-queries';

export default () => {
  <Query query={GET_REVIEWS}>
    {({ loading, data, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error!</p>;
      return data.projects.map(
        ({ id, name, text, timestamp, thumbsUp, thumbsDown, projRating }) => (
          <div>
            <p>{id}</p>
            <p>{name}</p>
            <p>{text}</p>
            <p>{timestamp}</p>
            <p>{thumbsUp}</p>
            <p>{thumbsDown}</p>
            <p>{projRating}</p>
          </div>
        )
      );
    }}
  </Query>;
};
