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