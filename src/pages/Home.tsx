import React from "react";
import { MainPanel, CreateNoteFAB, RenderedNote } from "components";
import { makeStyles, createStyles, Typography } from "@material-ui/core";
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

export const Home: React.FC = () => {
  const classes = useStyles();
  const { note, loading } = useNote("Welcome");

  return (
    <MainPanel>
      {note ? (
        <RenderedNote note={note} />
      ) : !loading ? (
        <div className={classes.content}>
          <Typography variant="h4" color="textSecondary">
            Select a note to get started
          </Typography>
        </div>
      ) : (
        ""
      )}
      <CreateNoteFAB />
    </MainPanel>
  );
};
