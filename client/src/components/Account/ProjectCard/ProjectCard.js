import React from "react";

const ProjectCard = ({project}) => {
    return (
        <div>
            <div>{`${project.name}`}</div>
            <div>{`${project.rating}`}</div>
            <img src={`${project.titleImg}`}/>
            <div>{`${project.timestamp}`}</div>
        </div>
    )
}

export default ProjectCard