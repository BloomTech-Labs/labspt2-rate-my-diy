
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('projects').del()
    .then(function () {
      // Inserts seed entries
      return knex('projects').insert([
        {
          title: "Hack the NSA",
          category: "Security",
          title_image: "https://www.kunm.org/sites/kunm/files/styles/x_large/public/201801/Anonymous.jpg",
          title_blurb: "Let me show you how to hack the NSA",
          rating: 3.5,
          author_id: 3
        },
        {
          title: "GraphQL Tutorial",
          rating: 5,
          title_image: "https://graphql.org/img/og_image.png",
          title_blurb: "A GraphQL tutorial",
          category: "tech",
          author_id: 2
        },
        {
          title_blurb: "Knitting sweaters for my nephews",
          title: "Knitting sweaters",
          rating: 4.2,
          title_image: "https://3.bp.blogspot.com/-7Bstxi6NY4I/V40ZokQvXNI/AAAAAAAAFaE/60RbEP54uwg-2jFhywH1j9vuhyB3-AEFgCLcB/s1600/IMG_4479.JPG",
          category: "knitting",
          author_id: 1
        }
      ]);
    });
};
