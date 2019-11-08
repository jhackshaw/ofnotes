import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { useFormik } from 'formik';
import SaveIcon from '@material-ui/icons/Save';

import { useDispatch, useSelector } from 'react-redux';
import { selectPanelError } from '../store/selectors';
import * as actions from '../store/actions';

import NoteForm from '../components/NoteForm';
import { NoteFormButton } from '../components/NoteFormInputs';


const useStyles = makeStyles(theme => ({
  icon: {
    marginLeft: theme.spacing()
  }
}))

const CreateNoteForm = props => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const panelError = useSelector(selectPanelError)

  const formik = useFormik({
    initialValues: {
      title: '',
      md: '',
      tags: []
    },
    onSubmit: values => {
      dispatch(actions.createNote(values, slug =>{
        history.push(`/${slug}`)
      }))
    },
    validate: values => {
      const errors = {};
      if (!values.title) {
        errors.title = 'Title is required!'
      }
      if(!values.md) {
        errors.md = 'Note is required!'
      }
      if (!Array.isArray(values.tags)) {
        errors.tags = 'Something went wrong here..'
      }
      return errors;
    }
  })

  // if we are on this page, there should not be a current
  // not selected in the store. do this whenever this
  // component mounts
  useEffect(() => {
    dispatch(actions.setCurrentNote(null))
  }, [dispatch])

  return (
    <NoteForm {...formik}
              panelError={panelError}
              formActions={
                <NoteFormButton
                  type="submit"
                  aria-label="save note"
                  >
                   Save <SaveIcon className={classes.icon} />
                </NoteFormButton>
              }
              {...props}
              />
  )
}

export default CreateNoteForm;
