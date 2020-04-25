import React, { useRef, useEffect } from "react";
import Markdown, { MarkdownOptions } from "markdown-to-jsx";
import { Swipeable } from "react-swipeable";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import {
  makeStyles,
  createStyles,
  Chip,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Paper,
  Link,
  Checkbox,
} from "@material-ui/core";
import { UnsavedNote } from "db";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(4),
    },
    content: {
      marginTop: theme.spacing(5),
      padding: theme.spacing(),
      paddingTop: 0,
      zIndex: -10,
      fontFamily: theme.typography.fontFamily,

      "& p": {
        ...theme.typography.body1,
        margin: `${theme.spacing()}px 0`,

        "& img": {
          maxWidth: "80%",
        },
      },
      "& ol, ul": {
        ...theme.typography.body1,
      },
      "& dl": {
        margin: theme.spacing(),
        "& dt": {
          fontWeight: 700,
          fontSize: "1.05rem",
        },
        "& dd": {
          marginLeft: 0,
        },
      },
      "& blockquote": {
        padding: `${theme.spacing()}px ${theme.spacing(2)}px`,
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        margin: theme.spacing(),
      },
    },
    chip: {
      marginRight: theme.spacing(),
    },
    tags: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    wrapper: {
      maxWidth: 600,
      margin: "0 auto",
    },
  })
);

interface Props {
  note: UnsavedNote;
}

const options: MarkdownOptions = {
  overrides: {
    tbody: TableBody,
    thead: TableHead,
    tr: TableRow,
    td: TableCell,
    th: TableCell,
    a: (props) => <Link color="secondary" {...props} />,
    table: (props) => (
      <TableContainer component={Paper}>
        <Table {...props} />
      </TableContainer>
    ),
    blockquote: (props) => <Paper component="blockquote" {...props} />,
    h1: (props) => (
      <Typography variant="h3" component="h1" gutterBottom {...props} />
    ),
    h2: (props) => (
      <Typography variant="h4" gutterBottom component="h2" {...props} />
    ),
    h3: (props) => (
      <Typography variant="h5" gutterBottom component="h3" {...props} />
    ),
    h4: (props) => (
      <Typography variant="h6" gutterBottom component="h4" {...props} />
    ),
    h5: (props) => (
      <Typography variant="body1" component="p" paragraph {...props} />
    ),
    h6: (props) => (
      <Typography variant="body1" component="p" paragraph {...props} />
    ),
    input: ({ type, ...rest }) => <Checkbox {...rest} />,
    code: (props) => (
      <Swipeable
        onSwiping={(e) => {
          /* istanbul ignore next */
          e.event.stopPropagation();
        }}
      >
        <code {...props} />
      </Swipeable>
    ),
  },
};

export const RenderedNote: React.FC<Props> = ({ note }) => {
  const classes = useStyles();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });
  }, [note.md]);

  return (
    <div className={classes.wrapper}>
      <Typography component="h1" variant="h3" classes={{ root: classes.title }}>
        {note.title}
      </Typography>
      <div ref={ref}>
        <Markdown className={classes.content} options={options}>
          {note.md}
        </Markdown>
      </div>
      <div className={classes.tags}>
        {note.tags.filter(Boolean).map((t) => (
          <Chip key={t} variant="outlined" label={t} className={classes.chip} />
        ))}
      </div>
    </div>
  );
};
