import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ProjectCard from "../ProjectCard/ProjectCard"



// const json = localStorage.getItem("authUser")
// const user = JSON.parse(json)
// const email = user.email
const email = "asldkf@gmail.com"
// console.log({user, email})

const GET_PROJECTS = gql`
query projects($email: String!){
  projects(where: {User: {email: $email}} orderBy: timestamp_DESC){
    id
    name
    key
    category
    timestamp
    titleImg
    titleBlurb
    rating
    steps
  }
}`

const ProjectList = () => (
  <Query query={GET_PROJECTS} variables={{email: email}}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      if (data) console.log(data)
      if (data.projects[0]) 
      {return (
          <div>
            <h1>My Projects</h1>
                {data.projects.map(project => {
                  return (
                    <ProjectCard key={project.id} project={project}/>
                  )
                })}
          </div>
    );} else {
      return (
        <div>
        <h1>My Projects</h1>
        <span>Add some projects</span>
      </div>
      )
    }
    }}
  </Query>
);

export default ProjectList
