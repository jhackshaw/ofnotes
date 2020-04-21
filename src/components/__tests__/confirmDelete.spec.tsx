import React from "react";
import { render, wait, fireEvent } from "test-utils";
import { ConfirmDeleteModal } from "components";

describe("ConfirmDeleteModal component", () => {
  const closeMock = jest.fn();
  const confirmMock = jest.fn();

  const defaultProps = {
    open: true,
    title: "test confirm delete",
    onClose: closeMock,
    onConfirm: confirmMock,
  };

  afterEach(() => {
    closeMock.mockReset();
    confirmMock.mockReset();
  });

  it("calls onClose on cancel click", async () => {
    const { getByText } = render(<ConfirmDeleteModal {...defaultProps} />);
    fireEvent.click(getByText("Cancel"));
    await wait(() => {
      expect(closeMock).toHaveBeenCalled();
    });
  });

  it("calls onConfirm on delete click", async () => {
    const { getByText } = render(<ConfirmDeleteModal {...defaultProps} />);
    fireEvent.click(getByText("Delete"));
    await wait(() => {
      expect(confirmMock).toHaveBeenCalled();
    });
  });

  it("includes title if passed", () => {
    const props = {
      ...defaultProps,
      title: "test title",
    };
    const { getByText } = render(<ConfirmDeleteModal {...props} />);
    expect(getByText("test title")).toBeInTheDocument();
  });

  it("includes body if passed", () => {
    const props = {
      ...defaultProps,
      body: "test body",
    };
    const { getByText } = render(<ConfirmDeleteModal {...props} />);
    expect(getByText("test body")).toBeInTheDocument();
  });
});
