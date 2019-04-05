import React from "react";

const ProjectCard = ({project}) => {
    return (
        <div>
            <div>{`${project.name}`}</div>
            <div>{`${project.rating}`}</div>
            <img src={`${project.titleImg}`} alt="project"/>
            <div>{`${project.timestamp}`}</div>
        </div>
    )
}

export default ProjectCard