[![build](https://github.com/jhackshaw/ofnotes/workflows/ofnotes/badge.svg)](https://github.com/jhackshaw/ofnotes/actions)
[![codecov](https://codecov.io/gh/jhackshaw/ofnotes/branch/master/graph/badge.svg)](https://codecov.io/gh/jhackshaw/ofnotes)

## About

This project is an offline note taking app using react, indexeddb, and redux.

Try it at [ofnote.site](https://wwww.ofnote.site).


![Screen Shot](https://i.ibb.co/S7YG5fm/Screenshot-2019-11-04-React-App.png)


### Features

 - **Markdown**: write your notes in github flavored markdown
 - **Tagging**: tag your notes to make finding them quicker and easier
 - **Indexeddb**: store a plethora of notes without taking a performance hit - all of your notes are indexed


### Design Choices

#### Redux

Designed in a way that adding online syncing functionality can be easily accomplished. Currently visible notes are all stored as redux state, but asynchronous actions ensure that they are up-to-date with the database. API queries could be added alongside DB queries to update online storage in the future.

#### Indexeddb

All notes are indexed by title, tags, and modified date for extremely fast searches. Compared to localStorage, indexeddb searches are asynchronous, indexed, and store notes in their native format (e.g. objects). With localStorage, 10MBs worth of notes is the max. Indexeddb supports up to 999MB with user permission (that's a lot of notes!).

#### testing

Tests are all inside of the __tests__/ directory. React-testing-library is used for rendering components and querying the rendered state. Sinon is used for stubbing out DB queries for unit tests.

### Continous Integration

See .github/workflows/ofnotes.yml for CI configuration. Every merge with master triggers the following:

 1. install dependencies ```(npm ci)```
 2. run tests ```(npm run test)```
 3. build production application ```(npm run build)```
 4. deploy application (use github secrets creds to upload to aws s3 bucket)