import React from "react";
import { render, mocked } from "test-utils";
import { CreateNoteFAB } from "components";
import { useMediaQuery } from "@material-ui/core";

jest.mock("@material-ui/core/useMediaQuery");
const mockedMediaQuery = mocked(useMediaQuery);

afterAll(() => {
  jest.restoreAllMocks();
});

describe("CreateNoteFAB component", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<CreateNoteFAB />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("is collapsed on smaller screens", () => {
    mockedMediaQuery.mockReturnValue(true);
    const { queryByText } = render(<CreateNoteFAB />);
    expect(mockedMediaQuery).toHaveBeenCalled();
    expect(queryByText("New Note")).not.toBeInTheDocument();
  });

  it("is extended on larger screens", () => {
    mockedMediaQuery.mockReturnValue(false);
    const { queryByText } = render(<CreateNoteFAB />);
    expect(mockedMediaQuery).toHaveBeenCalled();
    expect(queryByText("New Note")).toBeInTheDocument();
  });
});
