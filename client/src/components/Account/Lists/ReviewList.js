import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ReviewCard from "../ReviewCard/ReviewCard"



// const json = localStorage.getItem("authUser")
// const user = JSON.parse(json)
// const email = user.email
const email = "asldkf@gmail.com"
// console.log({user, email})

const GET_REVIEWS = gql`
query reviews($email: String!){
  projects(where: {Author: {email: $email}} orderBy: timestamp_DESC){
  id
  name
  rKey
  text
  timestamp
  thumbsUp
  thumbsDown
  Author{
    id
    username
    email
  }
  ProjectReviewed{
    id
    name
    titleImg
    timestamp
    User{
      id
      username
    }
  }
  }
}`

const ProjectList = () => (
  <Query query={GET_REVIEWS} variables={{email: email}}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      if (data) console.log(data)
      if (data.projects[0]) 
      {return (
          <div>
            <h1>My Reviews</h1>
                {data.reviews.map(review => {
                  return (
                    <ReviewCard key={review.id} review={review}/>
                  )
                })}
          </div>
    );} else {
      return (
        <div>
        <h1>My Reviews</h1>
        <span>Add some reviews</span>
      </div>
      )
    }
    }}
  </Query>
);

export default ProjectList

