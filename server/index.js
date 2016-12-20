import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';

var knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'elmer-02.db.elephantsql.com',
    user: 'gphrldmg',
    password: 'hcI5frNj5V4-HbZui9QHgFEyzaq30FDC',
    database: 'gphrldmg'
  },
  debug: true
});

const HOST = process.env.HOST;
const PORT = process.env.PORT || 8080;

console.log(`Server running in ${process.env.NODE_ENV} mode`);

const app = express();

app.use(express.static(process.env.CLIENT_PATH));

app.use(bodyParser.json());

app.get('/movies', function(req, res) {
  knex('movies').select('*')
  .then(movies => {
    console.log(movies);
    res.status(200).json(movies);
  })
  .catch(error=> res.sendStatus(422));
});

app.get('/movies/:movieId', function(req, res) {
  knex('movies').select('*').where({id: req.params.movieId})
  .then(movie => {
    res.status(200).json(movie);
  })
  .catch(error=> res.sendStatus(422));
});

function runServer() {
  return new Promise((resolve, reject) => {
    app.listen(PORT, HOST, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      }

      const host = HOST || 'localhost';
      console.log(`Listening on ${host}:${PORT}`);
    });
  });
}

if (require.main === module) {
  runServer();
}
