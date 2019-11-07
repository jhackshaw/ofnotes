import db from './db';
import slugify from 'slugify';

// set up for paging, not implemented yet
export const LIST_SIZE = 100;


export const listNotes = (start=0) => (
  db.notes
    .orderBy('modified')
    .reverse()
    .offset(start)
    .limit(LIST_SIZE)
    .toArray()
)


export const listNotesWithFilter = (filter, start=0) => (
  db.notes
    .where('title')
    .startsWithIgnoreCase(filter)
    .or('tags')
    .startsWithIgnoreCase(filter)
    .offset(start)
    .limit(LIST_SIZE)
    .toArray()
)


export const getNoteBySlug = slug => (
  db.notes
    .get({ slug })
)

export const createNote = async note => {
  const id = await db.notes
    .add({
      ...note,
      slug: slugify(note.title),
      modified: Date.now(),
      tags: note.tags.filter(t => Boolean(t))  // no empty tags
    })
  return await db.notes.get(id);
}

export const editNote = async (noteId, note) => {
  // handle some error cases here just in case
  if (!note.title) {
    throw new Error('title is required')
  }
  if (!noteId) {
    throw new Error('invalid note id')
  }
  await db.notes
    .update(noteId, {
      ...note,
      slug: slugify(note.title),
      modified: Date.now(),
      tags: note.tags.filter(t => Boolean(t))
    })
  return await db.notes.get(noteId)
}


export const deleteNote = async noteId => (
  db.notes
    .delete(noteId)
)