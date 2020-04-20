import React from "react";
import { render, fireEvent, wait } from "test-utils";
import { NoteForm } from "components";

describe("NoteForm component", () => {
  const changeMock = jest.fn();
  const blurMock = jest.fn();
  const deleteMock = jest.fn();
  const defaultProps = {
    values: {
      title: "",
      md: "",
      tags: [],
    },
    errors: {},
    onChange: changeMock,
    onBlur: blurMock,
    onDelete: deleteMock,
  };

  afterEach(() => {
    changeMock.mockReset();
    blurMock.mockReset();
    deleteMock.mockReset();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<NoteForm {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("includes delete button if specified", () => {
    const props = {
      ...defaultProps,
      showDelete: true,
    };
    const { queryByText } = render(<NoteForm {...props} />);
    expect(queryByText("Delete")).toBeInTheDocument();
  });

  it("excludes delete button by if false", () => {
    const props = {
      ...defaultProps,
      showDelete: false,
    };
    const { queryByText } = render(<NoteForm {...props} />);
    expect(queryByText("Delete")).not.toBeInTheDocument();
  });

  it("passes value and change handler to each field (is controlled)", async () => {
    const props = {
      ...defaultProps,
      values: {
        title: "testTitle",
        md: "testNote",
        tags: ["test", "tags"],
      },
    };
    const { getByLabelText } = render(<NoteForm {...props} />);
    expect(getByLabelText("Title")).toHaveValue("testTitle");
    expect(getByLabelText("Note")).toHaveValue("testNote");
    expect(getByLabelText("Tags")).toHaveValue("test tags");

    ["Title", "Note", "Tags"].forEach((label) => {
      const inp = getByLabelText(label);
      fireEvent.change(inp, {
        target: { value: "testvalue" },
      });
    });
    await wait(() => {
      expect(changeMock).toHaveBeenCalledTimes(3);
    });
  });

  it("passes blur handler to each field", async () => {
    const { getByLabelText } = render(<NoteForm {...defaultProps} />);

    ["Title", "Note", "Tags"].forEach((label) => {
      const inp = getByLabelText(label);
      fireEvent.blur(inp);
    });
    await wait(() => {
      expect(blurMock).toHaveBeenCalledTimes(3);
    });
  });

  it("includes helper text with no errors", async () => {
    const { queryByText } = render(<NoteForm {...defaultProps} />);
    expect(
      queryByText("Supports github flavored markdown")
    ).toBeInTheDocument();
    expect(queryByText("Separated by spaces")).toBeInTheDocument();
  });

  it("replaces helper text with errors when specified", async () => {
    const props = {
      ...defaultProps,
      errors: {
        title: "TEST TITLE ERROR",
        md: "TEST MD ERROR",
        tags: "TEST TAG ERROR",
      },
    };
    const { queryByText } = render(<NoteForm {...props} />);
    expect(
      queryByText("Supports githubFlavored markdown")
    ).not.toBeInTheDocument();
    expect(queryByText("Separated by spaces")).not.toBeInTheDocument();
    Object.values(props.errors).forEach((err) =>
      expect(queryByText(err)).toBeInTheDocument()
    );
  });

  it("calls delete handler on click", async () => {
    const props = {
      ...defaultProps,
      showDelete: true,
    };
    const { getByText } = render(<NoteForm {...props} />);
    fireEvent.click(getByText("Delete"));
    await wait(() => {
      expect(deleteMock).toHaveBeenCalled();
    });
  });
});
