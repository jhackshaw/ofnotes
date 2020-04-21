import "fake-indexeddb/auto";
import { db } from "db";
import initialNotes from "../initialNotes";
import { fakeNotes } from "test-utils";
import { wait } from "@testing-library/react";

describe("creates initial notes", () => {
  it("has correct notes", async () => {
    await wait(() => {
      expect(db.list()).resolves.toHaveLength(initialNotes.length);
    });
  });
});

describe("idempotent db", () => {
  beforeAll(async () => {
    await db.notes.clear();
    await db.notes.bulkAdd(fakeNotes);
  });

  afterAll(async () => {
    await db.notes.clear();
  });

  it("list notes returns all notes as array", async () => {
    const result = await db.list();
    expect(result).toHaveLength(3);
    expect(result).toMatchObject(fakeNotes);
  });

  it("filters notes starting with defined filter", async () => {
    const result = await db.listWithFilter("test two");
    expect(result).toHaveLength(1);
    expect(result).toMatchObject([fakeNotes[1]]);
  });

  it("ignores filter case", async () => {
    const result = await db.listWithFilter("tESt TWo");
    expect(result).toHaveLength(1);
    expect(result).toMatchObject([fakeNotes[1]]);
  });

  it("filters on tags as well", async () => {
    let result = await db.listWithFilter("p");
    expect(result).toHaveLength(1);
    expect(result).toMatchObject([fakeNotes[1]]);
  });

  it("can get note by slug", async () => {
    const result = await db.get("test-one");
    expect(result).toMatchObject(fakeNotes[0]);
  });

  it("slug is case sensitive", async () => {
    const result = await db.get("TEST-1");
    expect(result).toBe(undefined);
  });

  it("title is required to update note", async () => {
    expect.assertions(1);
    return expect(
      db.update(1, {
        title: "",
        md: "",
        tags: [],
      })
    ).rejects.toEqual(new Error("title is required"));
  });

  it("noteId is required to update note", async () => {
    expect.assertions(1);
    return expect(
      db.update(undefined!, {
        title: "some title",
        md: "",
        tags: [],
      })
    ).rejects.toEqual(new Error("invalid note id"));
  });
});

describe("side effect db", () => {
  const testNoteData = {
    title: "test note",
    tags: ["pytohn", "react", "es6"],
    md: "# title tag",
  };

  beforeEach(async () => {
    db.notes.clear();
  });

  it("adds slug and modified to created notes", async () => {
    const expected = {
      ...testNoteData,
      slug: "test-note",
    };
    const saved = await db.create(testNoteData);
    expect(saved).toMatchObject(expected);
    expect(saved?.id).toBeDefined();
    expect(saved?.modified).toBeDefined();
    const fromDb = await db.get("test-note");
    expect(fromDb).toMatchObject(expected);
    expect(fromDb?.id).toBeDefined();
    expect(fromDb?.modified).toBeDefined();
  });

  it("cannot create note with same title", async () => {
    const saved = await db.create(testNoteData);
    expect(saved?.id).toBeDefined();
    await expect(db.create(testNoteData)).rejects.toMatchObject(/Constraint/);
  });

  it("update note updates slug and modified", async () => {
    const newData = {
      title: "updated title",
      tags: ["angular", "java"],
      md: "updated md",
    };
    const expected = {
      ...testNoteData,
      ...newData,
      slug: "updated-title",
    };
    const saved = await db.create(testNoteData);
    expect(saved?.id).toBeDefined();
    expect(saved?.modified).toBeDefined();
    const updated = await db.update(saved?.id!, newData);
    expect(updated).toMatchObject(expected);
    expect(updated.modified).toBeGreaterThanOrEqual(saved?.modified!);
  });

  it("can successfully delete a note", async () => {
    const saved = await db.create(testNoteData);
    expect(saved?.id).toBeDefined();
    expect(saved?.slug).toEqual("test-note");
    await db.remove(saved?.id!);
    expect(await db.get("test-note")).toBeUndefined();
  });
});
