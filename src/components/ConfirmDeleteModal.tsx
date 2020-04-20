import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  makeStyles,
  createStyles,
  Slide,
  SlideProps,
} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    delete: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  })
);

const Transition = React.forwardRef((props: SlideProps, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

interface Props {
  open: boolean;
  title: string;
  body?: string;
  onClose(): void;
  onConfirm(): void;
}

export const ConfirmDeleteModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  title,
  body = null,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      disablePortal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={true}
      TransitionComponent={Transition}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      {body && (
        <DialogContent>
          <DialogContentText>{body}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} color="default">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className={classes.delete}
          variant="contained"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
