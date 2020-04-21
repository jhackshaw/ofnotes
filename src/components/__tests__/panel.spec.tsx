import React from "react";
import { render } from "test-utils";
import { MainPanel } from "components";

describe("MainPanel component", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<MainPanel>test</MainPanel>);
    expect(asFragment()).toMatchSnapshot();
  });

  it("allows custom classnames", () => {
    const { getByText } = render(
      <MainPanel className="test-class">test</MainPanel>
    );
    expect(getByText("test")).toHaveClass("test-class");
  });
});
