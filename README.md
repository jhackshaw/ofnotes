
[![build](https://github.com/jhackshaw/ofnotes/workflows/ofnotes/badge.svg)](https://github.com/jhackshaw/ofnotes/actions)
[![codecov](https://codecov.io/gh/jhackshaw/ofnotes/branch/master/graph/badge.svg)](https://codecov.io/gh/jhackshaw/ofnotes)
![GitHub last commit](https://img.shields.io/github/last-commit/jhackshaw/ofnotes)
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://www.ofnote.site)
![GitHub](https://img.shields.io/github/license/jhackshaw/ofnotes)

# About

Ofnote is a note taking application that is completely offline. All notes are stored locally per browser.

![Screen Shot](https://i.ibb.co/S7YG5fm/Screenshot-2019-11-04-React-App.png)


### Features

 - **Markdown**: notes support [github flavored markdown](https://github.github.com/gfm/)
 - **Tags**: notes can be tagged to make categorizing and finding them quick and easy
 - **Indexeddb**: never run out of storage space for notes
 - **Dark mode**: essential


### Structure

    .
    ├── README.md
    ├── package.json
    |
    ├── .github/
    |    └── worflows/ofnote.yml    # CI configuration
    |
    └── src/
         ├── __tests__/              # test files
         ├── containers/             # containers use and manipulate state
         ├── components/             # components are generally stateless
         ├── db/                     # IndexedDB access / queries
         └── store/                  # redux implementation - actions, reducer, selectors
    
 
 
# Design Choices

### Redux

Managing state using redux allows for edits to immediately propagate throughout the rest of the application. Asynchronous actions (thunks) ensure they maintain consistancy with the IndexedDB database, and online storage support could be integrated into actions easily in the future.

### IndexedDB

Compared to the localStorage API, IndexedDB is asynchronous and indexed. It supports storage of significantly more data in it's native format (localStorage is strings only). In ofnotes, tags, title, and modified date are all indexed for extremely fast searches regardless of the number of notes, and support for 999MB worth of notes is possible with user permission. Dexie provides a more convenient wrapper around the native IndexedDB api.

### React router

Ensures notes are accessible by a distinct URL. This makes it possible to bookmark or navigate to a particular note directly.

### Built with

- [ReactJS](https://reactjs.org/)
- [Material-UI](https://material-ui.com/)
- [Redux](https://redux.js.org/)
- [Dexie](https://dexie.org/)
- [React Router](https://reacttraining.com/react-router/)
- [Marked](https://marked.js.org/)
- [MomentJS](https://momentjs.com/)


# Continuous Integration

GitHub Actions is used for CI/CD by synchronizing with an AWS s3 static site enabled bucket. CI configuration can be viewed at [.github/workflows/ofnotes.yml](https://github.com/jhackshaw/ofnotes/blob/master/.github/workflows/ofnotes.yml). Every push to master triggers the following steps:

 1. Install nodejs and dependencies ```(npm ci)```
 2. Run tests ```(npm run test -- --coverage)```
 3. Upload test coverage to [codecov](https://codecov.io/gh/jhackshaw/ofnotes)
 4. Build production application ```(npm run build)```
 5. Deploy application to s3 bucket


# Local development

[![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](https://www.ofnote.site)

 - Clone repo: git clone https://github.com/jhackshaw/ofnotes
 - Install dependencies: ```npm install```
 - Run tests: ```npm run test```
 - Run tests with code coverage: ```npm run test -- --coverage```
 - Run development server: ```npm run start```








