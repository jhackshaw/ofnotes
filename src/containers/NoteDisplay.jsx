import React, { useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import { Link } from 'react-router-dom';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Chip, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentNote } from '../store/selectors';
import * as actions from '../store/actions';

import MainPanel from '../components/MainPanel';
import MainPanelHeader from '../components/MainPanelHeader';
import { NoteFormButton } from '../components/NoteFormInputs';


const useStyles = makeStyles(theme => ({
  content: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(),
    paddingTop: 0,
    zIndex: -10,
    position: 'relative'
  },
  icon: {
    marginLeft: theme.spacing()
  },
  chip: {
    marginRight: theme.spacing()
  },
  tags: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  formHeader: {
    marginBottom: theme.spacing(5),
    display: 'flex',
    alignItems: 'flex-start'
  }
}))

// render markdown components using Mui typography
/* istanbul ignore next */
const options = { 
  overrides: { 
    h1: { component: props => <Typography gutterBottom variant="h3" {...props} /> }, 
    h2: { component: props => <Typography gutterBottom variant="h4" {...props} /> }, 
    h3: { component: props => <Typography gutterBottom variant="h5" {...props} /> }, 
    h4: { component: props => <Typography gutterBottom variant="h6" paragraph {...props} /> }, 
    p:  { component: props => <Typography color="textSecondary" variant="body1" paragraph {...props} /> },
    li: { component: props => <Typography variant="body1" component="li" color="textSecondary" style={{ marginTop: 2 }} {...props} /> },
    img: { component: props => <img style={{maxWidth: '100%', maxHeight: '100%'}} alt="" {...props} />},
    pre: { component: props => <pre style={{overflowX: 'auto', paddingBottom: 20, zIndex: -10}} {...props} />}
  }, 
}; 


const NoteDisplay = props => {
  const classes = useStyles();
  const { slug } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const note = useSelector(selectCurrentNote)

  useEffect(() => {
    dispatch(actions.setCurrentNote(slug, () => {
      history.push('/')
    }))
  }, [dispatch, slug, history])

  return (
    <MainPanel>
      <MainPanelHeader
        title={note.title}
        actions={
          <NoteFormButton 
            component={Link}
            to={`/${note.slug}/edit`}
            >
            Edit <EditIcon className={classes.icon} />
          </NoteFormButton>
        }
        {...props}
        >
        <Markdown className={classes.content} options={options}>{ note.md }</Markdown> 
        
        <div className={classes.tags}>
          { note.tags.map(t => (
            <Chip key={t}
                  variant="outlined"
                  label={t}
                  className={classes.chip}
                  />
          ))}
        </div>

      </MainPanelHeader>
    </MainPanel>
  )
}

export default NoteDisplay;

