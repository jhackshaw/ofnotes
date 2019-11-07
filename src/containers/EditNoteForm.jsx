import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { useFormik } from 'formik';
import ViewIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';

import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentNote,
         selectPanelLoading, 
         selectPanelError} from '../store/selectors';
import * as actions from '../store/actions';

import NoteForm from '../components/NoteForm';
import { NoteFormButton } from '../components/NoteFormInputs';


const useStyles = makeStyles(theme => ({
  icon: {
  },
  deleteBtn: {
    backgroundColor: theme.palette.error.main
  }
}))


const EditNoteForm = props => {
  const classes = useStyles();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const panelError = useSelector(selectPanelError);
  const currentNote = useSelector(selectCurrentNote);
  const loading = useSelector(selectPanelLoading);
  const [updateTimeout, setUpdateTimeout] = useState(null);
  const [initialValues, setInitialValues] = useState({
    title: currentNote.title,
    md: currentNote.md,
    tags: currentNote.tags
  })

  // set current note when based on the slug when
  // the page changes
  useEffect(() => {
    dispatch(actions.setCurrentNote(slug, () => {
      history.push('/')
    }))
    return () => {
      dispatch(actions.setCurrentNote(null))
    }
  }, [dispatch, slug, history])

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: true,
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

      // debounce updating the database
      // no need to save on every keystroke if someone
      // is a fast typer
      if (Object.keys(errors).length === 0) {
        clearTimeout(updateTimeout)
        setUpdateTimeout(setTimeout(() => {
          dispatch(actions.editNote(currentNote.id, values))
        }, 500))
      }

      return errors;
    }
  })

  // reset the form values based on current note
  // *only* when the id changes. 
  useEffect(() => {
    setInitialValues({
      title: currentNote.title,
      md: currentNote.md,
      tags: currentNote.tags
    })
  }, [currentNote.id]) // eslint-disable-line


  // delete the note and navigate home on success
  const onDelete = e => {
    e.persist();
    const { id } = currentNote;
    dispatch(actions.deleteNote(id, () => {
      history.push('/')
    }))
  }

  return (
    <NoteForm {...formik}
              loading={loading}
              panelError={panelError}
              formActions={
                <>
                <NoteFormButton
                  onClick={onDelete}
                  classes={{root: classes.deleteBtn}}
                  >
                  <span className={classes.btnLbl}>Delete </span><DeleteIcon className={classes.icon} />
                </NoteFormButton>
                <NoteFormButton
                  component={Link}
                  to={`/${currentNote.slug}`}
                  >
                  <span className={classes.btnLbl}>View </span><ViewIcon className={classes.icon} />
                </NoteFormButton>
                </>
              }
              {...props}
              />
  )
}

export default EditNoteForm;
