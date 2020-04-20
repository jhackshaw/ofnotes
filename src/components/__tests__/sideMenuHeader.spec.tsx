import React from "react";
import { render, fireEvent, wait } from "test-utils";
import { SideMenuHeader } from "components";

describe("SideMenuHeader component", () => {
  const closeMock = jest.fn();
  const openMock = jest.fn();
  const defaultProps = {
    onClose: closeMock,
    onOpen: openMock,
    expanded: false,
  };

  afterEach(() => {
    closeMock.mockReset();
    openMock.mockReset();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<SideMenuHeader {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("includes light theme toggle when currently dark", async () => {
    const toggleMock = jest.fn();
    const { queryByText, getByText } = render(
      <SideMenuHeader {...defaultProps} />,
      {
        themeCtx: {
          paletteType: "dark",
          togglePalette: toggleMock,
        },
      }
    );
    expect(queryByText("set light theme")).toBeInTheDocument();
    fireEvent.click(getByText("set light theme"));
    await wait(() => {
      expect(toggleMock).toHaveBeenCalled();
    });
  });

  it("includes dark theme toggle when currently light", async () => {
    const toggleMock = jest.fn();
    const { queryByText, getByText } = render(
      <SideMenuHeader {...defaultProps} />,
      {
        themeCtx: {
          paletteType: "light",
          togglePalette: toggleMock,
        },
      }
    );
    expect(queryByText("set dark theme")).toBeInTheDocument();
    fireEvent.click(getByText("set dark theme"));
    await wait(() => {
      expect(toggleMock).toHaveBeenCalled();
    });
  });

  it("includes collapse button when currently expanded", async () => {
    const props = {
      ...defaultProps,
      expanded: true,
    };
    const { queryByText, getByText } = render(<SideMenuHeader {...props} />);
    expect(queryByText("close menu")).toBeInTheDocument();
    fireEvent.click(getByText("close menu"));
    await wait(() => {
      expect(closeMock).toHaveBeenCalled();
    });
  });

  it("includes expanded button when currently collapsed", async () => {
    const props = {
      ...defaultProps,
      expanded: false,
    };
    const { queryByText, getByText } = render(<SideMenuHeader {...props} />);
    expect(queryByText("open menu")).toBeInTheDocument();
    fireEvent.click(getByText("open menu"));
    await wait(() => {
      expect(openMock).toHaveBeenCalled();
    });
  });
});
