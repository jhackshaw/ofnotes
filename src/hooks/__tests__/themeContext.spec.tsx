import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { wait, mocked } from "test-utils";
import { useThemeContext, ProvideThemeContext } from "hooks";

jest.spyOn(Storage.prototype, "setItem");
const setItemMock = mocked(localStorage.setItem);

afterEach(() => {
  setItemMock.mockReset();
});

afterAll(() => {
  jest.restoreAllMocks();
});

const TestComponent: React.FC = (props) => {
  const { paletteType, togglePalette } = useThemeContext();
  return (
    <div>
      <div data-testid="palette">{paletteType}</div>
      <button data-testid="togglePalette" onClick={() => togglePalette()} />
    </div>
  );
};

const renderTestComponent = async () => {
  const ret = render(
    <ProvideThemeContext>
      <TestComponent />
    </ProvideThemeContext>
  );
  return ret;
};

describe("Theme context Provider", () => {
  it("has a default", async () => {
    const { getByTestId } = await renderTestComponent();
    expect(getByTestId("palette")).toHaveTextContent("light");
  });

  it("saves theme to local storage on change", async () => {
    const { getByTestId } = await renderTestComponent();
    fireEvent.click(getByTestId("togglePalette"));
    await wait(() => {
      expect(getByTestId("palette")).toHaveTextContent("dark");
      expect(setItemMock).toHaveBeenCalledTimes(1);
      expect(setItemMock.mock.calls[0][0]).toEqual("paletteType");
      expect(setItemMock.mock.calls[0][1]).toEqual("dark");
    });
    fireEvent.click(getByTestId("togglePalette"));
    await wait(() => {
      expect(getByTestId("palette")).toHaveTextContent("light");
      expect(setItemMock).toHaveBeenCalledTimes(2);
      expect(setItemMock.mock.calls[1][0]).toEqual("paletteType");
      expect(setItemMock.mock.calls[1][1]).toEqual("light");
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
