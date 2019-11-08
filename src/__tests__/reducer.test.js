import '../test-utils';
import reducer, { initialState } from '../store/reducer';
import * as actions from '../store/actions';


describe('reducer', () => {

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  describe('create note', () => {
    it('updates on create note start', () => {
      const currentState = {
        panelLoading: false,
        panelError: 'existing error'
      }
      expect(reducer(currentState, {
        type: actions.CREATE_NOTE_START
      })).toMatchObject({
        panelLoading: true,
        panelError: null
      })
    })

    it('adds note on create note success', () => {
      const testNote = {
        id: 42,
        title: 'test note title'
      }
      const currentState = {
        panelLoading: true,
        noteListIds: [],
        notes: {}
      }
      expect(reducer(currentState, {
        type: actions.CREATE_NOTE_SUCCESS,
        note: testNote
      })).toMatchObject({
        panelLoading: false,
        noteListIds: [42],
        notes: {
          42: testNote
        }
      })
    })

    it('sets error message on create note fail', () => {
      expect(reducer(initialState, {
        type: actions.CREATE_NOTE_FAIL,
        error: 'test error message'
      })).toMatchObject({
        panelLoading: false,
        panelError: 'test error message'
      })
    })
  })


  describe('list notes', () => {
    it('updates on list note start', () => {
      expect(reducer(initialState, {
        type: actions.LIST_NOTES_START
      })).toMatchObject({
        listLoading: true,
        listError: null
      })
    })

    it('updates notes and sets note list on list notes success', () => {
      const existingNotes = {
        1: { title: 'test note 1' },
        2: { title: 'test note 2' }
      }
      const existingIds = [1,2]
      const newNotes = [
        { id: 3, title: 'test note 3' },
        { id: 4, title: 'test note 4' }
      ]
      const currentState = { 
        ...initialState,
        notes: existingNotes,
        noteListIds: existingIds
      }
      expect(reducer(currentState, {
        type: actions.LIST_NOTES_SUCCESS,
        notes: newNotes
      })).toMatchObject({
        notes: {
          ...existingNotes,
          3: { title: 'test note 3' },
          4: { title: 'test note 4' }
        },
        noteListIds: [3,4]
      })
    })

    it('sets error message on list notes fail', () => {
      expect(reducer(initialState, {
        type: actions.LIST_NOTES_FAIL,
        error: 'test error message'
      })).toMatchObject({
        listError: 'test error message',
        listLoading: false
      })
    })
  })


  describe('set filter', () => {
    it('updates filter on set filter', () => {
      expect(reducer(initialState, {
        type: actions.SET_FILTER,
        filter: 'example filter'
      })).toMatchObject({
        listFilter: 'example filter'
      })
    })
  })


  describe('set current note', () => {
    it('resets current note id on start getting current note', () => {
      expect(reducer(initialState, {
        type: actions.GET_CURRENT_NOTE_START
      })).toMatchObject({
        panelLoading: true,
        panelError: null,
        currentNoteId: null
      })
    })

    it('adds current note to list if not already there', () => {
      const currentState = {
        notes: {
          1: { title: 'test title 1' }
        },
        noteListIds: [1]
      }
      expect(reducer(currentState, {
        type: actions.GET_CURRENT_NOTE_SUCCESS,
        note: { id: 2, title: 'test title 2' }
      })).toMatchObject({
        notes: {
          1: { title: 'test title 1' },
          2: { title: 'test title 2' }
        },
        noteListIds: [2, 1]
      })
    })

    it('updates current note if already there', () => {
      const currentState = {
        notes: {
          1: { title: 'test title 1' }
        },
        noteListIds: [1]
      }
      expect(reducer(currentState, {
        type: actions.GET_CURRENT_NOTE_SUCCESS,
        note: { id: 1, title: 'updated test title' }
      })).toMatchObject({
        notes: {
          1: { title: 'updated test title' }
        },
        noteListIds: [1]
      })
    })

    it('resets current note on clear', () => {
      const currentState = {
        currentNoteId: 'not null'
      }
      expect(reducer(currentState, {
        type: actions.CLEAR_CURRENT_NOTE
      })).toMatchObject({
        currentNoteId: null
      })
    })
  })
  

  describe('edit note', () => {
    it('sets loading on edit note start', () => {
      const currentState = {
        panelLoading: false,
        panelError: 'an existing error' 
      }
      expect(reducer(currentState, {
        type: actions.EDIT_NOTE_START
      })).toMatchObject({
        panelLoading: true,
        panelError: null
      })
    })

    it('updates note by id on edit', () => {
      const currentState = {
        notes: { 1: { title: 'previous note title' }}
      }
      expect(reducer(currentState, {
        type: actions.EDIT_NOTE_SUCCESS,
        note: { id: 1, title: 'edited note title' }
      })).toMatchObject({
        notes: {
          1: { title: 'edited note title' }
        }
      })
    })
  })

  it('sets error on edit fail', () => {
    expect(reducer({}, {
      type: actions.EDIT_NOTE_FAIL,
      error: 'test error message'
    })).toMatchObject({
      panelError: 'test error message'
    })
  })


  describe('delete note', () => {
    it('sets loading on delete note start', () => {
      expect(reducer({}, {
        type: actions.DELETE_NOTE_START
      })).toMatchObject({
        panelLoading: true,
        panelError: null
      })
    })

    it('deletes note by id on success', () => {
      const currentState = {
        notes: {
          1: { title: 'test note' }
        },
        noteListIds: [ ]
      }
      expect(reducer(currentState, {
        type: actions.DELETE_NOTE_SUCCESS,
        noteId: 1
      })).toMatchObject({
        notes: { },
        noteListIds: [ ],
        panelLoading: false,
        panelError: null
      })
    })

    it('removes note id from list notes on success', () => {
      const currentState = {
        noteListIds: [ 1, 2 ],
        notes: { }
      }
      expect(reducer(currentState, {
        type: actions.DELETE_NOTE_SUCCESS, 
        noteId: 2
      })).toMatchObject({
        notes: { },
        noteListIds: [ 1 ],
        panelLoading: false,
        panelError: null
      })
    })

    it('sets error message on fail', () => {
      const currentState = {
        noteListIds: [ 1 ],
        notes: { 
          1: { title: 'test note' }
        }
      }
      expect(reducer(currentState, {
        type: actions.DELETE_NOTE_FAIL,
        error: 'test error msg'
      })).toMatchObject({
        ...currentState,
        panelLoading: false,
        panelError: 'test error msg'
      })
    })

    it('sets menu open to false', () => {
      const currentState = {
        menuOpen: false
      }
      expect(reducer(currentState, {
        type: actions.SET_MENU_OPEN,
        open: true
      })).toMatchObject({
        menuOpen: true
      })
    })

    it('sets menu open to true if currently closed', () => {
      const currentState = {
        menuOpen: true
      }
      expect(reducer(currentState, {
        type: actions.SET_MENU_OPEN,
        open: false
      })).toMatchObject({
        menuOpen: false
      })
    })

    it('can set palette type', () => {
      const currentState = {
        paletteType: 'sdfknsidfoaasodbfn'
      }
      expect(reducer(currentState, {
        type: actions.SET_PALETTE_TYPE,
        paletteType: 'test new type'
      })).toMatchObject({
        paletteType: 'test new type'
      })
    })
  })
})