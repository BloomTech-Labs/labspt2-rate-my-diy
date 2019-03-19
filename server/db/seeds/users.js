
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: "lucy.grandma",
          email: "lucy.grandma@gmail.com",
          profile_image: "http://www.movin925.com/wp-content/uploads/2015/09/bigstock-Angry-Old-Woman-With-A-Pan-94221812-660x330.jpg",
          password: "123"
        },
        {
          username: "luis.alvarez",
          email: "something@ymail.com",
          password: "123"
        },
        {
          username: "anonymous.101",
          password: "123",
          email: "anonymous.101@gmail.com",
          profile_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1200px-Anonymous_emblem.svg.png"
        }
      ]);
    });
};
