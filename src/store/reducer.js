import { CREATE_NOTE_START,
         CREATE_NOTE_SUCCESS,
         CREATE_NOTE_FAIL,
         LIST_NOTES_START,
         LIST_NOTES_SUCCESS,
         LIST_NOTES_FAIL,
         GET_CURRENT_NOTE_START,
         GET_CURRENT_NOTE_SUCCESS,
         GET_CURRENT_NOTE_FAIL,
         SET_FILTER, 
         CLEAR_CURRENT_NOTE,
         EDIT_NOTE_START,
         EDIT_NOTE_SUCCESS,
         DELETE_NOTE_START,
         DELETE_NOTE_SUCCESS,
         DELETE_NOTE_FAIL,
         SET_PALETTE_TYPE, 
         EDIT_NOTE_FAIL,
         SET_MENU_OPEN} from './actions';


let initialPaletteType = localStorage.getItem('paletteType');
if (!initialPaletteType) {
  initialPaletteType = 'light'
}

export const initialState = {
  notes: {},
  noteListIds: [],

  currentNoteId: null,
  panelLoading: false,
  panelError: null,
  
  listLoading: false,
  listError: null,
  listFilter: '',
  listPage: 0,

  editNoteSaved: true,

  menuOpen: true,
  paletteType: initialPaletteType
}


export default (state=initialState, action) => {
  switch (action.type) {
    case CREATE_NOTE_START:
      return {
        ...state,
        panelLoading: true,
        panelError: null
      }
    
    case CREATE_NOTE_SUCCESS:
      return {
        ...state,
        panelLoading: false,
        noteListIds: [action.note.id, ...state.noteListIds],
        notes: {
          ...state.notes,
          [action.note.id]: action.note
        }
      }

    case GET_CURRENT_NOTE_FAIL:
    case CREATE_NOTE_FAIL:
      return {
        ...state,
        panelLoading: false,
        panelError: action.error
      }

    case LIST_NOTES_START:
      return {
        ...state,
        listLoading: true,
        listError: null
      }

    case LIST_NOTES_SUCCESS:
      return {
        ...state,
        listLoading: false,
        noteListIds: action.notes.map(
          note => note.id
        ),
        notes: {
          ...state.notes,
          ...action.notes.reduce(
            (allNotes, nextNote) => ({ ...allNotes, [nextNote.id]: nextNote }),
            {}
          )
        }
      }
    
    case LIST_NOTES_FAIL:
      return {
        ...state,
        listLoading: false,
        listError: action.error
      }

    case SET_FILTER:
      return {
        ...state,
        listFilter: action.filter
      }

    case GET_CURRENT_NOTE_START:
        return {
          ...state,
          panelLoading: true,
          panelError: null,
          currentNoteId: null
        }

    case GET_CURRENT_NOTE_SUCCESS:
      return {
        ...state,
        panelLoading: false,
        panelError: null,
        currentNoteId: action.note.id,
        noteListIds: 
          state.noteListIds.findIndex(noteId => noteId === action.note.id) < 0
          ? [action.note.id, ...state.noteListIds]
          : state.noteListIds
        ,
        notes: {
          ...state.notes,
          [action.note.id]: action.note
        }
      }
    
    case CLEAR_CURRENT_NOTE:
      return {
        ...state,
        currentNoteId: null,
        panelError: null
      }

    case EDIT_NOTE_START:
      return {
        ...state,
        panelLoading: true,
        panelError: null
      }

    case EDIT_NOTE_SUCCESS:
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.note.id]: action.note
        }
      }

    case EDIT_NOTE_FAIL:
      return {
        ...state,
        panelError: action.error
      }

    case DELETE_NOTE_START:
      return {
        ...state,
        panelLoading: true,
        panelError: null
      }

    case DELETE_NOTE_SUCCESS:
      const { [action.noteId]: _ , ...rest } = state.notes;
      return {
        ...state,
        panelLoading: false,
        panelError: null,
        notes: rest,
        noteListIds: state.noteListIds.filter(noteId => noteId !== action.noteId)
      }

    case DELETE_NOTE_FAIL:
      return {
        ...state,
        panelLoading: false,
        panelError: action.error
      }

    case SET_MENU_OPEN:
      return {
        ...state,
        menuOpen: action.open
      }

    case SET_PALETTE_TYPE:
      return {
        ...state,
        paletteType: action.paletteType
      }

    default:
      return state;
  }
}