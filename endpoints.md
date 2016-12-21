app.get('/lists'
	returns a list of names and their ids
app.get('/lists/:listId')
	returns a list of movies (our regular get)

app.post('/lists'), body: {name: listname}
	creates a new list, return list of lists
app.post('lists/:listId'), body: movie object
	our regular postS (edit all post commands to this)
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