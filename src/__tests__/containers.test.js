import React from 'react';

import { render } from '../test-utils';
import { fireEvent, wait } from '@testing-library/react';

import sinon from 'sinon';
import queries from '../db/queries';
import * as actions from '../store/actions';
import * as selectors from '../store/selectors';
import * as reactRedux from 'react-redux';

import App from '../containers/App';
import CreateNoteForm from '../containers/CreateNoteForm';
import EditNoteForm from '../containers/EditNoteForm';
import NoteDisplay from '../containers/NoteDisplay';
import SideBar from '../containers/SideBar';


describe('containers', () => {
  let dispatchSpy;

  beforeAll(() => {
    sinon.stub(queries)
    sinon.stub(reactRedux, 'useDispatch')
  })

  beforeEach(() => {
    sinon.reset()
    dispatchSpy = sinon.spy()
    reactRedux.useDispatch.returns(dispatchSpy)
  })

  describe('App', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<App />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('CreateNoteForm', () => {
    beforeAll(() => {
      sinon.stub(actions, 'setCurrentNote')
      sinon.stub(actions, 'createNote')
    })

    beforeEach(() => {
      actions.setCurrentNote.reset()
      actions.setCurrentNote.returns({
        type: 'TEST_SET_NOTE'
      })
      actions.createNote.reset()
      actions.createNote.returns({
        type: 'TEST_CREATE_NOTE'
      })
    })

    afterAll(() => {
      actions.setCurrentNote.restore()
      actions.createNote.restore()
    })

    it('matches snapshot', () => {
      const { asFragment } = render(<CreateNoteForm />)
      expect(asFragment()).toMatchSnapshot()
    })

    it('initializes form with empty data', () => {
      const { getByLabelText } = render(<CreateNoteForm />)
      expect(getByLabelText('Title')).toHaveValue('')
      expect(getByLabelText('Tags')).toHaveValue('')
      expect(getByLabelText('Note')).toHaveValue('')
    })

    it('sets current note to null on render', () => {
      render(<CreateNoteForm />)
      sinon.assert.calledOnce(reactRedux.useDispatch)
      sinon.assert.calledOnce(actions.setCurrentNote)
      sinon.assert.calledOnce(dispatchSpy)
      sinon.assert.calledWithExactly(dispatchSpy, {
        type: 'TEST_SET_NOTE'
      })
    })

    it('updates form state on change', async () => {
      const { getByLabelText } = render(<CreateNoteForm />)
      fireEvent.change(getByLabelText('Title'), { 
        target: { value: 'test val' }
      })
      await wait(() => {
        expect(getByLabelText('Title')).toHaveValue('test val')
      })
    })

    it('validates the title', async () => {
      const { getByLabelText, getByText } = render(<CreateNoteForm />)
      fireEvent.blur(getByLabelText('Title'))
      await wait(() => {
        expect(getByText('Title is required!')).toBeInTheDocument()
      })
    })

    it('validates markdown', async () => {
      const { getByLabelText, getByText } = render(<CreateNoteForm />)
      fireEvent.blur(getByLabelText('Note'))
      await wait(() => {
        expect(getByText('Note is required!')).toBeInTheDocument()
      })
    })

    it('dispatches create note on save', async () => {
      const { getByTestId, getByLabelText } = render(<CreateNoteForm />)
      fireEvent.change(getByLabelText('Title'), {
        target: { value: 'test' }
      })
      fireEvent.change(getByLabelText('Note'), {
        target: { value: 'test note' }
      })
      fireEvent.submit(getByTestId("form"))
      await wait(() => {
        sinon.assert.calledOnce(actions.createNote)
        sinon.assert.calledWith(actions.createNote, {
          title: 'test',
          md: 'test note',
          tags: []
        })
        sinon.assert.calledTwice(dispatchSpy)
      })
    })

  })

  describe('EditNoteForm', () => {
    beforeAll(() => {
      sinon.stub(actions, 'setCurrentNote')
      sinon.stub(actions, 'editNote')
      sinon.stub(actions, 'deleteNote')
      sinon.stub(selectors, 'selectCurrentNote')
    })
    
    beforeEach(() => {
      actions.setCurrentNote.reset()
      actions.setCurrentNote.returns({
        type: 'TEST_SET_NOTE'
      })
      actions.editNote.reset()
      actions.editNote.returns({
        type: 'TEST_CREATE_NOTE'
      })
      actions.deleteNote.reset()
      actions.deleteNote.returns({
        type: 'TEST_DELETE_NOTE'
      })
      selectors.selectCurrentNote.reset()
      selectors.selectCurrentNote.returns({
        title: 'test title',
        md: 'test markdown',
        tags: ['testtag', 'testtag2'],
        id: 42
      })
    })

    afterAll(() => {
      actions.setCurrentNote.restore()
      actions.editNote.restore()
      selectors.selectCurrentNote.restore()
    })

    it('matches snapshot', () => {
      const { asFragment } = render(<EditNoteForm />)
      expect(asFragment()).toMatchSnapshot()
    })
  
    it('sets form values based on current note', async () => {
      const { getByLabelText } = render(<EditNoteForm />)
      await wait(() => {
        expect(getByLabelText('Title')).toHaveValue('test title')
        expect(getByLabelText('Note')).toHaveValue('test markdown')
        expect(getByLabelText('Tags')).toHaveValue('testtag testtag2')
      })
    })

    it('validates title required', async () => {
      const { getByLabelText, getByText } = render(<EditNoteForm />)
      fireEvent.blur(getByLabelText('Title'))
      fireEvent.change(getByLabelText('Title'), {
        target: { value: '' }
      })
      await wait(() => {
        expect(getByText('Title is required!')).toBeInTheDocument()
      })
    })

    it('validates note required', async () => {
      const { getByLabelText, getByText } = render(<EditNoteForm />)
      fireEvent.blur(getByLabelText('Note'))
      fireEvent.change(getByLabelText('Note'), {
        target: { value: '' }
      })
      await wait(() => {
        expect(getByText('Note is required!')).toBeInTheDocument()
      })
    })

    it('dispatches edit note on change', async () => {
      const { getByLabelText } = render(<EditNoteForm />)
      fireEvent.change(getByLabelText('Title'), {
        target: { value: 'test title changed' }
      })
      await wait(() => {
        sinon.assert.calledWithMatch(actions.editNote, 42, {
          title: 'test title changed'
        })
      })
    }, 6000)

    it('dispatches delete on delete click', async () => {
      const { getByText } = render(<EditNoteForm />)
      fireEvent.click(getByText('Delete', { exact: false }))
      await wait(() => {
        sinon.assert.calledOnce(actions.deleteNote)
        sinon.assert.calledWith(actions.deleteNote, 42)
        sinon.assert.calledWithExactly(dispatchSpy, {
          type: 'TEST_DELETE_NOTE'
        })
      })

    })
  })

  describe('NoteDisplay', () => {
    beforeAll(() => {
      sinon.stub(actions, 'setCurrentNote')
      sinon.stub(selectors, 'selectCurrentNote')
    })

    beforeEach(() => {
      actions.setCurrentNote.reset()
      actions.setCurrentNote.returns({
        type: 'TEST_SET_CURRENT_NOTE'
      })
      selectors.selectCurrentNote.reset()
      selectors.selectCurrentNote.returns({
        title: 'test title',
        tags: ['test1', 'test2'],
        md: 'asdfasdf',
        id: 42
      })
    })

    afterAll(() => {
      actions.setCurrentNote.restore()
      selectors.selectCurrentNote.restore()
    })

    it('matches snapshot', () => {
      const { asFragment } = render(<NoteDisplay />)
      expect(asFragment()).toMatchSnapshot()
    })

    it('calls set current note on mount', async () => {
      render(<NoteDisplay />)
      await wait(() => {
        sinon.assert.calledOnce(actions.setCurrentNote)
        // can't easily stub useParams to check that the
        // correct slig is dispatched
        sinon.assert.calledWithMatch(dispatchSpy, {
          type: 'TEST_SET_CURRENT_NOTE'
        })
      })
    })

  })

  describe('SideBar', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<SideBar />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})