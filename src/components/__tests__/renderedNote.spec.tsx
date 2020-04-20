import React from "react";
import { render } from "test-utils";
import { RenderedNote } from "components";
import { UnsavedNote } from "db";

describe("RenderedNote component", () => {
  const defaultNote: UnsavedNote = {
    title: "Test Note",
    md: "# test note header",
    tags: [],
  };

  it("matches snapshot", () => {
    const { asFragment } = render(<RenderedNote note={defaultNote} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("applies adjusted header typography styles", () => {
    const classNames = [
      "MuiTypography-h3",
      "MuiTypography-h4",
      "MuiTypography-h5",
      "MuiTypography-h6",
      "MuiTypography-body1",
      "MuiTypography-body1",
    ];

    classNames.forEach((name, idx) => {
      const note = {
        ...defaultNote,
        md: "#".repeat(idx + 1) + " test title",
      };
      const { getByText, unmount } = render(<RenderedNote note={note} />);
      expect(getByText("test title")).toHaveClass(name);
      unmount();
    });
  });

  it("renders blockquotes using MUI paper component", () => {
    const note = {
      ...defaultNote,
      md: "\n> test note\n\n",
    };
    const { container, getByText } = render(<RenderedNote note={note} />);
    expect(
      container.querySelector("blockquote.MuiPaper-root")
    ).toBeInTheDocument();
    expect(getByText("test note")).toBeInTheDocument();
  });

  it("renders tags at the end using chip", () => {
    const note = {
      ...defaultNote,
      tags: ["test", "tag"],
    };
    const { getByText } = render(<RenderedNote note={note} />);
    expect(getByText("test")).toHaveClass("MuiChip-label");
    expect(getByText("tag")).toHaveClass("MuiChip-label");
  });

  it("highlights code blocks with hljs", async () => {
    const note = {
      ...defaultNote,
      md: `
\`\`\`python

y = [x for x in range(30)]
print(y)

\`\`\`
`,
    };
    const { container } = render(<RenderedNote note={note} />);
    const rootCode = container.querySelector("code");
    expect(rootCode).toBeInTheDocument();
    expect(rootCode).toHaveClass("hljs", "lang-python");
  });

  it("renders task list with MUI checkbox", async () => {
    const note = {
      ...defaultNote,
      md: "\n[ ] to do\n",
    };
    const { container } = render(<RenderedNote note={note} />);
    expect(container.querySelector(".MuiButtonBase-root")).toBeInTheDocument();
    expect(
      container.querySelector("input[type='checkbox']")
    ).toBeInTheDocument();
  });

  it("renders links using MUI Link component", () => {
    const note = {
      ...defaultNote,
      md: "\n[test link](https://github.com/jhackshaw/ofnotes)\n",
    };
    const { getByText } = render(<RenderedNote note={note} />);
    expect(getByText("test link")).toHaveClass("MuiLink-root");
  });

  it("renders tables", () => {
    const note = {
      ...defaultNote,
      md: `

| Tables   |      Are         |  Cool |
|--------------|-------------------|-----------|
| Row 1   |  this table   | $1600 |
| Row 2   |    uses         |   $12 |
| Row 3.  | material-ui |    $1 |
             
`,
    };
    const { getByText, container } = render(<RenderedNote note={note} />);
    expect(
      container.querySelector("div.MuiPaper-root.MuiTableContainer-root")
    ).toBeInTheDocument();
    expect(getByText("Tables")).toHaveClass("MuiTableCell-head");
    expect(getByText("Row 1")).toHaveClass("MuiTableCell-body");
  });
});
