import * as selectors from '../store/selectors';


describe('selectors', () => {
  let mockState = {
    noteListIds: [43, 45],
    notes: {
      42: { id: 42, title: 'test 42' },
      43: { id: 43, title: 'test 43' },
      44: { id: 44, title: 'test 44' },
      45: { id: 45, title: 'test 45' }
    }
  }

  it('maps list note ids to note objects', () => {
    expect(selectors.selectListNotes.resultFunc(
      mockState.noteListIds, mockState.notes
    )).toEqual([
      { id: 43, title: 'test 43' },
      { id: 45, title: 'test 45' }
    ])
  })

  it('returns empty note if currentNote not found', () => {
    const currentNoteId = 21;
    expect(selectors.selectCurrentNote.resultFunc(
      currentNoteId, mockState.notes
    )).toEqual({
      title: '',
      md: '',
      tags: []
    })
  })

  it('returns note object if currentNote found', () => {
    const currentNoteId = 42;
    expect(selectors.selectCurrentNote.resultFunc(
      currentNoteId, mockState.notes
    )).toEqual({
      id: 42,
      title: 'test 42'
    })
  })
})