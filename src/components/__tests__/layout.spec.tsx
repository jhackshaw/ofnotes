import React from "react";
import { render } from "test-utils";
import { Layout } from "components";

describe("Layout component", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Layout>test</Layout>);
    expect(asFragment()).toMatchSnapshot();
  });
});
