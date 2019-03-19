
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('username').unique().notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.float('rating').defaultTo(1);
    table.string('profile_image').defaultTo('https://cdn-images-1.medium.com/max/1200/1*aZB4dwe_JRcp1uMHiGYf8g.jpeg');
    table.string('privileges').defaultTo('user');
    table.string('account_type').defaultTo('Plebian');
  });
};

exports.down = function(knex, Promise) {
  
};
