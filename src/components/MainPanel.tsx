import React from "react";
import clsx from "clsx";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: "100%",
      overflowY: "auto",
      position: "relative",
      zIndex: 0,
      padding: theme.spacing(4),
    },
  })
);

interface Props extends Partial<JSX.IntrinsicElements["div"]> {
  className?: string;
}

export const MainPanel = React.forwardRef<HTMLDivElement, Props>(
  ({ className, children, ...rest }, ref) => {
    const classes = useStyles();
    return (
      <div className={clsx(classes.root, className)} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);
