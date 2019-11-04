
## About

This project is an offline note taking app using react, indexeddb, and redux.


### Features

 - Markdown: write your notes in markdown
 - Tagging: tag your notes to group them and find them easier
 - Indexeddb: store a plethora of notes without taking a performance hit - all of your notes are indexed


### Design Choices

 - Redux

 Although not strictly necessary for this app, designing with redux in mind leaves the possiblity of future *online* state managment open. The app is set up such that requests to api's can easily be added in the actions.
