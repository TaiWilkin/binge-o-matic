![Binge-o-matic](/client/assets/binge-o-matic.png)

Link: https://afternoon-ravine-77077.herokuapp.com/

## Description

A watchlist management app for the binge-watcher: maintain a platform-neutral watch-list of shows, manage spin-offs and series, and organize viewing in chronological release order.

## Screenshots

### Full List

![full page](/client/assets/full-page.png)

### Main Page

![main page](/client/assets/main.png)

### List Items Close-Up

![user list](/client/assets/user-list.png)

### List Header Close-Up

![user list header](/client/assets/user-list-top.png)

## Tech Stack

- DB: cloud-hosted PostgreSQL instance

- Server: Node, Express, Knex

- Client: React, Redux, Thunk

## Component Locations


# Database Structure

## Tables
#### `shows`
 id  | title | path, etc.
:---:|:------|:----------:
123 | _Star Wars_ | `/123456.jpg`
124 | _Empire Strikes Back_ | `/123457.jpg`

#### `list_items`
listID | movieId | watched
:-----:| :-----: | :---:
1  | 123 | true
1  | 124 | true
2  | 123 | false

#### `lists`
ListID | ListName
-----|:-----:
1 | Cartoons
2 | Sci-Fi

## TODO

#### `users`
UserID | ListID
-----| ------
User1 | List1
User2 | List1
User1 | List2

- based on shared list functionality
- would also need concept of list ownership
  - add column in `lists` table with user owner ID

---

## Endpoints:

- [x] app.get('/lists')
  - returns a list of names and their ids

- [x] app.get('/lists/:listId')
  - returns a list of movies on specified list

- [x] app.post('/lists/:name')
  - creates a new list
  - response: `{ listId: 12345, name: "Star Wars Collection" }`

- [x] app.post('lists/:listId/show')
  - body: movie / season / episode
  - add to movies table only if not already in it
  - in all cases, add movie.id / listId to ListContent table

- [x] app.post('lists/:listname')
  - create new list
  - res: {id, name}

- [x] app.post('episodes/:listId/:showId/:seasonId')

- [x] app.delete('/lists/:listId')
  - deletes the whole list
  - first delete matching `list_content` rows
  - then delete list from `lists`

- [x] app.delete('lists/:listId/:id')
  - deletes item off of list and its children off the list
  - (get the ids of all items that need to be deleted,
  - THEN delete from listTable)

- [x] app.put('/lists/:listId')
  - res: {name: listname}
  - change list name, return {listid: id, name: listname}

- [x] app.put('/lists/:listId')
  - body: {watched: true/false}
  - change whether show is marked as watched

![binge-watcher]
(http://3i2lq13pvwgh2ffbbxk9da411le.wpengine.netdna-cdn.com/wp-content/uploads/2015/11/tv.jpg)
