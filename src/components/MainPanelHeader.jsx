import React from 'react';
import { IconButton, Typography, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MenuIcon  from '@material-ui/icons/Menu';


const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(5),
    display: 'flex',
    alignItems: 'flex-start'
  },
  mobileMenu: {
    display: 'block',
    marginRight: theme.spacing(),
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    }
  },
  actions: {
    marginLeft: 'auto',
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(2)
    }
  },
  title: {
    paddingTop: 0,
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing()
    }
  },
}))


const MainPanelHeader = ({ title, actions, toggleMenu, children }) => {
  const classes = useStyles();

  return (
    <>
    <div className={classes.root}>
      <IconButton classes={{root: classes.mobileMenu}} onClick={toggleMenu}>
        <MenuIcon />
      </IconButton>
      <Typography component="span" variant="h5" classes={{root: classes.title}}>
        { title }
      </Typography>
      <Hidden mdDown>
        <div className={classes.actions}>
          { actions }
        </div>
      </Hidden>
    </div>
    { children }
    <div>
      <Hidden lgUp>
        <div className={classes.actions}>
          { actions }
        </div>
      </Hidden>
    </div>
    </>
  )
}

export default MainPanelHeader;
