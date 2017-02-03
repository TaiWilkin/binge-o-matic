var knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.TEST_KNEX_HOST || process.env.KNEX_HOST,
    user: process.env.KNEX_USER_DATABASE || process.env.KNEX_USER_DATABASE,
    password: process.env.KNEX_USER_DATABASE || process.env.KNEX_PASSWORD,
    database: process.env.KNEX_USER_DATABASE || process.env.KNEX_USER_DATABASE
  },
  debug: true
});

modules.export = knex;
