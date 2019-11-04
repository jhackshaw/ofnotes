import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/styles';

import { useDispatch } from 'react-redux';
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
  const [values, setValues] = useState({
    title: '',
    md: '',
    tags: []
  })

  const onChange = e => {
    e.persist();
    setValues(previous => ({
      ...previous,
      [e.target.name]: e.target.value
    }))
  }

  const onSaveSuccess = slug => {
    history.push(`/${slug}`)
  }

  const onSave = () => {
    dispatch(actions.createNote(values, onSaveSuccess))
  }

  return (
    <NoteForm values={values}
              onChange={onChange}
              onSave={onSave}
              formActions={
                <NoteFormButton
                  type="submit"
                  aria-label="save note"
                  >
                   Save <SaveIcon className={classes.icon} />
                </NoteFormButton>
              }
              />
  )
}

export default CreateNoteForm;
