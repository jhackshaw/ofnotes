import React from 'react';
import { LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

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

const NoteForm = ({ 
  values,
  errors,
  touched,
  panelError,
  handleSubmit,
  handleChange,
  handleBlur,
  formActions,
  toggleMenu,
  loading
}) => {
  const classes = useStyles();

  const onTagsChange = e => {
    e.persist()
    handleChange({
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
      <form onSubmit={handleSubmit} data-testid="form">
        <MainPanelHeader
            title={values.title || 'New Note'}
            actions={formActions}
            toggleMenu={toggleMenu}
            >
          <NoteTextField 
              name="title"
              label="Title"
              error={
                (Boolean(errors.hasOwnProperty('title') && touched.title)
                || Boolean(panelError))
              }
              helperText={
                errors.title && touched.title
                ? errors.title
                : panelError 
                  ? panelError 
                  : " "
              }
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
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
              error={errors.hasOwnProperty('md') && touched.md}
              helperText={
                errors.md && touched.md
                ? errors.md
                : 'Supports github flavored markdown'
              }
              value={values.md || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              />
          <NoteTextField
              name="tags"
              label="Tags"
              error={errors.hasOwnProperty('tags') && touched.tags}
              helperText={
                errors.tags && touched.tags
                ? errors.tags
                : "Separated by spaces"
              }
              value={
                values.tags
                ? values.tags.join(' ')
                : ''
              }
              onChange={onTagsChange}
              onBlur={handleBlur}
              />
        </MainPanelHeader>
      </form>
    </MainPanel>
  )
}

export default NoteForm;
