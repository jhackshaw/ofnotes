import { createSelector } from 'reselect';


const selectListNoteIds = state => state.noteListIds;

const selectNotesById = state => state.notes;

const selectCurrentNoteId = state => state.currentNoteId;

export const selectListError = state => state.listError;

export const selectListFilter = state => state.listFilter;

export const selectPanelLoading = state => state.panelLoading;

export const selectListNotes = createSelector(
  selectListNoteIds,
  selectNotesById,
  (noteIds, notes) => noteIds.map(
    id => notes[id]
  )
)

export const selectCurrentNote = createSelector(
  selectCurrentNoteId,
  selectNotesById,
  (noteId, notes) => notes[noteId] || {
    title: '',
    md: '',
    tags: []
  }
)