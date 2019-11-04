import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Paper,
         Divider } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import { selectListNotes, 
         selectListError,
         selectListFilter } from '../store/selectors';
import * as actions from '../store/actions';

import BrandHeader from '../components/BrandHeader';
import NoteList from '../components/NoteList';
import { NoteTextField } from '../components/NoteFormInputs';


const useStyles = makeStyles(theme => ({
  root: {
    flex: '400px 0 0',
    overflowY: 'auto',
    [theme.breakpoints.down('md')]: {
      position: 'absolute',
      width: '100%',
      zIndex: '1000',
      height: '100%',
      display: props =>
        props.expanded
        ? 'block'
        : 'none'
    }
  },
  filter: {
    padding: theme.spacing(3),
    paddingBottom: 0
  }
}))

const SideBar = props => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const notes = useSelector(selectListNotes);
  const filter = useSelector(selectListFilter);
  const listError = useSelector(selectListError);

  useEffect(() => {
    dispatch(actions.listNotes());
  }, [dispatch])

  const onFilterChange = e => {
    dispatch(actions.setFilter(e.target.value))
  }

  return (
    <Paper classes={{root: classes.root}}>
      <BrandHeader />
      <div className={classes.filter}>
        <NoteTextField
            name="filter"
            label="Filter"
            value={filter}
            onChange={onFilterChange}
            error={Boolean(listError)}
            helperText={listError || "Search tags or titles"}
            InputLabelProps={{
              shrink: true
            }}
            />
      </div>
      <Divider />
      <NoteList notes={notes} />
    </Paper>
  )
}

export default SideBar;
