import React from "react";
import { render, fakeNote, mocked, wait } from "test-utils";
import { Note } from "pages";
import * as router from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));
const mockRouter = mocked(router);

const mockGetNote = jest.fn();

afterEach(() => {
  mockGetNote.mockReset();
  mockRouter.useParams.mockReset();
});

afterAll(() => {
  jest.restoreAllMocks();
});

const renderPage = async () => {
  const ret = render(<Note />, {
    noteCtx: {
      getNote: mockGetNote,
    },
  });
  await wait(() => {
    expect(mockRouter.useParams).toHaveBeenCalled();
  });
  return ret;
};

describe("Note page", () => {
  it("matches snapshot", async () => {
    mockRouter.useParams.mockReturnValue({ slug: "some-slug" });
    mockGetNote.mockResolvedValue(fakeNote);
    const { asFragment, getByText } = await renderPage();
    await wait(() => {
      expect(mockGetNote).toHaveBeenCalled();
      expect(mockGetNote.mock.calls[0][0]).toEqual("some-slug");
      expect(getByText(fakeNote.title)).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders not found when slug not found in db", async () => {
    mockRouter.useParams.mockReturnValue({ slug: "not-found-slug" });
    mockGetNote.mockResolvedValue(undefined);
    const { getByText } = await renderPage();
    await wait(() => {
      expect(mockGetNote).toHaveBeenCalled();
      expect(mockGetNote.mock.calls[0][0]).toEqual("not-found-slug");
      expect(getByText("not found")).toBeInTheDocument();
    });
  });

  it("still renders with no slug", async () => {
    mockRouter.useParams.mockReturnValue({});
    mockGetNote.mockResolvedValue(undefined);
    const { getByText } = render(<Note />);
    await wait(() => {
      expect(mockGetNote).not.toHaveBeenCalled();
      expect(getByText("not found")).toBeInTheDocument();
    });
  });
});
