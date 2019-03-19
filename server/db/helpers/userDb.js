const db = require('../dbConfig');

module.exports = {
    add: function(user) {
        return db('users').insert(user);
    },
    
    get: function(id) {
        return (id ? db('users').where('id', id) : db('users'));
    },

    update: function(id, changes) {
        return db('users')
        .where('id', id)
        .update(changes)
        .then(count => (count > 0 ? this.get(id) : null ));
    },

    remove: function(id) {
        return db('users').where('id', id).del();
    }
}