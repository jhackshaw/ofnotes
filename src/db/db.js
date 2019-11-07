import Dexie from 'dexie';
import initialNotes from './initialNotes.js'

const db = new Dexie('NotesDB');

/*

indexed fields:

  id: autoincrement-ing integer
  title: unique string
  tags: array of strings
  slug: unique string
  modified: date

*/
db.version(1).stores({
  notes: "++id, &title, *tags, modified, &slug"
})


// this is only fired if the database is created
// for the first time.
db.on('populate', () => {
  db.notes.bulkAdd(initialNotes)
})

export default db;
