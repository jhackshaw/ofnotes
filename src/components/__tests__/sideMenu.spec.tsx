import React from "react";
import { render, fireEvent, wait, fakeNotes } from "test-utils";
import { SideMenu } from "components";

describe("SideMenu component", () => {
  const expandedMock = jest.fn();
  const filterChangeMock = jest.fn();

  const defaultSidebarCtx = {
    expanded: true,
    setExpanded: expandedMock,
    filter: "",
    onFilterChange: filterChangeMock,
  };

  afterEach(() => {
    expandedMock.mockReset();
    filterChangeMock.mockReset();
  });

  it("matches snapshot", async () => {
    const { asFragment, getByText } = render(<SideMenu />, {
      sideBarCtx: {
        ...defaultSidebarCtx,
      },
      noteCtx: {
        notes: fakeNotes,
      },
    });
    await wait(() => {
      expect(getByText(fakeNotes[0].title)).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("sets expanded to true on swipe right", async () => {
    const { container } = render(<SideMenu />, {
      sideBarCtx: {
        ...defaultSidebarCtx,
        expanded: true,
      },
    });
    const element = container.querySelector("div.MuiPaper-root") as Element;
    fireEvent.touchStart(element, {
      touches: [{ clientX: 5, clientY: 10 }],
    });
    fireEvent.touchMove(element, {
      touches: [{ clientX: 25, clientY: 10 }],
    });
    fireEvent.touchEnd(element);
    await wait(() => {
      expect(expandedMock).toHaveBeenCalled();
      expect(expandedMock.mock.calls[0][0]).toEqual(true);
    });
  });

  it("sets expanded to false on swipe left", async () => {
    const { container } = render(<SideMenu />, {
      sideBarCtx: {
        ...defaultSidebarCtx,
        expanded: true,
      },
    });
    const element = container.querySelector("div.MuiPaper-root") as Element;
    fireEvent.touchStart(element, {
      touches: [{ clientX: 25, clientY: 10 }],
    });
    fireEvent.touchMove(element, {
      touches: [{ clientX: 5, clientY: 10 }],
    });
    fireEvent.touchEnd(element);
    await wait(() => {
      expect(expandedMock).toHaveBeenCalled();
      expect(expandedMock.mock.calls[0][0]).toEqual(false);
    });
  });

  it("can swipe hidden swipe handler", async () => {
    const { container } = render(<SideMenu />, {
      sideBarCtx: {
        ...defaultSidebarCtx,
        expanded: false,
      },
    });
    const element = container.querySelectorAll("div")[0] as Element;
    fireEvent.touchStart(element, {
      touches: [{ clientX: 5, clientY: 10 }],
    });
    fireEvent.touchMove(element, {
      touches: [{ clientX: 25, clientY: 10 }],
    });
    fireEvent.touchEnd(element);
    await wait(() => {
      expect(expandedMock).toHaveBeenCalled();
      expect(expandedMock.mock.calls[0][0]).toEqual(true);
    });
  });

  it("sets expanded to false on close menu click", async () => {
    const { getByText } = render(<SideMenu />, {
      sideBarCtx: {
        ...defaultSidebarCtx,
        expanded: true,
      },
    });
    fireEvent.click(getByText("close menu"));
    await wait(() => {
      expect(expandedMock).toHaveBeenCalled();
      expect(expandedMock.mock.calls[0][0]).toEqual(false);
    });
  });

  it("sets expanded to true on open menu click", async () => {
    const { getByText } = render(<SideMenu />, {
      sideBarCtx: {
        ...defaultSidebarCtx,
        expanded: false,
      },
    });
    fireEvent.click(getByText("open menu"));
    await wait(() => {
      expect(expandedMock).toHaveBeenCalled();
      expect(expandedMock.mock.calls[0][0]).toEqual(true);
    });
  });
});
