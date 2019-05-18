import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import plus from '../../img/plus.png'
import moment from 'moment'
import star from '../../img/star.png'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import './ProjectList.scss'

export const GET_PROJECTS = gql`
  query projects($email: String!) {
    projects(where: { User: { email: $email } }, orderBy: timestamp_DESC) {
      id
      name
      key
      category
      timestamp
      titleImg
      titleBlurb
      rating
      steps
      User {
        id
        username
        email
      }
    }
  }
`

const GET_USER = gql`
  query user($email: String!) {
    user(where: { email: $email }) {
      id
      username
    }
  }
`

class ProjectList extends React.Component {
  render() {
    const json = localStorage.getItem('authUser')
    const user = JSON.parse(json)
    const email = this.props.email || user.email

    const ProjectListWithData = () => (
      <Query query={GET_PROJECTS} variables={{ email: email }}>
        {({
          loading: projectsLoading,
          error: projectsError,
          data: projectsData,
        }) => (
          <Query query={GET_USER} variables={{ email: email }}>
            {({ loading: userLoading, data: userData, error: userError }) => {
              if (projectsLoading || userLoading)
                return (
                  <div className="project-list-all-container">
                    <SkeletonTheme highlightColor="#6fb3b8">
                    <div className="project-list-container">
                    <div className="project-list-card">
                        <div>
                          
                            <div
                              className="project-list-card-img">
                              <Skeleton height={280} width={350}/>
                              </div>
                            
                            <p><Skeleton width={380}/></p>
                          
                        </div>
                      </div>
                      <div className="project-list-card">
                        <div>
                          
                            <div
                              className="project-list-card-img">
                              <Skeleton height={280} width={350}/>
                              </div>
                            
                            <p><Skeleton width={380}/></p>
                          
                        </div>
                      </div>
                      <div className="project-list-card">
                        <div>
                          
                            <div
                              className="project-list-card-img">
                              <Skeleton height={280} width={350}/>
                              </div>
                            
                            <p><Skeleton width={380}/></p>
                          
                        </div>
                      </div>
                      </div>
                    </SkeletonTheme>
                  </div>
                )
              if (projectsError || userError)
                return <span>{`Error: ${userError}`}</span>

              if (projectsData.projects[0]) {
                return (
                  <div className="project-list-all-container">
                    <h1 className="project-list-title">{`${
                      userData.user.username
                    }'s Projects`}</h1>
                    <div className="project-list-container">
                      {projectsData.projects.map((project) => {
                        const stars = []

                        for (let i = 0; i < Math.round(project.rating); i++) {
                          stars.push(
                            <img
                              src={star}
                              className="stars"
                              alt="star"
                              key={i}
                            />
                          )
                        }
                        return (
                          <div className="project-list-card" key={project.id}>
                            <div>
                              <img
                                className="project-list-card-img"
                                src={`${project.titleImg}`}
                                alt="project"
                              />
                              <Link to={`/projects/${project.id}`}>
                                <div className="project-list-card-title">{`${
                                  project.name
                                }`}</div>
                              </Link>
                              <p>
                                {moment(project.timestamp).format(
                                  'MMMM Do YYYY'
                                )}
                              </p>
                              <div className="project-list-card-rating-container">
                                {stars.map((star) => {
                                  return star
                                })}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div className="project-list-card">
                        <div>
                          <Link to="/createproject">
                            {/* <div className="image"> */}
                            <img
                              className="project-list-card-img"
                              src={plus}
                              alt="plus"
                            />
                            {/* </div> */}
                            <p>Add a New Project</p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div className="project-list-all-container">
                    <h1 className="project-list-title">{`${
                      userData.user.username
                    }'s Projects`}</h1>
                    <div className="project-list-card">
                      <div>
                        <Link to="/createproject">
                          {/* <div className="image"> */}
                          <img
                            className="project-list-card-img"
                            src={plus}
                            alt="plus"
                          />
                          {/* </div> */}
                          <p>Add a New Project</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              }
            }}
          </Query>
        )}
      </Query>
    )
    return <ProjectListWithData />
  }
}

export default ProjectList
