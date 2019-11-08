import React from 'react';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    flexShrink: 1,
    overflowY: 'auto',
    position: 'relative',
    zIndex: 0,
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing()
    }
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
