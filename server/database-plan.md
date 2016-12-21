# Multi-List Structure

## Tables
### movies
movieId | Title | url
---|---|---
123 | Star Wars | http://images.com/123456.jpg
124 | Empire Strikes Back | http://images.com/123457.jpg

### list_items (join table)
listID | movieId
-------| ------
List1  | 12356
List1  | 123465
List2  | 14563465

### lists
ListID | ListName
-----|:-----:
0001 | Cartoons
0002 | Sci-Fi

### UserLists (much later...)
UserID | ListID
-----| ------
User1 | List1
User2 | List1
User1 | List2

---

## Endpoints:

```js
app.get('/lists'
    // returns a list of names and their ids

app.get('/lists/:listId')
    // returns a list of movies (our regular get)

app.post('/lists' // body: {name: listname}    TODO
    // creates a new list
    () => {
      listId: 12345,
      name: "Star Wars Collection"
    }

app.post('lists/:listId') //, body: movie object  TODO
    // our regular posts (edit all post commands to this)
    // add to movies table only if not already in it
    // regardless of prior step, add movie.id to ListContent table

app.post('episodes/:listId/:showId/:seasonId')

app.delete('/lists/:listId')
    // deletes the whole list

app.delete('lists/:listId/:id')
    // deletes item off of list and its children off the list
    // (get the ids of all items that need to be deleted,
    // THEN delete from listTable)

app.put('/lists/:listId') //, body: {name: listname}
    // change list name, return list of Lists?

app.put('/lists/:listId') //, body: {watched: true/false}
    // change whether show is marked as watched```

# starting with a new DB here...

User does a search...
Results sent back to App (not put in movies table)

User adds an item to UserList
- sends Movie object to /list/:listId endpoint
1. Server adds Movie to Movies table
2. Server adds ListID / MovieId to ListContent table
