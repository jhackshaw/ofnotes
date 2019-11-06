import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Paper,
         Divider } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import { selectListNotes, 
         selectListError,
         selectListFilter,
         selectPaletteType } from '../store/selectors';
import * as actions from '../store/actions';

import BrandHeader from '../components/BrandHeader';
import NoteList from '../components/NoteList';
import { NoteTextField } from '../components/NoteFormInputs';


const useStyles = makeStyles(theme => ({
  root: {
    flex: '400px 0 0',
    overflowY: 'auto',
    position: 'relative',
    display: 'block',
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
  isOpen: {

  },
  filter: {
    padding: theme.spacing(3),
    paddingBottom: 0
  },
  eh: {
    position: 'relative'
  }
}))

const SideBar = props => {
  const classes = useStyles(props);
  const { toggleMenu } = props;
  const dispatch = useDispatch();
  const notes = useSelector(selectListNotes);
  const filter = useSelector(selectListFilter);
  const listError = useSelector(selectListError);
  const paletteType = useSelector(selectPaletteType)

  useEffect(() => {
    dispatch(actions.listNotes());
  }, [dispatch])

  const onFilterChange = e => {
    dispatch(actions.setFilter(e.target.value))
  }

  const onTogglePalette = e => {
    dispatch(actions.toggleDarkMode())
  }

  return (
    <Paper classes={{root: classes.root}}>
      <BrandHeader toggleMenu={toggleMenu}
                   currentPalette={paletteType}
                   onTogglePalette={onTogglePalette} 
                   />
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
      <div className={classes.eh}>
      <NoteList notes={notes} className={classes.eh} />
      </div>
    </Paper>
  )
}

export default SideBar;
