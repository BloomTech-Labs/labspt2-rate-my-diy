const db = require('../dbConfig');

module.exports = {
    add: function(project) {
        return db('projects').insert(project);
    },
    
    get: function(id) {
        return (id ? db('projects').where('id', id) : db('projects'));
    },

    update: function(id, changes) {
        return db('projects')
        .where('id', id)
        .update(changes)
        .then(count => (count > 0 ? this.get(id) : null ));
    },

    remove: function(id) {
        return db('projects').where('id', id).del();
    }
}