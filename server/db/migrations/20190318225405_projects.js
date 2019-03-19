
exports.up = function(knex, Promise) {
    return knex.schema.createTable('projects', table => {
      table.increments();
      table.string('title').notNullable();
      table.string('category').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.string('title_image').notNullable();
      table.string('title_blurb')
      table.float('rating').defaultTo(1);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.integer('author_id').unsigned().references('id').inTable('users');
      table.string('steps_array');
      table.string('review_array');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('projects');
  };