import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import * as queries from '../db/queries';
import '../test-utils';
import { setFilter,
         setCurrentNote,
         listNotes,
         createNote,
         editNote,
         deleteNote,
         toggleDarkMode,
         setMenuOpen } from '../store/actions';
import { initialState } from '../store/reducer';


const mockStore = configureMockStore([ thunk ]);


describe('actions', () => {
  let store;
  let stateMock;

  beforeAll(() => {
    sinon.stub(queries)
  })

  beforeEach(() => {
    stateMock = sinon.mock()
    stateMock.returns(initialState) 
    store = mockStore(stateMock);
  })

  afterEach(() => {
    sinon.reset()
    localStorage.clear()
    localStorage.setItem.mockClear()
  })

  afterAll(() => {
    queries.restore()
  })

  describe('SET_FILTER', () => {
    it('dispatches new filter', async () => {
      const expected = {
        type: 'SET_FILTER', filter: 'test filter'
      }
      await store.dispatch(setFilter('test filter'));
      expect(store.getActions()).toContainEqual(expected)
    })

    it('refreshes listed notes', async () => {
      const expected = { 
        type: 'LIST_NOTES_START'
      };
      await store.dispatch(setFilter('test filter'));
      expect(store.getActions()).toContainEqual(expected)
    })
  })

  describe('SET_CURRENT_NOTE', () => {
    it('clears current note if slug is null', async () => {
      const expected = { 
        type: 'CLEAR_CURRENT_NOTE'
      }
      await store.dispatch(setCurrentNote(null))
      expect(store.getActions()).toContainEqual(expected)
    })

    it('sets current note on success', async () => {
      queries.getNoteBySlug.resolves({ title: 'test note' })
      const expected = [
        { type: 'GET_CURRENT_NOTE_START' },
        { type: 'GET_CURRENT_NOTE_SUCCESS', note: { title: 'test note' }}
      ]
      await store.dispatch(setCurrentNote('test-slug'))
      expect(store.getActions()).toEqual(expected)
      sinon.assert.calledOnce(queries.getNoteBySlug)
      sinon.assert.calledWith(queries.getNoteBySlug, 'test-slug')
    })
  
    it('catches query errors', async () => {
      const err = new Error('test error');
      const errCb = sinon.spy();
      const expected = [
        { type: 'GET_CURRENT_NOTE_START' },
        { type: 'GET_CURRENT_NOTE_FAIL', error: err.toString() }
      ]
      queries.getNoteBySlug.rejects(err);
      await store.dispatch(setCurrentNote('test-slug', errCb))
      expect(store.getActions()).toEqual(expected)
      sinon.assert.calledOnce(queries.getNoteBySlug)
      sinon.assert.calledWith(queries.getNoteBySlug, 'test-slug')
      sinon.assert.calledOnce(errCb)
    })
  })

  describe('LIST_NOTES', () => {
    it('calls listNotesWithFilter when filter is defined', async () => {
      stateMock.returns({ ...initialState, listFilter: 'test-filter' });
      const queryResult = [
        { id: 1, title: 'test note 1' },
        { id: 2, title: 'test note 2'}
      ]
      queries.listNotesWithFilter.resolves(queryResult)
      const expected = [
        { type: 'LIST_NOTES_START' },
        { type: 'LIST_NOTES_SUCCESS', notes: queryResult }
      ]
      await store.dispatch(listNotes());
      expect(store.getActions()).toEqual(expected);
      sinon.assert.calledOnce(queries.listNotesWithFilter)
      sinon.assert.calledWithExactly(
        queries.listNotesWithFilter, 'test-filter', 0
      )
    })

    it('calls listNotes when filter is not defined', async () => {
      const queryResult = [
        { id: 1, title: 'test note 1' },
        { id: 2, title: 'test note 2'}
      ]
      const expected = [
        { type: 'LIST_NOTES_START' },
        { type: 'LIST_NOTES_SUCCESS', notes: queryResult }
      ]
      queries.listNotes.resolves(queryResult)
      await store.dispatch(listNotes());
      expect(store.getActions()).toEqual(expected);
      sinon.assert.calledOnce(queries.listNotes)
      sinon.assert.calledWithExactly(queries.listNotes, 0)
    })

    it('catches query errors', async () => {
      const err = new Error('test message');
      const expected = [
        { type: 'LIST_NOTES_START' },
        { type: 'LIST_NOTES_FAIL', error: err.toString() }
      ]
      queries.listNotes.rejects(err)
      await store.dispatch(listNotes());
      expect(store.getActions()).toEqual(expected)
      sinon.assert.calledOnce(queries.listNotes);
      sinon.assert.calledWithExactly(queries.listNotes, 0)
    })
  })

  describe('CREATE_NOTE', () => {
    let cbSpy;
    let testNote = {
      title: 'test title'
    }

    beforeEach(() => {
      cbSpy = sinon.spy()
    })

    it('creates note on db success', async () => {
      const expected = [
        { type: 'CREATE_NOTE_START' },
        { type: 'CREATE_NOTE_SUCCESS', note: testNote }
      ]
      queries.createNote.resolves(testNote);
      await store.dispatch(createNote(testNote, cbSpy));
      expect(store.getActions()).toEqual(expected)
      sinon.assert.calledOnce(queries.createNote);
      sinon.assert.calledWithExactly(queries.createNote, testNote);
    })

    it('calls successCb on db success', async () => {
      queries.createNote.resolves({ slug: 'expect slug', ...testNote })
      await store.dispatch(createNote(testNote, cbSpy))
      sinon.assert.calledOnce(cbSpy);
      sinon.assert.calledWithExactly(cbSpy, 'expect slug')
    })

    it('catches db errors', async () => {
      const err = new Error('test error message');
      const expected = [
        { type: 'CREATE_NOTE_START' },
        { type: 'CREATE_NOTE_FAIL', error: err.toString() }
      ]
      queries.createNote.rejects(err)
      await store.dispatch(createNote(testNote, cbSpy))
      sinon.assert.calledOnce(queries.createNote)
      expect(store.getActions()).toEqual(expected)
    })

    it('does not call successCb on db fail', async () => {
      queries.createNote.rejects(new Error())
      await store.dispatch(createNote(testNote, cbSpy))
      sinon.assert.calledOnce(queries.createNote)
      sinon.assert.notCalled(cbSpy)
    })
  })

  describe('EDIT_NOTE', () => {
    let testNote = {
      title: 'test note title',
      id: 42
    }

    it('saves updated note on db success', async () => {
      const expected = [
        { type: 'EDIT_NOTE_START' },
        { type: 'EDIT_NOTE_SUCCESS', noteId: testNote.id, note: testNote }
      ]
      queries.editNote.resolves(testNote)
      await store.dispatch(editNote(42, testNote))
      sinon.assert.calledOnce(queries.editNote)
      sinon.assert.calledWithExactly(queries.editNote, 42, testNote)
      expect(store.getActions()).toEqual(expected)
    })

    it('catches db errors', async () => {
      const err = new Error('test error msg');
      const expected = [
        { type: 'EDIT_NOTE_START' },
        { type: 'EDIT_NOTE_FAIL', error: err.toString() }
      ]
      queries.editNote.rejects(err)
      await store.dispatch(editNote(42, testNote))
      sinon.assert.calledOnce(queries.editNote)
      expect(store.getActions()).toEqual(expected)
    })
  })

  describe('DELETE_NOTE', () => {
    let cbSpy;

    beforeEach(() => {
      cbSpy = sinon.spy()
    })

    it('deletes current note on db success', async () => {
      const expected = [
        { type: 'DELETE_NOTE_START' },
        { type: 'DELETE_NOTE_SUCCESS', noteId: 42}
      ]
      queries.deleteNote.resolves();
      await store.dispatch(deleteNote(42, cbSpy))
      sinon.assert.calledOnce(queries.deleteNote)
      sinon.assert.calledWithExactly(queries.deleteNote, 42)
      expect(store.getActions()).toEqual(expected)
    })

    it('catches db errors', async () => {
      const err = new Error('test error message')
      const expected = [
        { type: 'DELETE_NOTE_START' },
        { type: 'DELETE_NOTE_FAIL', error: err.toString() }
      ]
      queries.deleteNote.rejects(err)
      await store.dispatch(deleteNote(42, cbSpy))
      sinon.assert.calledOnce(queries.deleteNote)
      sinon.assert.calledWithExactly(queries.deleteNote, 42)
      expect(store.getActions()).toEqual(expected)
    })

    it('calls callback on success', async () => {
      queries.deleteNote.resolves()
      await store.dispatch(deleteNote(42, cbSpy))
      sinon.assert.calledOnce(queries.deleteNote)
      sinon.assert.calledOnce(cbSpy)
    })

    it('does not call callback on fail', async () => {
      queries.deleteNote.rejects(new Error('test error message'))
      await store.dispatch(deleteNote(42, cbSpy))
      sinon.assert.calledOnce(queries.deleteNote)
      sinon.assert.notCalled(cbSpy)
    })
  })

  describe('TOGGLE_MENU_OPEN', () => {
    it('dispatches correct type', async () => {
      const expected = [
        { type: 'TOGGLE_MENU_OPEN', open: true }
      ]
      await store.dispatch(setMenuOpen(true))
      expect(store.getActions()).toEqual(expected)
    })
  })

  describe('TOGGLE_DARK_MODE', () => {
    it('sets to dark if currently light', async () => {
      const expected = [
        { type: 'SET_PALETTE_TYPE', paletteType: 'dark' }
      ]
      stateMock.returns({ ...initialState, paletteType: 'light' });
      await store.dispatch(toggleDarkMode())
      expect(localStorage.setItem).toHaveBeenCalledTimes(1)
      expect(localStorage.setItem).toHaveBeenLastCalledWith('paletteType', 'dark')
      expect(localStorage.__STORE__['paletteType']).toBe('dark')
      expect(store.getActions()).toEqual(expected)
    })

    it('sets to light mode if currently dark', async () => {
      const expected = [
        { type: 'SET_PALETTE_TYPE', paletteType: 'light' }
      ]
      stateMock.returns({ ...initialState, paletteType: 'dark' })
      await store.dispatch(toggleDarkMode())
      expect(localStorage.setItem).toHaveBeenCalledTimes(1)
      expect(localStorage.setItem).toHaveBeenLastCalledWith('paletteType', 'light')
      expect(localStorage.__STORE__['paletteType']).toBe('light')
      expect(store.getActions()).toEqual(expected)
    })
  })
})