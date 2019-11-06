import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import ViewIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';

import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentNote,
         selectPanelLoading } from '../store/selectors';
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
  const currentNote = useSelector(selectCurrentNote);
  const loading = useSelector(selectPanelLoading);
  const [values, setValues] = useState(currentNote);
  const [updateTimeout, setUpdateTimeout] = useState(null);

  useEffect(() => {
    dispatch(actions.setCurrentNote(slug))
    return () => {
      dispatch(actions.setCurrentNote(null))
    }
  }, [dispatch, slug])

  useEffect(() => {
    setValues(currentNote)
  }, [currentNote.id]) // eslint-disable-line

  const onChange = e => {
    e.persist();
    setValues(previous => {
      const updated = {
        ...previous,
        [e.target.name]: e.target.value
      }

      clearTimeout(updateTimeout);
      setUpdateTimeout(setTimeout(() => {
        dispatch(actions.editNote(currentNote.id, updated))
      }, 250))
  
      return updated;
    })
  }

  const onDeleteSuccess = () => {
    history.push('/')
  }

  const onDelete = e => {
    e.persist();
    const { id } = values;
    dispatch(actions.deleteNote(id, onDeleteSuccess))
  }

  return (
    <NoteForm values={values}
              onChange={onChange}
              loading={loading}
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
