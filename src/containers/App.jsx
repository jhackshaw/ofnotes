import React from 'react';
import { Route,
         Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';

import { useDispatch, useSelector } from 'react-redux';
import { selectMenuOpen } from '../store/selectors';
import * as actions from '../store/actions';

import SideBar from './SideBar';
import CreateNoteForm from './CreateNoteForm';
import EditNoteForm from './EditNoteForm';
import NoteDisplay from './NoteDisplay';


const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%'
  }
});


const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const menuExpanded = useSelector(selectMenuOpen)

  const toggleMenuOpen = e => {
    dispatch(actions.toggleMenu())
  }

  return (
    <div className={classes.root}>
      <SideBar expanded={menuExpanded}
               toggleMenu={toggleMenuOpen} />

      <Switch>
        <Route exact path="/">
          <CreateNoteForm toggleMenu={toggleMenuOpen} />
        </Route>
        <Route path="/:slug/edit">
          <EditNoteForm toggleMenu={toggleMenuOpen} />
        </Route>
        <Route path="/:slug">
          <NoteDisplay toggleMenu={toggleMenuOpen} />
        </Route>
      </Switch>
    </div>
  )
}

export default App;
