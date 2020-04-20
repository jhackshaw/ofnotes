import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import {
  Tabs,
  Tab,
  makeStyles,
  createStyles,
  Divider,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import {
  NoteForm,
  MainPanel,
  RenderedNote,
  ConfirmDeleteModal,
} from "components";
import { useNoteForm } from "hooks";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
    },
    tabs: {
      width: "100%",
      height: 48,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      [theme.breakpoints.up("md")]: {
        backgroundColor: theme.palette.background.default,
        boxShadow: "none",
      },
      [theme.breakpoints.up("lg")]: {
        display: "none",
      },
      "& hr": {
        width: "100%",
        margin: "0 auto",
        [theme.breakpoints.up("md")]: {
          width: "80%",
        },
      },
    },
    content: {
      display: "flex",
      width: "100%",
      height: "100%",
      overflowY: "auto",
      overflowX: "hidden",
    },
  })
);

export const Form: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const expanded = useMediaQuery(theme.breakpoints.up("lg"));
  const { slug } = useParams();
  const { savedValues, onDelete, ...formState } = useNoteForm(slug);

  const [tab, setTab] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const swipeHandler = useSwipeable({
    onSwipedRight: () => setTab(0),
    onSwipedLeft: () => setTab(1),
  });

  return (
    <div className={classes.root}>
      <div className={classes.tabs}>
        <Tabs value={tab} onChange={(e, val) => setTab(val)} centered>
          <Tab label="Write" />
          <Tab label="Preview" />
        </Tabs>
        <Divider />
      </div>
      <div
        className={classes.content}
        data-testid="form-container"
        {...swipeHandler}
      >
        {(expanded || tab === 0) && (
          <MainPanel>
            <NoteForm
              {...formState}
              showDelete={Boolean(savedValues?.id)}
              onDelete={() => setDeleteOpen(true)}
              errors={{}}
            />
          </MainPanel>
        )}
        {(expanded || tab === 1) && (
          <MainPanel>
            <RenderedNote note={savedValues} />
          </MainPanel>
        )}
      </div>
      <ConfirmDeleteModal
        open={deleteOpen}
        title={`Permanently delete ${savedValues?.title}?`}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => onDelete()}
      />
    </div>
  );
};
