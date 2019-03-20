const axios = require('axios');

const projectsDB = require('../db/helpers/projectsDb');
const usersDB = require('../db/helpers/userDb');
const reviewsDB = require('../db/helpers/reviewDb');

module.exports = server => {
   server.get('/api/v1/projects/:id', getProjects);
   server.get('/api/v1/projects', getProjects);
   server.get('/api/v1/projects/current/:date', getProjectsByDate);
   server.get('/api/v1/users/:id', getUsers);
   server.get('/api/v1/users', getUsers);
   server.get('/api/v1/reviews/:id', getReviews);
   server.get('/api/v1/reviews', getReviews);
   server.get('/api/v1/reviews/current/:date', getReviewsByDate);
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

const getProjectsByDate = (req, res) => {
    const { date } = req.params;

    projectsDB.getByDate(date)
        .then(projects => {
            res.send(projects);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error fetching projects', error: err });
        });
}

const getReviews = (req, res) => {
    const { id } = req.params;

    reviewsDB.get(id)
        .then(reviews => {
            res.send(reviews);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error fetching reviews', error: err });
        });
}

const getReviewsByDate = (req, res) => {
    const { date } = req.params;

    reviewsDB.getByDate(date)
        .then(reviews => {
            res.send(reviews);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error fetching reviews', error: err });
        });
}

const getUsers = (req, res) => {
    const { id } = req.params;

    usersDB.get(id)
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error fetching users', error: err });
        });
}