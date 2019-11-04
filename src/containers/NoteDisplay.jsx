import React, { useEffect } from 'react';
import marked from 'marked';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Typography, Chip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentNote } from '../store/selectors';
import * as actions from '../store/actions';

import MainPanel from '../components/MainPanel';
import { NoteFormButton } from '../components/NoteFormInputs';


const useStyles = makeStyles(theme => ({
  content: {
    marginTop: theme.spacing(5)
  },
  icon: {
    marginLeft: theme.spacing()
  },
  chip: {
    marginRight: theme.spacing()
  },
  tags: {
    paddingTop: theme.spacing(3)
  }
}))


const NoteDisplay = props => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { slug } = useParams();
  const note = useSelector(selectCurrentNote)

  useEffect(() => {
    dispatch(actions.setCurrentNote(slug))
  }, [dispatch, slug])

  return (
    <MainPanel>
      <Typography component="span"
                  variant="h5">
        { note.title }
      </Typography>
      <NoteFormButton 
        component={Link}
        to={`/${note.slug}/edit`}
        >
        Edit <EditIcon className={classes.icon} />
      </NoteFormButton> 
      <div className={classes.content}
           dangerouslySetInnerHTML={{
            __html: marked(note.md)
           }} />
      
      <div className={classes.tags}>
        { note.tags.map(t => (
          <Chip key={t}
                variant="outlined"
                label={t}
                className={classes.chip}
                />
        ))}
      </div>
    </MainPanel>
  )
}

export default NoteDisplay;

