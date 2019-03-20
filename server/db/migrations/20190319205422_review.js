
exports.up = function(knex, Promise) {
    return knex.schema.createTable('reviews', table => {
      table.increments();
      table.string('title').notNullable();
      table.string('category').notNullable();
      table.string('body').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.string('title_image');
      table.string('title_blurb')
      table.float('rating').defaultTo(1);
      table.integer('author_id').unsigned().references('id').inTable('users');
      table.integer('project_id').unsigned().references('id').inTable('projects');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('reviews');
  };