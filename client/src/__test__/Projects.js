import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { projectMocks } from './data-mocks/data-mocks';

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
        }) => <div key={username} />
      );
    }}
  </Query>
);
