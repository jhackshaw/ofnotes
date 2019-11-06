import Dexie from 'dexie';
import initialNotes from './initialNotes.js'

const db = new Dexie('NotesDB');

db.version(1).stores({
  notes: "++id, &title, *tags, modified, slug"
})

db.on('populate', () => {
  db.notes.add(initialNotes[0])
})

export default db;
