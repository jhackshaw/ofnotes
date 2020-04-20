import React from "react";
import { useSwipeable } from "react-swipeable";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Paper, Divider } from "@material-ui/core";

import { SideMenuHeader, SideMenuFilter, NoteList } from "components";
import { useSidebarContext, useNoteContext } from "hooks";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      flex: (expanded: boolean) => (expanded ? "0 0 400px" : "0 0 auto"),
      overflowY: "auto",

      zIndex: 1000,
      height: "100%",
      [theme.breakpoints.down("sm")]: {
        position: "absolute",
        transition: "left 0.5s",
        maxWidth: "400px",
        width: "100%",
        left: (expanded: boolean) => (expanded ? "0" : "-400px"),
      },
    },
    swipe: {
      width: 60,
      height: "100%",
      position: "absolute",
      zIndex: 20,
    },
  })
);

export const SideMenu: React.FC = () => {
  const { expanded, setExpanded } = useSidebarContext();
  const { notes, filter, onFilterChange } = useNoteContext();

  const classes = useStyles(expanded);

  const swipeHandler = useSwipeable({
    onSwipedRight: () => setExpanded(true),
  });
  const menuHandler = useSwipeable({
    onSwipedLeft: () => setExpanded(false),
    onSwipedRight: () => setExpanded(true),
  });

  return (
    <>
      {!expanded && <div className={classes.swipe} {...swipeHandler} />}
      <Paper classes={{ root: classes.container }} {...menuHandler}>
        <SideMenuHeader
          onClose={() => setExpanded(false)}
          onOpen={() => setExpanded(true)}
          expanded={expanded}
        />
        {expanded && (
          <>
            <SideMenuFilter value={filter} onChange={onFilterChange} />
            <Divider />
            <NoteList notes={notes} />
          </>
        )}
      </Paper>
    </>
  );
};
