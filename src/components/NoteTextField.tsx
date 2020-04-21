import React from "react";
import clsx from "clsx";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { TextField, OutlinedTextFieldProps } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    inp: {
      marginBottom: theme.spacing(3),
    },
  })
);

export const NoteTextField = ({
  className,
  value,
  name,
  ...rest
}: Partial<OutlinedTextFieldProps>) => {
  const classes = useStyles();
  return (
    <TextField
      id={name}
      name={name}
      variant="outlined"
      fullWidth
      autoComplete="off"
      className={clsx(classes.inp, className)}
      InputLabelProps={{
        shrink: Boolean(value),
      }}
      value={value}
      {...rest}
    />
  );
};
