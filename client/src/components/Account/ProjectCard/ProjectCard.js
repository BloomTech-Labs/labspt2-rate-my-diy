import React from 'react';

<<<<<<< HEAD
const ProjectCard = ({project}) => {
    return (
        <div>
            <div>{`${project.name}`}</div>
            <div>{`${project.rating}`}</div>
            <img alt="Project title." src={`${project.titleImg}`}/>
            <div>{`${project.timestamp}`}</div>
        </div>
    )
}
=======
const ProjectCard = ({ project }) => {
  return (
    <div>
      <div>{`${project.name}`}</div>
      <div>{`${project.rating}`}</div>
      <img src={`${project.titleImg}`} alt="project" />
      <div>{`${project.timestamp}`}</div>
    </div>
  );
};
>>>>>>> 756c6a9a7cc074cb44442952bfd2f36d70332a27

export default ProjectCard;
