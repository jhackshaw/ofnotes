import React from "react";
import { render, fakeNote, mocked } from "test-utils";
import { Home } from "pages";
import { useNote } from "hooks";

jest.mock("hooks/useNote");
const noteMock = mocked(useNote);

describe("Home page", () => {
  it("matches snapshot", () => {
    noteMock.mockReturnValue({
      noteId: fakeNote.id,
      note: fakeNote,
      loading: false,
    });
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders welcome note if it exists", () => {
    noteMock.mockReturnValue({
      noteId: fakeNote.id,
      note: fakeNote,
      loading: false,
    });
    const { getByText, queryByText } = render(<Home />);
    expect(getByText(fakeNote.title)).toBeInTheDocument();
    expect(noteMock).toHaveBeenCalled();
    expect(noteMock.mock.calls[0][0]).toEqual("welcome");
    expect(queryByText(/Select a note/)).not.toBeInTheDocument();
  });

  it("renders select note to get started if welcome note does not exist", () => {
    noteMock.mockReturnValue({ noteId: undefined, note: null, loading: false });
    const { getByText } = render(<Home />);
    expect(getByText(/Select a note/)).toBeInTheDocument();
    expect(noteMock).toHaveBeenCalled();
    expect(noteMock.mock.calls[0][0]).toEqual("welcome");
  });

  it("renders nothing when attempting to load welcome note", () => {
    noteMock.mockReturnValue({
      noteId: fakeNote.id,
      note: fakeNote,
      loading: false,
    });
    const { queryByText } = render(<Home />);
    expect(queryByText(/Select a note/)).not.toBeInTheDocument();
  });
});
