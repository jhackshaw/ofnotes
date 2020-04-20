import React from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import { NoteTextField } from "components";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
      paddingBottom: 0,
    },
  })
);

interface Props {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const SideMenuFilter: React.FC<Props> = ({ value, onChange }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NoteTextField
        name="filter"
        label="Filter"
        value={value}
        onChange={onChange}
        helperText="Search tags or titles"
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          labelWidth: 40,
        }}
      />
    </div>
  );
};
