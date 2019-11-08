import 'fake-indexeddb/auto';
import React from 'react';
import { render } from '../test-utils';
import sinon from 'sinon';

import BrandHeader from '../components/BrandHeader';
import MainPanel from '../components/MainPanel';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import { NoteTextField, NoteFormButton } from '../components/NoteFormInputs';
import { fireEvent, wait } from '@testing-library/dom';



describe('components', () => {
  it('BrandHeader', () => {
    const { asFragment } = render(<BrandHeader />);
    expect(asFragment()).toMatchSnapshot();
  })

  it('MainPanel', () => {
    const { getByText, asFragment } = render(
      <MainPanel>
        <div>test child element</div>
      </MainPanel>
    )
    expect(getByText('test child element')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })

  it('NoteList', () => {
    const notes = [
      { id: 1, slug: 'test-1', title: 'test 1', modified: '20191103', tags: ['test'] },
      { id: 2, slug: 'test-2', title: 'test 2', modified: '20191103', tags: ['test'] },
      { id: 3, slug: 'test-3', title: 'test 3', modified: '20191103', tags: ['test'] },
      { id: 4, slug: 'test-4', title: 'test 4', modified: '20191103', tags: ['test'] }
    ]
    const { asFragment } = render(<NoteList notes={notes} />);
    expect(asFragment()).toMatchSnapshot();
  })

  it('NoteForm', () => {
    const values = {
      title: 'test note title',
      md: '# test md',
      tags: ['python', 'react']
    }
    const { asFragment } = render(<NoteForm values={values}
                                            errors={{
                                              title: 'test error',
                                              md: 'required'
                                            }}
                                            touched={{}}
                                            formActions={
                                              <div>test element</div>
                                            } />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('NoteForm converts tags to array before calling onChange', async () => {
    const onChange = sinon.spy()
    const { getByLabelText } = render(
      <NoteForm values={{
                title: '',
                md: '',
                tags: []
                }}
                errors={{}}
                touched={{}}
                handleChange={onChange}
                />
    )
    fireEvent.change(getByLabelText('Tags'), {
      target: { value: 'some space separated tags'}
    })
    await wait(() => {
      sinon.assert.calledOnce(onChange)
      sinon.assert.calledWithMatch(onChange, {
        target: {
          name: 'tags',
          value: [
            'some', 'space', 'separated', 'tags'
          ]
        }
      })
    })
  })

  it('NoteTextField', () => {
    const { asFragment } = render(<NoteTextField value='test value' />);
    expect(asFragment()).toMatchSnapshot();
  })

  it('NoteFormButton', () => {
    const { asFragment } = render(<NoteFormButton>Test btn</NoteFormButton>)
    expect(asFragment()).toMatchSnapshot()
  })
})
