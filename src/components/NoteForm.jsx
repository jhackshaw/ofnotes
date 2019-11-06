import React from 'react';
import { LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useForm from 'react-hook-form';

import MainPanel from './MainPanel';
import MainPanelHeader from './MainPanelHeader'
import { NoteTextField } from './NoteFormInputs';



const useStyles = makeStyles(theme => ({
  textarea: {
    height: '50vh'
  },
  progress: {
    position: 'absolute',
    top: 0
  }
}))

const NoteForm = ({ values, loading, onChange, onSave, formActions, toggleMenu }) => {
  const classes = useStyles();
  const { register,
          errors,
          handleSubmit } = useForm({ mode: 'onBlur' });

  const tagsValue = values.tags
                    ? values.tags.join(' ')
                    : '';

  const onTagsChange = e => {
    e.persist()
    onChange({
      ...e,
      target: {
        ...e.target,
        value: e.target.value.split(' '),
        name: 'tags'
      },
      persist: () => {}
    })
  }

  return (
    <MainPanel>
      { loading &&
        <LinearProgress classes={{root: classes.progress}} />
      }
      <form onSubmit={handleSubmit(onSave)}>
        <MainPanelHeader
            title={values.title || 'New Note'}
            actions={formActions}
            toggleMenu={toggleMenu}
            >
          <NoteTextField 
              name="title"
              label="Title"
              error={errors.hasOwnProperty('title')}
              helperText={errors.title ? "Title is required" : " "}
              inputRef={register({required: true, maxLength: 100 })}
              onChange={onChange}
              value={values.title || ''}
              />
          <NoteTextField
              name="md"
              label="Note"
              multiline
              rows={2}
              InputProps={{
                classes: {
                  input: `${classes.inp} ${classes.textarea}` 
                }
              }}
              error={errors.hasOwnProperty('md')}
              helperText={
                errors.md 
                ? "Note is required!" 
                : "Supports Github flavored markdown"
              }
              inputRef={register({required: true})}
              onChange={onChange}
              value={values.md || ''}
              />
          <NoteTextField
              name="tags"
              label="Tags"
              error={errors.hasOwnProperty('tags')}
              helperText={'Separated by spaces'}
              inputRef={register()}
              onChange={onTagsChange}
              value={tagsValue}
              />
        </MainPanelHeader>
      </form>
    </MainPanel>
  )
}

export default NoteForm;
