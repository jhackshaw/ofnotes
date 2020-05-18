import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  OutlinedTextFieldProps,
  Button,
  InputAdornment,
} from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import yellow from "@material-ui/core/colors/yellow";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import SavedIcon from "@material-ui/icons/Check";
import UnsavedIcon from "@material-ui/icons/HourglassFullRounded";

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
      height: "calc(100vh - 400px)",
      [theme.breakpoints.up("lg")]: {
        height: "calc(100vh - 360px)",
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
    "@keyframes spin": {
      from: {
        transform: "rotate(0deg)",
      },
      to: {
        transform: "rotate(360deg)",
      },
    },
    savedIcon: {
      color: green[500],
    },
    unsavedIcon: {
      color: yellow[200],
      // animation: "$spin 2000ms infinite"
    },
  })
);

interface Props extends Omit<Partial<OutlinedTextFieldProps>, "value"> {
  values: UserNoteFields;
  saved?: boolean;
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
  saved,
  ...rest
}) => {
  const classes = useStyles();

  const LoadingAdornment: React.FC = () => (
    <InputAdornment position="end">
      <UnsavedIcon classes={{ root: classes.unsavedIcon }} />
    </InputAdornment>
  );

  const SavedAdornment: React.FC = () => (
    <InputAdornment position="end">
      <SavedIcon classes={{ root: classes.savedIcon }} />
    </InputAdornment>
  );

  const adorn =
    saved === undefined ? undefined : saved ? (
      <SavedAdornment />
    ) : (
      <LoadingAdornment />
    );

  return (
    <div className={classes.root}>
      <NoteTextField
        name="title"
        label="Title"
        error={!!errors.title}
        helperText={errors.title}
        value={values.title}
        InputProps={{
          endAdornment: adorn,
        }}
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
