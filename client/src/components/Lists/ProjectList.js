import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import * as math from 'mathjs';

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
`;

const GET_USER = gql`
  query user($email: String!) {
    user(where: { email: $email }) {
      id
      username
    }
  }
`;

class ProjectList extends React.Component {
  render() {
    const json = localStorage.getItem('authUser');
    const user = JSON.parse(json);
    const email = this.props.email || user.email || 'asldkf@gmail.com';

    const ProjectListWithData = () => (
      <Query query={GET_PROJECTS} variables={{ email: email }}>
        {({
          loading: projectsLoading,
          error: projectsError,
          data: projectsData
        }) => (
          <Query query={GET_USER} variables={{ email: email }}>
            {({ loading: userLoading, data: userData, error: userError }) => {
              if (projectsLoading || userLoading) return 'Loading...';
              if (projectsError || userError)
                return <span>{`Error: ${userError}`}</span>;

              if (projectsData.projects[0]) {
                return (
                  <div>
                    <h1>{`${userData.user.username}'s Projects`}</h1>
                    {projectsData.projects.map((project) => {
                      let meanRating = project.rating;
                      if (project.rating.length > 1)
                        meanRating = parseFloat(
                          math.mean(project.rating.slice(1)).toFixed(2)
                        );
                      if (project.rating.length === 1)
                        meanRating = parseFloat(
                          math.mean(project.rating).toFixed(2)
                        );

                      project.rating = meanRating;
                      return (
                        <div key={project.id}>
                          <Link to={`/projects/${project.id}`}>{`${
                            project.name
                          }`}</Link>
                          <div>{`${project.rating}`}</div>
                          <img src={`${project.titleImg}`} alt="project" />
                          <div>{`${project.timestamp}`}</div>
                        </div>
                      );
                    })}
                    <Link to={'/createproject'}>Add a New Project</Link>
                  </div>
                );
              } else {
                return (
                  <div>
                    <h1>{`${userData.user.username}'s Projects`}</h1>
                    <p>You don't have any projects yet.</p>
                    <Link to={'/createproject'}>Add a New Project</Link>
                  </div>
                );
              }
            }}
          </Query>
        )}
      </Query>
    );
    return <ProjectListWithData />;
  }
}

export default ProjectList;
