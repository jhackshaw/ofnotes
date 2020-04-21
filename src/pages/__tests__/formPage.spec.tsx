import React from "react";
import { render, fakeNote, fireEvent, wait, mocked } from "test-utils";
import { useMediaQuery } from "@material-ui/core";
import { Form } from "pages";
import * as router from "react-router-dom";
import { Note } from "db/db";

jest.mock("@material-ui/core/useMediaQuery");
const mockMediaQuery = mocked(useMediaQuery);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));
const mockRouter = mocked(router);

const mockNoteCtx = {
  getNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
  createNote: jest.fn(),
};

jest.useFakeTimers();

afterEach(() => {
  mockRouter.useParams.mockReset();
  mockMediaQuery.mockReset();
  Object.values(mockNoteCtx).forEach((fn) => fn.mockReset());
});

afterAll(() => {
  jest.restoreAllMocks();
});

interface RenderEditing {
  fullWidth?: boolean;
  note?: Note;
}

const renderPage = async ({ fullWidth = true, note }: RenderEditing = {}) => {
  mockMediaQuery.mockReturnValue(fullWidth);
  mockRouter.useParams.mockReturnValue(note ? { slug: note.slug } : {});
  mockNoteCtx.getNote.mockResolvedValue(note);
  const { queryByLabelText, ...rest } = render(<Form />, {
    noteCtx: mockNoteCtx,
  });
  await wait(() => {
    expect(mockMediaQuery).toHaveBeenCalled();
    expect(mockRouter.useParams).toHaveBeenCalled();
    expect(queryByLabelText("Title")).toBeInTheDocument();
  });
  return { queryByLabelText, ...rest };
};

const renderEditing = async ({
  note = fakeNote,
  fullWidth = true,
}: RenderEditing = {}) => {
  const { queryByLabelText, ...rest } = await renderPage({ note, fullWidth });
  await wait(() => {
    expect(mockNoteCtx.getNote).toHaveBeenCalledTimes(1);
    expect(mockNoteCtx.getNote.mock.calls[0][0]).toEqual(note.slug);
    expect(queryByLabelText("Title")).toHaveValue(note.title);
  });
  return { queryByLabelText, ...rest };
};

const renderCreating = async ({ fullWidth = true }: RenderEditing = {}) => {
  const { queryByLabelText, ...rest } = await renderPage({
    note: undefined,
    fullWidth,
  });
  await wait(() => {
    expect(mockNoteCtx.getNote).not.toHaveBeenCalled();
    expect(queryByLabelText("Title")).toHaveValue("");
  });
  return { queryByLabelText, ...rest };
};

describe("Form page navigation", () => {
  it("matches snapshot", async () => {
    const { asFragment } = await renderEditing();
    expect(asFragment()).toMatchSnapshot();
  });

  it("can switch tabs by clicking", async () => {
    const { getByText, queryByLabelText, queryByText } = await renderEditing({
      fullWidth: false,
    });
    await wait(() => {
      expect(queryByText(fakeNote.title)).not.toBeInTheDocument();
    });
    fireEvent.click(getByText("Preview"));
    await wait(() => {
      expect(queryByLabelText("Title")).not.toBeInTheDocument();
      expect(queryByText(fakeNote.title)).toBeInTheDocument();
    });
  });

  it("can switch tabs by swiping", async () => {
    const { getByTestId, queryByLabelText, queryByText } = await renderEditing({
      fullWidth: false,
    });
    await wait(() => {
      expect(queryByText(fakeNote.title)).not.toBeInTheDocument();
    });
    const container = getByTestId("form-container");

    // swipe right
    fireEvent.touchStart(container, {
      touches: [{ clientX: 25, clientY: 10 }],
    });
    fireEvent.touchMove(container, {
      touches: [{ clientX: 5, clientY: 10 }],
    });
    fireEvent.touchEnd(container);
    await wait(() => {
      expect(queryByLabelText("Title")).not.toBeInTheDocument();
      expect(queryByText(fakeNote.title)).toBeInTheDocument();
    });

    // swipe left
    fireEvent.touchStart(container, {
      touches: [{ clientX: 5, clientY: 10 }],
    });
    fireEvent.touchMove(container, {
      touches: [{ clientX: 25, clientY: 10 }],
    });
    fireEvent.touchEnd(container);
    await wait(() => {
      expect(queryByLabelText("Title")).toBeInTheDocument();
      expect(queryByText(fakeNote.title)).not.toBeInTheDocument();
    });
  });

  it("can open and close delete modal", async () => {
    const { getByText, container } = await renderEditing();
    await wait(() => {
      expect(getByText(fakeNote.title)).toBeInTheDocument();
      expect(getByText("Delete")).toBeInTheDocument();
    });
    fireEvent.click(getByText(/Delete/));
    await wait(() => {
      expect(container.querySelector(".MuiDialog-paper")).toBeInTheDocument();
    });
    fireEvent.click(getByText("Cancel"));
    // TODO: find a way to do this assertion
    await wait(() => {
      expect(container.querySelector(".MuiDialog-paper")).toBeInTheDocument();
    });
  });
});

describe("Form Page edit note", () => {
  it("fills form based on editing note", async () => {
    const { getByLabelText } = await renderEditing();
    await wait(() => {
      expect(getByLabelText("Title")).toHaveValue(fakeNote.title);
      expect(getByLabelText("Note")).toHaveValue(fakeNote.md);
      expect(getByLabelText("Tags")).toHaveValue(fakeNote.tags.join(", "));
    });
  });

  it("renders markdown for editing note", async () => {
    const note = {
      ...fakeNote,
      md: "# test h1",
    };
    const { getByText } = await renderEditing({ note });
    await wait(() => {
      expect(getByText(fakeNote.title)).toBeInTheDocument();
      expect(getByText("test h1")).toBeInTheDocument();
      expect(getByText("test h1")).toHaveClass("MuiTypography-root");
      expect(getByText("test h1")).toHaveAttribute("id", "test-h1");
    });
  });

  it("can delete note", async () => {
    const { getByText, getAllByText } = await renderEditing();
    fireEvent.click(getByText(/Delete/));
    await wait(() => {
      expect(
        getByText(`Permanently delete ${fakeNote.title}?`)
      ).toBeInTheDocument();
    });
    fireEvent.click(getAllByText("Delete")[1]);
    await wait(() => {
      expect(mockNoteCtx.deleteNote).toHaveBeenCalled();
      expect(mockNoteCtx.deleteNote.mock.calls[0][0]).toEqual(fakeNote.id);
    });
  });

  it("can update note title", async () => {
    mockNoteCtx.updateNote.mockResolvedValue({
      ...fakeNote,
      title: "updated title",
    });
    const { getByLabelText, getByText } = await renderEditing();
    await wait(() => {
      expect(getByLabelText("Title")).toHaveValue(fakeNote.title);
    });
    fireEvent.change(getByLabelText("Title"), {
      target: { value: "updated title" },
    });
    await wait(() => {
      jest.runAllTimers();
      expect(getByLabelText("Title")).toHaveValue("updated title");
      expect(mockNoteCtx.updateNote).toHaveBeenCalled();
      expect(mockNoteCtx.updateNote.mock.calls[0][0]).toEqual(fakeNote.id);
      expect(mockNoteCtx.updateNote.mock.calls[0][1]).toMatchObject({
        title: "updated title",
      });
      expect(getByText("updated title")).toBeInTheDocument();
    });
  });

  it("update title handles uniqueness error", async () => {
    const err = new Error();
    Object.assign(err, {
      failures: [{ name: "ConstraintError" }],
    });
    mockNoteCtx.updateNote.mockRejectedValue(err);
    const { getByLabelText, getByText } = await renderEditing();
    await wait(() => {
      expect(getByLabelText("Title")).toHaveValue(fakeNote.title);
    });
    fireEvent.change(getByLabelText("Title"), {
      target: { value: "duplicate title" },
    });
    await wait(() => {
      jest.runAllTimers();
      expect(getByLabelText("Title")).toHaveValue("duplicate title");
      expect(mockNoteCtx.updateNote).toHaveBeenCalled();
      expect(mockNoteCtx.updateNote.mock.calls[0][0]).toEqual(fakeNote.id);
      expect(mockNoteCtx.updateNote.mock.calls[0][1]).toMatchObject({
        title: "duplicate title",
      });
      expect(getByText("Title must be unique")).toBeInTheDocument();
    });
  });

  it("update handles error with a message set", async () => {
    const err = new Error();
    err.message = "test other error message";
    mockNoteCtx.updateNote.mockRejectedValue(err);
    const { getByLabelText, getByText } = await renderEditing();
    await wait(() => {
      expect(getByLabelText("Title")).toHaveValue(fakeNote.title);
    });
    fireEvent.change(getByLabelText("Title"), {
      target: { value: "new title" },
    });
    await wait(() => {
      jest.runAllTimers();
      expect(getByLabelText("Title")).toHaveValue("new title");
      expect(mockNoteCtx.updateNote).toHaveBeenCalled();
      expect(getByText("test other error message")).toBeInTheDocument();
    });
  });

  it("update handles other errors", async () => {
    const err = new Error();
    mockNoteCtx.updateNote.mockRejectedValue(err);
    const { getByLabelText, getByText } = await renderEditing();
    await wait(() => {
      expect(getByLabelText("Title")).toHaveValue(fakeNote.title);
    });
    fireEvent.change(getByLabelText("Title"), {
      target: { value: "other title" },
    });
    await wait(() => {
      expect(getByLabelText("Title")).toHaveValue("other title");
    });
    await wait(() => {
      jest.runAllTimers();
      expect(mockNoteCtx.updateNote).toHaveBeenCalled();
      expect(
        getByText("Something went wrong updating this note")
      ).toBeInTheDocument();
    });
  }, 10000);

  it("can update note markdown", async () => {
    mockNoteCtx.updateNote.mockResolvedValue({
      ...fakeNote,
      md: "# test h2",
    });
    const { getByLabelText, getByText } = await renderEditing();
    await wait(() => {
      expect(getByLabelText("Note")).toHaveValue(fakeNote.md);
    });
    fireEvent.change(getByLabelText("Note"), {
      target: { value: "## test h2" },
    });
    await wait(() => {
      jest.runAllTimers();
      expect(getByLabelText("Note")).toHaveValue("## test h2");
      expect(mockNoteCtx.updateNote).toHaveBeenCalled();
      expect(mockNoteCtx.updateNote.mock.calls[0][0]).toEqual(fakeNote.id);
      expect(mockNoteCtx.updateNote.mock.calls[0][1]).toMatchObject({
        md: "## test h2",
      });
      expect(getByText("test h2")).toBeInTheDocument();
    });
  });

  it("can update note tags", async () => {
    mockNoteCtx.updateNote.mockResolvedValue({
      ...fakeNote,
      tags: ["testing", "is", "awesome"],
    });
    const { getByLabelText, getByText } = await renderEditing();
    await wait(() => {
      expect(getByLabelText("Tags")).toHaveValue(fakeNote.tags.join(", "));
    });
    fireEvent.change(getByLabelText("Tags"), {
      target: { value: "testing is awesome" },
    });
    await wait(() => {
      jest.runAllTimers();
      expect(getByLabelText("Tags")).toHaveValue("testing is awesome");
      expect(mockNoteCtx.updateNote).toHaveBeenCalled();
      expect(mockNoteCtx.updateNote.mock.calls[0][0]).toEqual(fakeNote.id);
      expect(mockNoteCtx.updateNote.mock.calls[0][1]).toMatchObject({
        tags: ["testing", "is", "awesome"],
      });
      expect(getByText("awesome")).toBeInTheDocument();
    });
  });
});

describe("Form page create note", () => {
  it("creates the note on blur of title field", async () => {
    mockNoteCtx.createNote.mockResolvedValue(fakeNote);
    const { getByLabelText, getByText } = await renderCreating();
    fireEvent.change(getByLabelText("Title"), {
      target: { value: "my new note title" },
    });
    await wait(() => {
      expect(getByLabelText("Title")).toHaveValue("my new note title");
    });
    fireEvent.blur(getByLabelText("Title"));
    await wait(() => {
      expect(mockNoteCtx.createNote).toHaveBeenCalled();
      expect(mockNoteCtx.createNote.mock.calls[0][0]).toMatchObject({
        title: "my new note title",
      });
      expect(getByText(fakeNote.title)).toBeInTheDocument();
    });
  });

  it("does not create on blur of a different field", async () => {
    const { getByLabelText } = await renderCreating();
    fireEvent.change(getByLabelText("Note"), {
      target: { value: "# my new note" },
    });
    await wait(() => {
      expect(getByLabelText("Note")).toHaveValue("# my new note");
    });
    fireEvent.blur(getByLabelText("Note"));
    await wait(() => {
      expect(mockNoteCtx.createNote).not.toHaveBeenCalled();
    });
  });

  it("handles uniqueness error for title on create", async () => {
    const err = new Error();
    err.name = "ConstraintError";
    mockNoteCtx.createNote.mockRejectedValue(err);
    const { getByLabelText, getByText } = await renderCreating();
    fireEvent.change(getByLabelText("Title"), {
      target: { value: "duplicate title" },
    });
    await wait(() => {
      expect(getByLabelText("Title")).toHaveValue("duplicate title");
    });
    fireEvent.blur(getByLabelText("Title"));
    await wait(() => {
      expect(mockNoteCtx.createNote).toHaveBeenCalled();
      expect(mockNoteCtx.createNote.mock.calls[0][0]).toMatchObject({
        title: "duplicate title",
      });
      expect(getByText("Title must be unique")).toBeInTheDocument();
    });
  });

  it("handles other errors that have a message set", async () => {
    const err = new Error("Some other error message");
    mockNoteCtx.createNote.mockRejectedValue(err);
    const { getByLabelText, getByText } = await renderCreating();
    fireEvent.change(getByLabelText("Title"), {
      target: { value: "duplicate title" },
    });
    await wait(() => {
      expect(getByLabelText("Title")).toHaveValue("duplicate title");
    });
    fireEvent.blur(getByLabelText("Title"));
    await wait(() => {
      expect(mockNoteCtx.createNote).toHaveBeenCalled();
      expect(getByText("Some other error message")).toBeInTheDocument();
    });
  });

  it("handles other errors with no message set", async () => {
    const err = new Error();
    mockNoteCtx.createNote.mockRejectedValue(err);
    const { getByLabelText, getByText } = await renderCreating();
    fireEvent.change(getByLabelText("Title"), {
      target: { value: "duplicate title" },
    });
    await wait(() => {
      expect(getByLabelText("Title")).toHaveValue("duplicate title");
    });
    fireEvent.blur(getByLabelText("Title"));
    await wait(() => {
      expect(mockNoteCtx.createNote).toHaveBeenCalled();
      expect(
        getByText("Something went wrong creating this note")
      ).toBeInTheDocument();
    });
  });
});
