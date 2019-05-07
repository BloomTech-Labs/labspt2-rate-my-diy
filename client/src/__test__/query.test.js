import { getUsers } from '../query.js';
import { Query } from 'react-apollo';
import React from 'react'
import gql from 'graphql-tag'
// import jest,

export const GET_USER_QUERY = gql `
 query getUser($name: String) {
  user: {
   id: '',
   username: '',
   userProfileImage: '',
   bio: '',
   email: '',
  }
}`

export const User = ({ username }) => (
 <Query query={GET_USER_QUERY} variables={{ username }}>
  {({loading, data, error}) => {
    return (
     <h1>
      {data.user.username} can be reached at {data.user.emai}
     </h1>
    )
  }}
 </Query>
)


describe('Query returns proper user object', () => {
 
 const userData = () => {
 }


 it('returns a user object properly', async () => {
  const expected = {
   data: {
    user: {
     id: '',
     username: '',
     userProfileImage: '',
     bio: '',
     email: '',
    }
   }

  },

  const actual;
 })

 it('user also has ReviewList and LikedReviews object', async () => {

 })
})