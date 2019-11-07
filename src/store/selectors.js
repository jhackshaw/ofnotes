import { createSelector } from 'reselect';


const selectListNoteIds = state => state.noteListIds;

const selectNotesById = state => state.notes;

const selectCurrentNoteId = state => state.currentNoteId;

export const selectListError = state => state.listError;

export const selectListFilter = state => state.listFilter;

export const selectPanelLoading = state => state.panelLoading;

export const selectPanelError = state => state.panelError;

export const selectMenuOpen = state => state.menuOpen;

export const selectPaletteType = state => state.paletteType;

export const selectListNotes = createSelector(
  selectListNoteIds,
  selectNotesById,
  (noteIds, notes) => noteIds.map(
    id => notes[id]
  )
)

// select current note or a basic empty one
// empty one is necessary so that first renders
// of components that are expecting a note don't break
export const selectCurrentNote = createSelector(
  selectCurrentNoteId,
  selectNotesById,
  (noteId, notes) => notes[noteId] || {
    title: '',
    md: '',
    tags: []
  }
)