import React from "react";
import { render } from "@testing-library/react";
import * as router from "react-router-dom";
import { createMemoryHistory } from "history";
import { fireEvent, wait, mocked, fakeNote, fakeNotes } from "test-utils";
import { useNoteContext, ProvideNoteContext } from "hooks";
import { UserNoteFields, db, Note } from "db";

jest.mock("db/db");
const mockDb = mocked(db);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: jest.fn(),
}));
const mockRouter = mocked(router);

interface TestProps {
  handleGet(getNote: (slug: string) => Promise<Note | undefined>): void;
  handleCreate(createNote: (values: UserNoteFields) => void): void;
  handleUpdate(createNote: (id: number, values: UserNoteFields) => void): void;
  handleDelete(createNote: (id: number) => void): void;
  handleSetFilter(setFilter: (value: string) => void): void;
}
const TestComponent: React.FC<TestProps> = ({
  handleGet,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleSetFilter,
}) => {
  const {
    notes,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    filter,
    setFilter,
    onFilterChange,
  } = useNoteContext();

  return (
    <div>
      <div data-testid="notes">{JSON.stringify(notes)}</div>
      <div data-testid="filter">{filter}</div>
      <div data-testid="setFilter" onClick={() => handleSetFilter(setFilter)}>
        {filter}
      </div>
      <input
        data-testid="onFilterChange"
        onChange={onFilterChange}
        value={filter}
      />
      <div data-testid="getNote" onClick={() => handleGet(getNote)} />
      <div data-testid="createNote" onClick={() => handleCreate(createNote)} />
      <div data-testid="updateNote" onClick={() => handleUpdate(updateNote)} />
      <div data-testid="deleteNote" onClick={() => handleDelete(deleteNote)} />
    </div>
  );
};

const mockProps = {
  handleGet: jest.fn(),
  handleCreate: jest.fn(),
  handleUpdate: jest.fn(),
  handleDelete: jest.fn(),
  handleSetFilter: jest.fn(),
};

afterEach(() => {
  Object.values(mockProps).forEach((fn) => fn.mockReset());
  mockDb.get.mockReset();
  mockDb.create.mockReset();
  mockDb.update.mockReset();
  mockDb.remove.mockReset();
  mockDb.list.mockReset();
  mockDb.listWithFilter.mockReset();
});

afterAll(() => {
  jest.restoreAllMocks();
});

const renderTestComponent = async (notes: Note[] = []) => {
  mockDb.list.mockResolvedValue(notes);
  const { getByTestId, ...rest } = render(
    <ProvideNoteContext>
      <TestComponent {...mockProps} />
    </ProvideNoteContext>
  );
  await wait(() => {
    expect(mockDb.list).toHaveBeenCalled();
    expect(getByTestId("filter")).toHaveTextContent("");
  });
  return { getByTestId, ...rest };
};

describe("notes context provider", () => {
  it("lists notes with no filter on first render", async () => {
    const { getByTestId } = await renderTestComponent(fakeNotes);
    await wait(() => {
      expect(getByTestId("notes")).toHaveTextContent(JSON.stringify(fakeNotes));
    });
  });

  it("lists filtered notes on filter change", async () => {
    mockProps.handleSetFilter.mockImplementation((setFilter) => {
      setFilter("new filter");
    });
    const { getByTestId } = await renderTestComponent();
    fireEvent.click(getByTestId("setFilter"));
    await wait(() => {
      expect(mockProps.handleSetFilter).toHaveBeenCalled();
      expect(mockDb.listWithFilter).toHaveBeenCalled();
      expect(mockDb.listWithFilter.mock.calls[0][0]).toEqual("new filter");
    });
  });

  it("handles change events in onFilterChange", async () => {
    mockDb.listWithFilter.mockResolvedValue(fakeNotes);
    const { getByTestId } = await renderTestComponent();
    fireEvent.change(getByTestId("onFilterChange"), {
      target: { value: "changed filter input" },
    });
    await wait(() => {
      expect(mockDb.listWithFilter).toHaveBeenCalled();
      expect(mockDb.listWithFilter.mock.calls[0][0]).toEqual(
        "changed filter input"
      );
      expect(getByTestId("notes")).toHaveTextContent(JSON.stringify(fakeNotes));
    });
  });

  it("create note saves to db and adds to note state", async () => {
    mockDb.create.mockResolvedValue(fakeNote);
    mockProps.handleCreate.mockImplementation((createNote) => {
      createNote({
        title: "new note test title",
      });
    });
    const { getByTestId } = await renderTestComponent();
    fireEvent.click(getByTestId("createNote"));
    await wait(() => {
      expect(mockProps.handleCreate).toHaveBeenCalled();
      expect(mockDb.create).toHaveBeenCalled();
      expect(mockDb.create.mock.calls[0][0]).toMatchObject({
        title: "new note test title",
      });
      expect(getByTestId("notes")).toHaveTextContent(
        JSON.stringify([fakeNote])
      );
    });
  });

  it("delete note updates db and removes from note state", async () => {
    const history = createMemoryHistory();
    history.location.pathname = "/some/path";
    mockRouter.useHistory.mockReturnValue(history);
    mockDb.remove.mockResolvedValue();
    mockProps.handleDelete.mockImplementation((deleteNote) => {
      deleteNote(fakeNotes[0].id);
    });
    const { getByTestId } = await renderTestComponent(fakeNotes);
    fireEvent.click(getByTestId("deleteNote"));
    await wait(() => {
      expect(mockProps.handleDelete).toHaveBeenCalled();
      expect(mockDb.remove).toHaveBeenCalled();
      expect(mockDb.remove.mock.calls[0][0]).toEqual(fakeNotes[0].id);
      expect(getByTestId("notes")).toHaveTextContent(
        JSON.stringify(fakeNotes.slice(1))
      );
      expect(history.location.pathname).toBe("/");
    });
  });

  it("update note updates db and note in state", async () => {
    mockDb.update.mockResolvedValue({
      ...fakeNotes[1],
      title: "new title",
    });
    mockProps.handleUpdate.mockImplementation((updateNote) => {
      updateNote(fakeNote.id, {
        ...fakeNotes[1],
        title: "new title",
      });
    });
    const { getByTestId } = await renderTestComponent(fakeNotes);
    fireEvent.click(getByTestId("updateNote"));
    await wait(() => {
      expect(mockProps.handleUpdate).toHaveBeenCalled();
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.update.mock.calls[0][0]).toBe(fakeNotes[1].id);
      expect(mockDb.update.mock.calls[0][1]).toEqual({
        ...fakeNotes[1],
        title: "new title",
      });
      expect(getByTestId("notes")).toHaveTextContent(
        JSON.stringify([
          fakeNotes[0],
          {
            ...fakeNotes[1],
            title: "new title",
          },
          fakeNotes[2],
        ])
      );
    });
  });

  it("get note queries db by slug", async () => {
    mockDb.get.mockResolvedValue(fakeNote);
    mockProps.handleGet.mockImplementation((getNote) => {
      getNote(fakeNote.slug);
    });
    const { getByTestId } = await renderTestComponent();
    fireEvent.click(getByTestId("getNote"));
    await wait(() => {
      expect(mockProps.handleGet).toHaveBeenCalled();
      expect(mockDb.get).toHaveBeenCalled();
      expect(mockDb.get.mock.calls[0][0]).toEqual(fakeNote.slug);
    });
  });

  describe("context hook must be used within an associated Provider", () => {
    let mockErr: any;

    beforeAll(() => {
      // https://github.com/facebook/jest/pull/5267#issuecomment-356605468
      jest.spyOn(console, "error").mockImplementation(() => {});
      mockErr = mocked(console.error);
    });

    afterAll(() => {
      mockErr.mockRestore();
    });

    it("throws expected error", () => {
      expect(() => render(<TestComponent {...mockProps} />)).toThrow();
    });
  });
});
