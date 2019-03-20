const db = require('../dbConfig');

module.exports = {
    add: function(review) {
        return db('reviews').insert(review);
    },
    
    get: function(id) {
        return (id ? db('reviews').where('id', id) : db('reviews'));
    },

    getByDate: function(date) {
        return db('reviews').where('created_at', 'like', `${date}%`);
    },

    update: function(id, changes) {
        return db('reviews')
        .where('id', id)
        .update(changes)
        .then(count => (count > 0 ? this.get(id) : null ));
    },

    remove: function(id) {
        return db('reviews').where('id', id).del();
    }
}