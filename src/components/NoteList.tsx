import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  makeStyles,
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { Note } from "db";

const useStyles = makeStyles(
  createStyles({
    bullet: {
      display: "inline-block",
      margin: "0 3px",
      transform: "scale(0.8)",
    },
  })
);

interface Props {
  notes: Note[];
}

export const NoteList: React.FC<Props> = ({ notes }) => {
  const classes = useStyles();

  const bull = <span className={classes.bullet}>•</span>;

  return (
    <List>
      {notes.map((note) => (
        <ListItem key={note.slug} button component={Link} to={`/${note.slug}`}>
          <ListItemAvatar>
            <Avatar>{note.title.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={note.title}
            primaryTypographyProps={{
              noWrap: false,
            }}
            secondary={
              <span>
                {moment(note.modified).fromNow()}
                {note.tags.length ? bull : ""}
                {note.tags.join(", ")}
              </span>
            }
          />
          <ListItemSecondaryAction>
            <IconButton component={Link} to={`/${note.slug}/edit`}>
              <EditIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};
