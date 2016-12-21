import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import 'isomorphic-fetch';

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

// ---- GET ----

// TODO: remove
app.get('/movies', function(req, res) {
  knex('movies').select('*')
  .then(movies => {
    console.log(movies);
    res.status(200).json(movies);
  })
  .catch(error=> res.sendStatus(422));
});

// List of lists
app.get('/lists', function(req, res) {
  knex('lists').select('*')
  .then(lists => {
    console.log(lists);
    res.status(200).json(lists);
  })
  .catch(error=> res.sendStatus(422));
});

// Movies on a list
app.get('/lists/:list_id', function({ params }, res) {
  knex('movies')
    .select('*')
    .join('list_items', 'movies.id', '=', 'list_items.show_id')
    .where('list_items.list_id', params.list_id)
  .then(shows => {
    // console.log(`shows on list: ${params.list_id}`, shows);
    res.status(200).json(shows);
  })
  .catch(error=> res.sendStatus(422));
});

// app.get('/movies/:movieId', function(req, res) {
//   knex('movies').select('*').where({id: req.params.movieId})
//   .then(movie => {
//     res.status(200).json(movie);
//   })
//   .catch(error => res.sendStatus(422));
// });

// ---- POST ----

app.post('/movies', function({ body }, res) {
  console.log(body);
  knex('movies').insert(body)

  .then(() => knex('movies').select('*'))

  .then(movies => {
    console.log(movies);
    res.status(202).json(movies);
  })
  .catch(error => {
    console.error(error);
    res.status(409).json({error: error.detail});
  });

});

// ---- DELETE ----

app.delete('/movies/:movieId', function({ params }, res) {

  knex('movies').where('id', params.movieId).del()

  .then(() => knex('movies').select('*'))

  .then(movies => {
    console.log('deleted id', params.movieId);
    res.status(202).json(movies);
  })

  .catch(error => {
    console.error(error);
    res.status(404).json({error: error.detail});
  });

});


// ---- SEARCH API ----
app.get('/search/:query', function({ params }, res) {
  let searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=0469b2e223fa411387635db85c0f4be7&language=en-US&query=${params.query}&page=1&include_adult=false`;
  fetch(searchUrl)
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(data => res.status(200).json(data))
  .catch(err => {
      console.error('searchMoviesError', err);
      res.status(500).json(err);
  });
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
