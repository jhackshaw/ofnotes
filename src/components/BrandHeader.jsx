import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Avatar,
         Typography, 
         IconButton} from '@material-ui/core';
import BrandIcon from '@material-ui/icons/NoteAdd';
import GithubIcon from '@material-ui/icons/GitHub';


const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: theme.palette.primary.light,
    color: 'white',
    marginRight: theme.spacing(),
    height: 50,
    width: 50
  },
  root: {
    display: 'flex',
    padding: theme.spacing(2),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleWrap: {
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing()
  },
  brandFont: {
    fontFamily: "'McLaren', cursive;",
  }
}))


const BrandHeader = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Avatar classes={{root: classes.avatar}}
              component={Link}
              to="/">
        <BrandIcon />
      </Avatar>
      <div className={classes.titleWrap}>
        <Typography variant="h5" classes={{root: classes.brandFont}}>
          Of Note<small><em>s</em></small>
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" classes={{root: classes.brandFont}}>
          Offline note taking
        </Typography>
      </div>
      <IconButton href="https://github.com/jhackshaw/ofnotes">
        <GithubIcon />
      </IconButton>
    </div>
  )
}

export default BrandHeader;