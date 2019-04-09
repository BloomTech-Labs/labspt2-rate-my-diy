import React from 'react';

const ProjectCard = ({ project }) => {
  let steps = project.steps.split('1' || '2' || '3' || '4');

  return (
    <div>
      <h1>{`${project.name}`}</h1>
      <div>{`${project.User.username}`}</div>
      <div>{`${project.rating}`}</div>
      <div>{`${project.timestamp}`}</div>
      <img src={`${project.titleImg}`} alt="project" />
    </div>
  );
};

export default ProjectCard;
