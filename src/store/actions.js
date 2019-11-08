import * as queries from '../db/queries';


export const SET_FILTER = 'SET_FILTER';

const setFilterAction = filter => ({
  type: SET_FILTER,
  filter
})

export const setFilter = filter => async dispatch => {
  dispatch(setFilterAction(filter));
  dispatch(listNotes());  
}



export const GET_CURRENT_NOTE_START = 'GET_CURRENT_NOTE_START';
export const GET_CURRENT_NOTE_SUCCESS = 'GET_CURRENT_NOTE_SUCCESS';
export const GET_CURRENT_NOTE_FAIL = 'GET_CURRENT_NOTE_FAIL';
export const CLEAR_CURRENT_NOTE = 'CLEAR_CURRENT_NOTE';

const getCurrentNoteStart = () => ({
  type: GET_CURRENT_NOTE_START
})

const getCurrentNoteSuccess = note => ({
  type: GET_CURRENT_NOTE_SUCCESS,
  note
})

const getCurrentNoteFail = e => ({
  type: GET_CURRENT_NOTE_FAIL,
  error: e.toString()
})

const clearCurrentNote = () => ({
  type: CLEAR_CURRENT_NOTE
})

export const setCurrentNote = (slug, errCb) => async dispatch => {
  if (!slug) {
    return dispatch(clearCurrentNote())
  }
  dispatch(getCurrentNoteStart())
  try {
    const note = await queries.getNoteBySlug(slug);
    dispatch(getCurrentNoteSuccess(note));
  }
  catch (e) {
    dispatch(getCurrentNoteFail(e))
    errCb()
  }
}


export const LIST_NOTES_START = 'LIST_NOTES_START';
export const LIST_NOTES_SUCCESS = 'LIST_NOTES_SUCCESS';
export const LIST_NOTES_FAIL = 'LIST_NOTES_FAIL';

const listNotesStart = () => ({
  type: LIST_NOTES_START
})

const listNotesSuccess = notes => ({
  type: LIST_NOTES_SUCCESS,
  notes
})

const listNotesFail = err => ({
  type: LIST_NOTES_FAIL,
  error: err.toString()
})

export const listNotes = () => async (dispatch, getState) => {
  dispatch(listNotesStart())
  const { listFilter, listPage } = getState();

  try {
    const notes = listFilter ?
                    await queries.listNotesWithFilter(listFilter, listPage) :
                    await queries.listNotes(listPage);
    dispatch(listNotesSuccess(notes))
  }
  catch (e) {
    dispatch(listNotesFail(e))
  }
}

export const CREATE_NOTE_START = 'CREATE_NOTE_START';
export const CREATE_NOTE_SUCCESS = 'CREATE_NOTE_SUCCESS';
export const CREATE_NOTE_FAIL = 'CREATE_NOTE_FAIL';

const createNoteStart = () => ({
  type: CREATE_NOTE_START
})

const createNoteSuccess = note => ({
  type: CREATE_NOTE_SUCCESS,
  note
})

const createNoteFail = err => ({
  type: CREATE_NOTE_FAIL,
  error: err.toString()
})

export const createNote = (note, successCb) => async dispatch => {
  dispatch(createNoteStart())
  try {
    const saved = await queries.createNote(note);
    dispatch(createNoteSuccess(saved))
    successCb(saved.slug)
  }
  catch (e) {
    dispatch(createNoteFail(e))
  }
} 


export const EDIT_NOTE_START = 'EDIT_NOTE_START';
export const EDIT_NOTE_SUCCESS = 'EDIT_NOTE_SUCCESS';
export const EDIT_NOTE_FAIL = 'EDIT_NOTE_FAIL';

const editNoteStart = () => ({
  type: EDIT_NOTE_START
})

const editNoteSuccess = (noteId, note) => ({
  type: EDIT_NOTE_SUCCESS,
  noteId,
  note
})

const editNoteFail = e => ({
  type: EDIT_NOTE_FAIL,
  error: e.toString()
})

export const editNote = (noteId, note) => async dispatch => {
  dispatch(editNoteStart())
  try {
    const saved = await queries.editNote(noteId, note);
    dispatch(editNoteSuccess(saved.id, saved))
  }
  catch (e) {
    dispatch(editNoteFail(e.failures ? e.failures[0] : e))
  }
}


export const DELETE_NOTE_START = 'DELETE_NOTE_START';
export const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS';
export const DELETE_NOTE_FAIL = 'DELETE_NOTE_FAIL';

const deleteNoteStart = () => ({
  type: DELETE_NOTE_START
})

const deleteNoteSuccess = noteId => ({
  type: DELETE_NOTE_SUCCESS,
  noteId
})

const deleteNoteFail = e => ({
  type: DELETE_NOTE_FAIL,
  error: e.toString()
})

export const deleteNote = (noteId, onSuccess) => async dispatch => {
  dispatch(deleteNoteStart())
  try {
    await queries.deleteNote(noteId)
    dispatch(deleteNoteSuccess(noteId))
    onSuccess()
  }
  catch (e) {
    dispatch(deleteNoteFail(e))
  }
}


export const SET_MENU_OPEN = 'TOGGLE_MENU_OPEN';

export const setMenuOpen = open => ({
  type: SET_MENU_OPEN,
  open
})



export const SET_PALETTE_TYPE = 'SET_PALETTE_TYPE';

const setPaletteType = paletteType => ({
  type: SET_PALETTE_TYPE,
  paletteType
})

export const toggleDarkMode = () => (dispatch, getState) => {
  const { paletteType } = getState();
  if (paletteType === 'dark') {
    localStorage.setItem('paletteType', 'light')
    dispatch(setPaletteType('light'))
  }
  else {
    localStorage.setItem('paletteType', 'dark')
    dispatch(setPaletteType('dark'))
  }
}
