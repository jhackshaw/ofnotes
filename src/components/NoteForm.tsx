import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { OutlinedTextFieldProps, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteForever";

import { UserNoteFields } from "db";
import { NoteTextField } from "./NoteTextField";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100%",
      flexDirection: "column",
    },
    textarea: {
      height: "calc(100vh - 390px)",
      [theme.breakpoints.up("lg")]: {
        height: "calc(100vh - 350px)",
      },
    },
    progress: {
      position: "absolute",
      top: 0,
    },
    delete: {
      borderColor: theme.palette.error.main,
      color: theme.palette.error.main,
      width: 200,
    },
  })
);

interface Props extends Partial<OutlinedTextFieldProps> {
  values: UserNoteFields;
  showDelete?: boolean;
  errors: {
    [K in keyof UserNoteFields]?: string | null;
  };
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onDelete?: React.MouseEventHandler<HTMLButtonElement>;
}

export const NoteForm: React.FC<Props> = ({
  values,
  errors,
  showDelete = false,
  onDelete,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NoteTextField
        name="title"
        label="Title"
        error={!!errors.title}
        helperText={errors.title}
        value={values.title}
        {...rest}
      />

      <NoteTextField
        name="md"
        label="Note"
        multiline
        rows={20}
        InputProps={{
          classes: {
            input: classes.textarea,
          },
        }}
        error={!!errors.md}
        helperText={errors.md ?? "Supports github flavored markdown"}
        value={values.md}
        {...rest}
      />

      <NoteTextField
        name="tags"
        label="Tags"
        error={!!errors.tags}
        helperText={errors.tags ?? "Separated by spaces"}
        value={values.tags.join(" ")}
        {...rest}
      />

      {showDelete && (
        <Button
          onClick={onDelete}
          variant="outlined"
          size="small"
          fullWidth={false}
          classes={{ root: classes.delete }}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      )}
    </div>
  );
};
