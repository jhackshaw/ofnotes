import "fake-indexeddb/auto";
import "@testing-library/jest-dom/extend-expect";

import React from "react";
import moment from "moment";
import { render, RenderOptions } from "@testing-library/react";
import {
  SideBarContext,
  SideBarContextType,
  ProvidSideBarContext,
  ThemeContext,
  ThemeContextType,
  ProvideThemeContext,
  NoteContext,
  NoteContextType,
  ProvideNoteContext,
} from "hooks";
import { MemoryRouter } from "react-router";
import { Note } from "db";

// some fixed time
moment.now = () => {
  return 1000000000;
};

interface CustomRenderOptions extends RenderOptions {
  sideBarCtx?: Partial<SideBarContextType>;
  themeCtx?: Partial<ThemeContextType>;
  noteCtx?: Partial<NoteContextType>;
}

const emptyNoteCtx: NoteContextType = {
  notes: [],
  filter: "",
  setFilter: jest.fn(),
  getNote: jest.fn(),
  createNote: jest.fn(),
  deleteNote: jest.fn(),
  onFilterChange: jest.fn(),
  updateNote: jest.fn(),
};

export const emptyThemeCtx: ThemeContextType = {
  paletteType: "light",
  togglePalette: jest.fn(),
};

const emptySideBarCtx: SideBarContextType = {
  expanded: true,
  setExpanded: jest.fn(),
  toggleExpanded: jest.fn(),
};

const renderFakeContext = (ui: any, options: CustomRenderOptions = {}) => {
  const { sideBarCtx, themeCtx, noteCtx, ...rest } = options;

  const Wrapper: React.FC = ({ children }) => (
    <MemoryRouter>
      <NoteContext.Provider
        value={{
          ...emptyNoteCtx,
          ...noteCtx,
        }}
      >
        <ThemeContext.Provider
          value={{
            ...emptyThemeCtx,
            ...themeCtx,
          }}
        >
          <SideBarContext.Provider
            value={{
              ...emptySideBarCtx,
              ...sideBarCtx,
            }}
          >
            {children}
          </SideBarContext.Provider>
        </ThemeContext.Provider>
      </NoteContext.Provider>
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...rest });
};

export const renderRealContext = (ui: any, options: RenderOptions = {}) => {
  const Wrapper: React.FC = ({ children }) => (
    <MemoryRouter>
      <ProvideNoteContext>
        <ProvideThemeContext>
          <ProvidSideBarContext>{children}</ProvidSideBarContext>
        </ProvideThemeContext>
      </ProvideNoteContext>
    </MemoryRouter>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react";
export { mocked } from "ts-jest/utils";
export { renderFakeContext as render };

export const fakeNotes: Note[] = [
  {
    id: 1,
    modified: 1000000000 - 5000,
    md: "# test note 1",
    title: "test one",
    slug: "test-one",
    tags: [],
  },
  {
    id: 2,
    modified: 1000000000 - 1000 * 60 * 60 * 2,
    md: "# test note 2",
    title: "test two",
    slug: "test-two",
    tags: ["python"],
  },
  {
    id: 3,
    modified: 2000000 - 1000 * 60 * 60 * 24 * 10,
    md: "# test note 3",
    title: "test three",
    slug: "test-three",
    tags: ["test", "three"],
  },
];

export const fakeNote = fakeNotes[1];
