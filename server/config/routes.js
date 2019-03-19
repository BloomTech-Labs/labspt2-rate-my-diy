const axios = require('axios');

const projectsDB = require('../db/helpers/projectsDb');

module.exports = server => {
   server.get('/api/v1/projects/:id', getProjects);
   server.get('/api/v1/projects', getProjects);
}

const getProjects = (req, res) => {
    const { id } = req.params;

    projectsDB.get(id)
        .then(projects => {
            res.send(projects);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error fetching projects', error: err });
        });
}