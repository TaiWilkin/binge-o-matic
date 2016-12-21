# Multi-User Functionality

User table:

Movies table -- gets updated -- master list of all items on all lists
- maybe don't need to delete items from movies table

## Table: movies
....

## Table: ListContent
ListID (pri key) | Id (foreign key) | Watched?
-------| ------ | -----
List1  | 12356  | true
List1  | 123465  | false
List2  | 14563465 | false

## Table: ListDetails
ListID | ListName | Username
:-----:|----------|----------
001 | Cartoons | %#$^%$&
002 | Sci-Fi |  #$%&#$%&

## UserLists (much later...)
UserID | ListID
-----| ------
User1 | List1
User2 | List2
User3 | List3


----
### Options for flow:
- Persist in a navbar
  - Dropdown list of names (listnames / usernames)
  - Selected listID stored in state



---
### Functional Representation of other users lists
- See all others?
- Have concept of 'friends' vs. strangers?

---

### Step 1
- Choose a list
- Retrieve items off that list

```js
app.get('/lists'
    returns a list of names and their ids

app.get('/lists/:listId')
    returns a list of movies (our regular get)

app.post('/lists'), body: {name: listname}    // TODO
    creates a new list, return list of lists

app.post('lists/:listId'), body: movieId  //
    our regular posts (edit all post commands to this)
    add to movies table only if not already in it
    regardless of prior step, add movie.id to ListContent table

app.post('lists/:listId/episodes/:showId/:seasonId')
    ^doublecheck endpoint!


app.delete('/lists/:listId')
    deletes the whole list

app.delete('lists/:listId/:id')
    deletes item off of list and its children off the list
    (get the ids of all items that need to be deleted, THEN delete from listTable)

app.put('/lists/:listId'), body: {name: listname}
    change list name, return list of Lists?
app.put('/lists/:listId'), body: {watched: true/false}
    change whether show is marked as watched
```


```
starting with a new DB here...

User does a search...
Results sent back to App (not put in movies table)

User adds an item to UserList
- sends Movie object to /list/:listId endpoint
1. Server adds Movie to Movies table
2. Server adds ListID / MovieId to ListContent table
