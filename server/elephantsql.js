import dotenv from 'dotenv';
dotenv.config();
const KNEX_HOST = process.env.KNEX_HOST;
const KNEX_USER_DATABASE = process.env.KNEX_USER_DATABASE;
const KNEX_PASSWORD = process.env.KNEX_PASSWORD;

var knex = require('knex')({
  client: 'pg',
  connection: {
    host: KNEX_HOST,
    user: KNEX_USER_DATABASE,
    password: KNEX_PASSWORD,
    database: KNEX_USER_DATABASE
  },
  debug: true
});

modules.export = knex;