import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { GET_PROJECTS } from '../test-queries/test-queries';

export default () => (
  <Query query={GET_PROJECTS}>
    {({ loading, data, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) {
        return <p>Error!</p>;
      }
      return data.projects.map(
        ({
          titleBlurb,
          name,
          timestamp,
          id,
          rating,
          User,
          titleImg,
          category,
          steps
        }) => (
          <div key={id}>
            <p>{titleBlurb}</p>
            <p>{name}</p>
            <p>{timestamp}</p>
            <p>{id}</p>
            <p>{rating}</p>
            <p>{User}</p>
            <img src={titleImg} />
            <p>{category}</p>
            <p>{steps}</p>
          </div>
        )
      );
    }}
  </Query>
);
