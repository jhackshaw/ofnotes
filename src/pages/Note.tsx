import React from "react";
import { useParams } from "react-router-dom";
import { makeStyles, createStyles, Typography } from "@material-ui/core";
import { MainPanel, RenderedNote, CreateNoteFAB } from "components";
import { useNote } from "hooks";

const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",

      "& h4": {
        textAlign: "center",
      },
    },
  })
);

export const Note: React.FC = () => {
  const classes = useStyles();
  const { slug } = useParams();
  const { note, loading } = useNote(slug ?? "");

  return (
    <MainPanel>
      {note ? (
        <RenderedNote note={note} />
      ) : !loading ? (
        <div className={classes.content}>
          <Typography variant="h4" color="textSecondary">
            Not Found
          </Typography>
        </div>
      ) : (
        ""
      )}
      <CreateNoteFAB />
    </MainPanel>
  );
};
