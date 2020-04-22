import Dexie from "dexie";
import initialNotes from "./initialNotes";
import slugify from "slugify";

export const LIST_SIZE = 100;

export interface UserNoteFields {
  title: string;
  tags: string[];
  md: string;
}

export interface AutoNoteFields {
  modified: number;
  slug: string;
  id?: number;
}

export interface Note extends UserNoteFields, AutoNoteFields {}

export interface UnsavedNote extends UserNoteFields, Partial<AutoNoteFields> {}

export class NotesDB extends Dexie {
  notes: Dexie.Table<Note, number>;

  constructor() {
    super("NotesDB");

    this.version(1).stores({
      notes: "++id, &title, *tags, modified, &slug",
    });
    this.notes = this.table("notes");

    this.on("populate", () => {
      this.notes.bulkAdd(initialNotes);
    });
  }

  async get(slug: string) {
    return this.notes.get({ slug });
  }

  async create(note: UserNoteFields) {
    const id = await this.notes.add({
      ...await this.validate(note),
      slug: slugify(note.title, { lower: true }),
      modified: Date.now(),
      tags: note.tags.filter((t) => Boolean(t)),
    });
    return (await this.notes.get(id)) as Note;
  }

  async list(start: number = 0) {
    return this.notes
      .orderBy("modified")
      .reverse()
      .offset(start)
      .limit(LIST_SIZE)
      .toArray();
  }

  async listWithFilter(filter: string, start: number = 0) {
    return this.notes
      .where("title")
      .startsWithIgnoreCase(filter)
      .or("tags")
      .startsWithIgnoreCase(filter)
      .offset(start)
      .limit(LIST_SIZE)
      .toArray();
  }

  async update(noteId: number, note: UserNoteFields) {
    if (!noteId) {
      throw new Error("invalid note id");
    }
    await this.notes.update(noteId, {
      ...await this.validate(note),
      slug: slugify(note.title, { lower: true }),
      modified: Date.now(),
      tags: note.tags.filter((t) => Boolean(t)),
    });
    return (await this.notes.get(noteId)) as Note;
  }

  async remove(noteId: number) {
    return await this.notes.delete(noteId);
  }

  async validate(note: UserNoteFields) {
    if (!note.title) {
      throw new Error("title is required");
    }

    return note;
  }
}

export const db = new NotesDB();
