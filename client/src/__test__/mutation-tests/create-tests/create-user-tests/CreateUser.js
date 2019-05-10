import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

export const CREATE_USER = gql`
 directive @default on userProfileImage
 mutation createUser(
  $username: String!
  $email: String!
  # $userProfileImage: String! @default(value: "https://rosieshouse.org/wp-content/uploads/2016/06/avatar-large-square.jpg")
  $bio: String!
  # privilege: String! @default(value: "Plebian")
  $name: String
  # $accountType: String! @default(value: "free-tier")

)
`;
