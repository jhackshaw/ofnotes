import 'fake-indexeddb/auto';

import db from '../db/db';
import * as queries from '../db/queries';


describe('idempotent db', () => {
  const modified = Date.now();
  const allNotes = [
    { 
      id: 1, 
      title: 'test 1 awesome note', 
      slug: 'test-1', 
      modified,
      tags: ['es6']
    },
    { 
      id: 2, 
      title: 'test 2 awesome note', 
      slug: 'test-2', 
      modified: modified-5,
      tags: ['python']
    },
    { 
      id: 3, 
      title: 'test 3 awesome note', 
      slug: 'test-3', 
      modified: modified-10,
      tags: ['react', 'extreme']
    }
  ]

  beforeAll(async () => {
    await db.notes.clear()
    await db.notes.bulkAdd(allNotes)
  })

  afterAll(async () => {
    await db.notes.clear()
  })

  it('list notes returns all notes as array', async () => {
    const result = await queries.listNotes();
    expect(result).toHaveLength(3)
    expect(result).toMatchObject(allNotes)
  })

  it('filters notes starting with defined filter', async () => {
    const result = await queries.listNotesWithFilter('test 2');
    expect(result).toHaveLength(1)
    expect(result).toMatchObject([
      allNotes[1]
    ])
  })

  it('ignores filter case', async () => {
    const result = await queries.listNotesWithFilter("tESt");
    expect(result).toHaveLength(3)
    expect(result).toMatchObject(allNotes)
  })

  it('filters on tags as well', async () => {
    let result = await queries.listNotesWithFilter('p')
    expect(result).toHaveLength(1)
    expect(result).toMatchObject([
      allNotes[1]
    ])
    result = await queries.listNotesWithFilter('E')
    expect(result).toHaveLength(2)
    expect(result).toMatchObject([
      allNotes[0],
      allNotes[2]
    ])
  })

  it('can get note by slug', async () => {
    const result = await queries.getNoteBySlug('test-1');
    expect(result).toMatchObject(allNotes[0])
  })

  it('slug is case sensitive', async () => {
    const result = await queries.getNoteBySlug('TEST-1')
    expect(result).toBe(undefined)
  })
})


describe('side effect db', () => {
  const testNoteData = {
    title: 'test note',
    tags: ['pytohn', 'react', 'es6'],
    md: '# title tag'
  }

  beforeEach(async () => {
    db.notes.clear()
  })


  it('adds slug and modified to created notes', async () => {
    const expected = {
      ...testNoteData,
      slug: 'test-note'
    }
    const saved = await queries.createNote(testNoteData);
    expect(saved).toMatchObject(expected)
    expect(saved.id).toBeDefined()
    expect(saved.modified).toBeDefined()
    const fromDb = await queries.getNoteBySlug('test-note')
    expect(fromDb).toMatchObject(expected)
    expect(fromDb.id).toBeDefined()
    expect(fromDb.modified).toBeDefined()
  })

  it('cannot create note with same title', async () => {
    const saved = await queries.createNote(testNoteData)
    expect(saved.id).toBeDefined()
    await expect(queries.createNote(testNoteData)).rejects.toMatchObject(/Constraint/)
  })

  it('edit note updates slug and modified', async () => {
    const newData = {
      title: 'updated title',
      tags: ['angular', 'java'],
      md: 'updated md'
    }
    const expected = {
      ...testNoteData,
      ...newData,
      slug: 'updated-title'
    }
    const saved = await queries.createNote(testNoteData);
    expect(saved.id).toBeDefined()
    expect(saved.modified).toBeDefined()
    const updated = await queries.editNote(saved.id, newData);
    expect(updated).toMatchObject(expected)
    expect(updated.modified).toBeGreaterThanOrEqual(saved.modified)
  })

  it('can successfully delete a note', async () => {
    const saved = await queries.createNote(testNoteData);
    expect(saved.id).toBeDefined()
    expect(saved.slug).toEqual('test-note')
    await queries.deleteNote(saved.id)
    expect(await queries.getNoteBySlug('test-note'))
      .toBeUndefined()
  })
})