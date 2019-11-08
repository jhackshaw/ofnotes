import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  inp: {
    marginBottom: theme.spacing(3)
  },
  btn: {
    marginLeft: theme.spacing(3),
    marginBottom: 0,
    [theme.breakpoints.down('md')]: {
      marginRight: theme.spacing(3),
      marginLeft: 0,
      marginBottom: theme.spacing(4)
    }
  },
}))


export const NoteTextField = props => {
  const classes = useStyles();
  return (
    <TextField 
      id={props.name}
      variant="outlined"
      fullWidth
      autoComplete="off"
      className={classes.inp}
      InputLabelProps={{
        shrink: Boolean(props.value)
      }}
      {...props}
    />
  )
}


export const NoteFormButton = props => {
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      className={classes.btn}
      {...props}
      />
  )
}
