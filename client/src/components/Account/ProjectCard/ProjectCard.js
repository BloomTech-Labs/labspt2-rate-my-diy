import React from 'react';

const ProjectCard = ({ project }) => {
  let steps = JSON.parse(project.steps);

  return (
    <div>
      <h1>{`${project.name}`}</h1>
      <div>{`${project.User.username}`}</div>
      <div>{`${project.rating}`}</div>
      <div>{`${project.timestamp}`}</div>
      <img src={`${project.titleImg}`} alt="project" />
      {steps.map((step) => {
        if (step.type === 'img') {
          return <img key={step.body} src={step.body} />;
        } else {
          return <div key={step.body}>{`${step.body}`}</div>;
        }
      })}
    </div>
  );
};

export default ProjectCard;
