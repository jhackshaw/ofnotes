import React from 'react';
import 'fake-indexeddb/auto';
import sinon from 'sinon';
import queries from '../db/queries';
import { render } from '../test-utils';
import App from '../containers/App';
import CreateNoteForm from '../containers/CreateNoteForm';
import EditNoteForm from '../containers/EditNoteForm';
import NoteDisplay from '../containers/NoteDisplay';
import SideBar from '../containers/SideBar';


describe('containers', () => {
  beforeAll(() => {
    sinon.stub(queries)
  })

  beforeEach(() => {
    sinon.reset()
  })

  describe('App', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<App />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
  describe('CreateNoteForm', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<CreateNoteForm />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('EditNoteForm', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<EditNoteForm />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('NoteDisplay', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<NoteDisplay />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('SideBar', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<SideBar />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})