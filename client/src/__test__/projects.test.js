import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from 'react-apollo/test-utils';
import Projects from './Projects';
import { projectMocks } from './data-mocks/data-mocks';

it('should render loading state initially', () => {
  const component = renderer.create(
    <MockedProvider mocks={projectMocks}>
      <Projects />
    </MockedProvider>
  );
  const tree = component.toJSON();
  expect(tree.children).toContain('Loading...');
});

it('should render without error or crash', () => {
  const component = renderer.create(
    <MockedProvider mocks={projectMocks}>
      <Projects />
    </MockedProvider>
  );
});
