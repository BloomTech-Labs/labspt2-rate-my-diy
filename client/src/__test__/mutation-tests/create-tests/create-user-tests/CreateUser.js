import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

export const CREATE_USER = gql`
 directive @default on userProfileImage
 mutation createUser(
  $username: String!
  $email: String!
  $userProfileImage: String! 
  $bio: String!
  privilege: String! 
  $name: String
  $accountType: String!
)
`;
