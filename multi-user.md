# Multi-User Functionality

User table:

Movies table -- gets updated -- master list of all items on all lists
- maybe don't need to delete items from movies table

## Table: movies
....

## Table: `list_items`
id => list_details | id => movies |
:---------------:|-----------------:|
List1 | 12356
List1 | 123465
List2 | 14563465

## Table: `list_details`
ListID | ListName |
:-----:|:--------:|
001 | Cartoons
002 | Sci-Fi

## Table: `user_lists` (much later...)
UserID | ListID
-----| ------
User1 | List1
User2 | List2
User3 | List3

## Table: `user_watched_list` (even later...)
UserID | ShowID
:--: | :--:
User1 | 13435
User1 | 235435
User2 | 44234
User2 | 13435

### Options for flow:
- Persist in a navbar
  - Dropdown list of names (listnames / usernames)
  - Selected listID stored in state

---

### Step 1
- Choose a list
- Retrieve items off that list

## Flow of `POST`ing new item to a list:
1. App sends array of one or more `movieId`s as JSON to `/lists/:listId`


(http://3i2lq13pvwgh2ffbbxk9da411le.wpengine.netdna-cdn.com/wp-content/uploads/2015/11/tv.jpg)
