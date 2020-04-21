import React from "react";
import { Link } from "react-router-dom";
import {
  makeStyles,
  createStyles,
  Fab,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import Icon from "@material-ui/icons/NoteAdd";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "fixed",
      right: theme.spacing(4),
      bottom: theme.spacing(4),
      "& svg": {
        marginRight: theme.spacing(),
      },

      [theme.breakpoints.down("sm")]: {
        right: theme.spacing(2),
        bottom: theme.spacing(2),
        "& svg": {
          marginRight: 0,
        },
      },
    },
  })
);

export const CreateNoteFAB: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const collapse = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Fab
      classes={{ root: classes.root }}
      variant={collapse ? "round" : "extended"}
      color="primary"
      component={Link}
      to="/create"
      size="large"
    >
      <Icon />
      {!collapse && "New Note"}
    </Fab>
  );
};
