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
  debug: true,
  pool: { min: 0, max: 4 }
});

const HOST = process.env.HOST;
const PORT = process.env.PORT || 8080;

console.log(`Server running in ${process.env.NODE_ENV} mode`);

const app = express();

app.use(express.static(process.env.CLIENT_PATH));

app.use(bodyParser.json());

// ---- GET ----

app.get('/movies', function(req, res) {
  knex('movies').select('*')
  .then(movies => {
    res.status(200).json(movies);
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
  knex('movies').insert(body)

  .then(() => knex('movies').select('*'))

  .then(movies => {
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


// ---- SEARCH API MEDIA----
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


// ---- SEARCH API SEASONS ----
app.post('/seasons/:show_id', function({ params }, res) {
  let searchUrl = `https://api.themoviedb.org/3/tv/${params.show_id}?api_key=0469b2e223fa411387635db85c0f4be7&language=en-US`;
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
  .then(data => {
    const seasonPromises = data.seasons.map(season => {
      return knex('movies').insert({
        title: data.name,
        id: season.id,
        release_date: season.air_date,
        poster_path: season.poster_path,
        media_type: 'season',
        parent_show: data.id,
        number: season.season_number 
      })
    })
    return Promise.all(seasonPromises)
  })
  .then(() => knex('movies').select('*'))
  .then(movies => {
    res.status(202).json(movies);
  })
  .catch(err => {
    console.error('searchSeasonsError', err);
    res.status(500).json(err);
  });
});

// ---- SEARCH API EPISODES ----

app.post('/episodes/:show_id/:show_season', function(req, res) {
  let searchUrl = `https://api.themoviedb.org/3/tv/${req.params.show_id}/season/${req.params.show_season}?api_key=0469b2e223fa411387635db85c0f4be7&language=en-US`;
  console.log("SEARCH URL:", searchUrl);
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
  .then(data => {
    const episodesPromises = data.episodes.map(episode => {
      return knex('movies').insert({
        id: episode.id,
        title: req.body.title,
        episode: episode.name,
        release_date: episode.air_date,
        poster_path: episode.still_path,
        media_type: 'episode',
        parent_season: req.body.id,
        parent_show: req.body.parent_show,
        number: episode.episode_number
      })
    })
    return Promise.all(episodesPromises)
  })
  .then(() => knex('movies').select('*'))
  .then(movies => {
    res.status(202).json(movies);
  })
  .catch(err => {
    console.error('searchSeasonsError', err);
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
