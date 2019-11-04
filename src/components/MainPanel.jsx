import React from 'react';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    flexShrink: 1,
    overflowY: 'auto',
    padding: theme.spacing(4)
  },
}))


const MainPanel = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      { children }
    </div>
  )
} 

export default MainPanel;
