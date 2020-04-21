import React from "react";
import {
  makeStyles,
  createStyles,
  IconButton,
  Typography,
} from "@material-ui/core";
import GithubIcon from "@material-ui/icons/GitHub";
import CloseIcon from "@material-ui/icons/Close";
import OpenIcon from "@material-ui/icons/Menu";
import LightModeIcon from "@material-ui/icons/Brightness7";
import DarkModeIcon from "@material-ui/icons/Brightness5";
import { useThemeContext } from "hooks";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: theme.spacing(2),
      flexDirection: (expanded: boolean) =>
        expanded ? "row" : "column-reverse",
    },
    header: {
      marginRight: "auto",
      "& h6": {
        fontFamily: "'McLaren', cursive;",
      },
      "& h5": {
        fontFamily: "'McLaren', cursive;",
      },
    },
  })
);

interface Props {
  onClose(): void;
  onOpen(): void;
  expanded: boolean;
}

export const SideMenuHeader: React.FC<Props> = ({
  onClose,
  onOpen,
  expanded,
}) => {
  const classes = useStyles(expanded);
  const { paletteType, togglePalette } = useThemeContext();

  return (
    <div className={classes.root}>
      {expanded && (
        <div className={classes.header}>
          <Typography variant="h5">
            OfNote
            <small>
              <em>s</em>
            </small>
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Offline note taking
          </Typography>
        </div>
      )}
      <IconButton href="https://github.com/jhackshaw/ofnotes">
        <GithubIcon />
      </IconButton>
      <IconButton onClick={() => togglePalette()}>
        {paletteType === "dark" ? (
          <LightModeIcon titleAccess="set light theme" />
        ) : (
          <DarkModeIcon titleAccess="set dark theme" />
        )}
      </IconButton>
      {expanded ? (
        <IconButton onClick={() => onClose()}>
          <CloseIcon titleAccess="close menu" />
        </IconButton>
      ) : (
        <IconButton onClick={() => onOpen()}>
          <OpenIcon titleAccess="open menu" />
        </IconButton>
      )}
    </div>
  );
};
