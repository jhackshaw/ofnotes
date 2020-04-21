import React from "react";
import { render, fakeNotes } from "test-utils";
import { NoteList } from "components";

describe("NoteList component", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<NoteList notes={fakeNotes} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("displays relative time as expected", () => {
    const { queryByText } = render(<NoteList notes={fakeNotes} />);
    expect(queryByText(/a few seconds ago/)).toBeInTheDocument(); // note 1
    expect(queryByText(/2 hours ago/)).toBeInTheDocument(); // note 2
    expect(queryByText(/22 days ago/)).toBeInTheDocument(); // note 3
  });

  it("adds tags to notes that have them", () => {
    const note = {
      ...fakeNotes[0],
      tags: ["test", "tag", "here"],
    };
    const { queryByText } = render(<NoteList notes={[note]} />);
    expect(queryByText(/•/)).toBeInTheDocument();
    expect(queryByText(/test, tag, here/)).toBeInTheDocument();
  });

  it("excludes bullet for note with no tags", () => {
    const note = {
      ...fakeNotes[0],
      tags: [],
    };
    const { queryByText } = render(<NoteList notes={[note]} />);
    expect(queryByText(/•/)).not.toBeInTheDocument();
  });
});
