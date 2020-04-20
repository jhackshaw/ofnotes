import React from "react";
import { render } from "@testing-library/react";
import { wait, mocked, fireEvent } from "test-utils";
import { useSidebarContext, ProvidSideBarContext } from "hooks";
import { useMediaQuery } from "@material-ui/core";
import { useLocation } from "react-router-dom";

jest.mock("@material-ui/core/useMediaQuery");
const mockMediaQuery = mocked(useMediaQuery);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));
const mockLocation = mocked(useLocation);

afterEach(() => {
  mockMediaQuery.mockReset();
  mockLocation.mockReset();
});

afterAll(() => {
  jest.restoreAllMocks();
});

const TestComponent: React.FC = (props) => {
  const { expanded, setExpanded, toggleExpanded } = useSidebarContext();
  return (
    <div>
      <div data-testid="expanded">{expanded.toString()}</div>
      <button
        data-testid="setExpanded"
        onClick={() => setExpanded(!expanded)}
      />
      <button data-testid="toggleExpanded" onClick={() => toggleExpanded()} />
    </div>
  );
};

interface RenderOpts {
  large?: boolean;
  pathname?: string;
}

const renderTestComponent = async ({
  large = false,
  pathname = "/",
}: RenderOpts = {}) => {
  mockMediaQuery.mockReturnValue(large);
  mockLocation.mockReturnValue({
    pathname,
    hash: "",
    search: "",
    state: undefined,
  });
  const ret = render(
    <ProvidSideBarContext>
      <TestComponent />
    </ProvidSideBarContext>
  );
  await wait(() => {
    expect(mockLocation).toHaveBeenCalled();
    expect(mockMediaQuery).toHaveBeenCalled();
  });
  return ret;
};

describe("Sidebar Context", () => {
  it("sets expanded to true on large screen", async () => {
    const { getByTestId } = await renderTestComponent({ large: true });
    expect(getByTestId("expanded")).toHaveTextContent("true");
  });

  it("is collapsed on large screen on create page", async () => {
    const { getByTestId } = await renderTestComponent({
      large: true,
      pathname: "/create",
    });
    expect(getByTestId("expanded")).toHaveTextContent("false");
  });

  it("is collapsed on large screen on edit page", async () => {
    const { getByTestId } = await renderTestComponent({
      large: true,
      pathname: "/someslug/edit",
    });
    expect(getByTestId("expanded")).toHaveTextContent("false");
  });

  it("is collapsed either way on mobile", async () => {
    const { getByTestId } = await renderTestComponent({ large: false });
    expect(getByTestId("expanded")).toHaveTextContent("false");
  });

  it("can toggle expanded", async () => {
    const { getByTestId } = await renderTestComponent({ large: false });
    expect(getByTestId("expanded")).toHaveTextContent("false");
    fireEvent.click(getByTestId("toggleExpanded"));
    await wait(() => {
      expect(getByTestId("expanded")).toHaveTextContent("true");
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
      expect(() => render(<TestComponent />)).toThrow();
    });
  });
});
