import React from 'react';
import { Route,
         Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';

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

  return (
    <div className={classes.root}>
      <SideBar />

      <Switch>
        <Route exact path="/">
          <CreateNoteForm />
        </Route>
        <Route path="/:slug/edit">
          <EditNoteForm />
        </Route>
        <Route path="/:slug">
          <NoteDisplay />
        </Route>
      </Switch>
    </div>
  )
}

export default App;
