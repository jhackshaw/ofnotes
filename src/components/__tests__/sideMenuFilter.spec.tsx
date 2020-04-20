import React from "react";
import { render, wait, fireEvent } from "test-utils";
import { SideMenuFilter } from "components";

describe("SideMenuFilter component", () => {
  const changeMock = jest.fn();

  afterEach(() => {
    changeMock.mockReset();
    changeMock.mockImplementation((e) => e.persist());
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <SideMenuFilter onChange={changeMock} value="test value" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls change handler", async () => {
    const { getByLabelText } = render(
      <SideMenuFilter onChange={changeMock} value="test value" />
    );
    fireEvent.change(getByLabelText("Filter"), {
      target: { value: "test" },
    });
    await wait(() => {
      expect(changeMock).toHaveBeenCalledTimes(1);
      expect(changeMock.mock.calls[0][0]).toMatchObject({
        target: {
          name: "filter",
        },
      });
    });
  });
});
