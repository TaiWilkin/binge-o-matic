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
  // debug: true,
  pool: { min: 0, max: 3 }
});

const HOST = process.env.HOST;
const PORT = process.env.PORT || 8080;

console.log(`Server running in ${process.env.NODE_ENV} mode`);

const app = express();

app.use(express.static(process.env.CLIENT_PATH));

app.use(bodyParser.json());


// ---- GET FUNCTION ----

const postShow = (body, list_id) => {
  return knex('shows').count('id').where({ id: body.id })
  .then(([{count}]) => {
    if (count > 0) {
      return true;
    }
    console.log('inserting show id', body.id);
    return knex('shows').insert(body);
  })
  .then(() =>
    knex.raw(
      'INSERT INTO list_items ' +
      '(list_id, show_id) ' +
      'values (?, ?) ' +
      'ON CONFLICT DO NOTHING',
      [list_id, body.id]
    )
  );
}


// ---- GET ----

// List of lists
app.get('/lists', function(req, res) {
  knex('lists').select('*')
  .then(lists => {
    res.status(200).json(lists);
  })
  .catch(({ details }) => res.status(422).json({ error: details }));
});

// Movies on a list
app.get('/lists/:listId', function({ params: { listId } }, res) {
  knex('shows')
    .select('*')
    .join('list_items', 'shows.id', '=', 'list_items.show_id')
    .where('list_items.list_id', listId)
  .then(shows => {
    res.status(200).json(shows);
  })
  .catch(({ details }) => res.status(422).json({ error: details }));
});

// ---- POST ----

app.post('/lists/:list_id/show', function({ body, params: { list_id } }, res) {

  knex('shows').count('id').where({id: body.id})
  .then(([{count}]) => {
    if (count > 0) {
      return true;
    }
    console.log('inserting show id', body.id);
    return knex('shows').insert(body);
  })
  .then(() =>
    knex.raw(
      'INSERT INTO list_items ' +
      '(list_id, show_id) ' +
      'values (?, ?) ' +
      'ON CONFLICT DO NOTHING',
      [list_id, body.id]
    )
  )
  .then(() =>
    knex('shows')
    .select('*')
    .join('list_items', 'shows.id', '=', 'list_items.show_id')
    .where('list_items.list_id', list_id)
  )
  .then(shows => {
    res.status(200).json(shows)
  })
  .catch(({ details }) => {
    res.status(422).json({ details })
  });
});

app.post('/lists/:name', function({ params: { name } }, res) {
  knex('lists').insert({ name }).returning('id')
  .then(([id]) => {
    res.status(201).json({ name, id });
  })
  .catch(error => {
    console.error(error);
    res.status(409).json({error: error.detail});
  });
});

// ---- PUT ----

// Rename List
app.put('/lists/:id', ({ body: { name }, params: { id } }, res) => {
  knex('lists')
  .where({ id })
  .update({ name })
  .returning(['id', 'name'])
  .then(listInfo =>
    res.status(200).json(listInfo)
  )
  .catch(err => {
    console.error(err);
    res.status(404).json(err);
  });
});

// TODO: update Watched status on list item
app.put('/lists/:id/:watched', ({ params: { id, watched }}, req) => {


  res.status(400).json({ message: "TODO", id, watched });
});


// ---- DELETE ----

// Deleting a show / season / episodes off of a list
app.delete('/lists/:listId/shows/:movieId', function({ params }, res) {

  knex('public.list_items')
  .where({'show_id': params.movieId, 'list_id': params.listId})
  .del()
  .then(() =>
    knex('shows')
    .where({'parent_show': params.movieId})
    .select('id'))
  .then((ids) => {
    return ids.map(id => id.id);
  })
  .then((ids) =>
    knex('public.list_items')
    .where({'list_id': params.listId})
    .whereIn('show_id', ids).del())
  .then(() =>
    knex('shows')
    .where({'parent_season': params.movieId})
    .select('id'))
  .then((ids) => {
    return ids.map(id => id.id);
  })
  .then((ids) =>
    knex('public.list_items')
    .where({'list_id': params.listId})
    .whereIn('show_id', ids).del())
  .then(() =>
    knex('shows')
    .select('*')
    .join('list_items', 'shows.id', '=', 'list_items.show_id')
    .where('list_items.list_id', params.listId))
  .then(shows => {
    res.status(200).json(shows);
  })
  .catch(error => {
    console.error(error);
    res.status(404).json({error: error.detail});
  });
});

// Delete entire list
app.delete('/lists/:list_id', ({ params: { list_id }}, res) => {
  knex('list_items')
  .where({ list_id })
  .del()
  .then(() =>
    knex('lists')
    .where({ id: list_id })
    .del()
  )
  .then((count) =>
    res.status(205).json({ count })
  )
  .catch(error => {
    console.error(error);
    res.status(404).json({ error });
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


// // ---- SEARCH API SEASONS ----
app.post('/seasons/:listid/:show_id', function({ params: { listid, show_id } }, res) {
  let searchUrl = `https://api.themoviedb.org/3/tv/${show_id}?api_key=0469b2e223fa411387635db85c0f4be7&language=en-US`;
  fetch(searchUrl)
  .then(response => {
    if (!response.ok) {
      const error = new Error(response.statusText);
      error.response = res;
      throw error;
    }
    return response;
  })
  .then(response => response.json())
  .then(data => {
    let seasons = data.seasons.map(season => {
      const seasonObject = {
        title: data.name,
        id: season.id,
        release_date: season.air_date,
        poster_path: season.poster_path,
        media_type: 'season',
        parent_show: data.id,
        number: season.season_number
      }
      return postShow(seasonObject, listid);
    });
    return Promise.all(seasons)
  })
  .then(() => knex('shows').select('*').join('list_items', 'shows.id', '=', 'list_items.show_id')
              .where('list_items.list_id', listid))
  .then(shows => {
    res.status(200).json(shows);
  })
  .catch(err => {
    console.error('searchSeasonsError', err);
    res.status(500).json(err);
  });
});

// // ---- SEARCH API EPISODES ----

app.post('/episodes/:listid/:show_id/:show_season', function({ body, params: { listid, show_id, show_season } }, res) {
  let searchUrl = `https://api.themoviedb.org/3/tv/${show_id}/season/${show_season}?api_key=0469b2e223fa411387635db85c0f4be7&language=en-US`;
  fetch(searchUrl)
  .then(response => {
    if (!response.ok) {
      const error = new Error(response.statusText);
      error.response = res;
      throw error;
    }
    return response;
  })
  .then(response => response.json())
  .then(data => {
    let episodes = data.episodes.map(episode => {
      const episodeObject = {
        id: episode.id,
        title: body.title,
        episode: episode.name,
        release_date: episode.air_date,
        poster_path: episode.still_path,
        media_type: 'episode',
        parent_season: body.id,
        parent_show: body.parent_show,
        number: episode.episode_number
      }
      return postShow(episodeObject, listid);
    });
    return Promise.all(episodes)
  })
  .then(() => knex('shows').select('*').join('list_items', 'shows.id', '=', 'list_items.show_id')
              .where('list_items.list_id', listid))
  .then(shows => {
    res.status(200).json(shows);
  })
  .catch(err => {
    console.error('searchEpisodesError', err);
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
