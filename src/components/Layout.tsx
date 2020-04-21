import React from "react";
import { CssBaseline, makeStyles, createStyles } from "@material-ui/core";
import { SideMenu } from "components";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      height: "100vh",
      overflowX: "hidden",
    },
  })
);

export const Layout: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <div className={classes.root}>
        <SideMenu />
        {children}
      </div>
    </>
  );
};
