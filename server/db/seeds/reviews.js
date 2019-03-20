
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('reviews').del()
    .then(function () {
      // Inserts seed entries
      return knex('reviews').insert([
        {
          title: "This hack is a scam",
          category: "Security",
          body: "This is a scam don't do it. Anonymous are edge and weird",
          title_image: "https://www.kunm.org/sites/kunm/files/styles/x_large/public/201801/Anonymous.jpg",
          title_blurb: "IT'S A SCAM",
          rating: 5.0,
          author_id: 1,
          project_id: 1
        },
        {
          title: "I got in the NSA with this review",
          category: "Security",
          body: "Blah blah blah anonymous blah blah blah NSA",
          title_image: "https://www.kunm.org/sites/kunm/files/styles/x_large/public/201801/Anonymous.jpg",
          title_blurb: "How this guide gave me the secrets of the NSA",
          rating: 1.0,
          author_id: 2,
          project_id: 1
        }
      ]);
    });
};
