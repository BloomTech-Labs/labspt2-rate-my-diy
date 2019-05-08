import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { getProjects as GET_PROJECTS } from '../test-queries/test-queries';
import { projectMocks } from './data-mocks/data-mocks';

export default () => (
  <Query query={GET_PROJECTS}>
    {({ loading, data, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error!</p>;
    }}
    ) ); }}
  </Query>
);
