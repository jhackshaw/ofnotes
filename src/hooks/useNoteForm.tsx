import { useState, useEffect, useCallback, useRef } from "react";
import { useNote, useNoteContext } from "hooks";
import { UserNoteFields, UnsavedNote } from "db";

type Errors = {
  [K in keyof UserNoteFields]?: string;
};

type WithTimestamp<T extends {}> = T & {
  modified: number;
};

const newNote: UserNoteFields = {
  title: "",
  md: "",
  tags: [],
};

export const useNoteForm = (slug: string | undefined) => {
  const { createNote, updateNote, deleteNote } = useNoteContext();
  const { note } = useNote(slug);
  const [values, setValues] = useState<WithTimestamp<UserNoteFields>>({
    ...newNote,
    modified: 0,
  });
  const [savedValues, setSavedValues] = useState<WithTimestamp<UnsavedNote>>({
    ...newNote,
    modified: 0,
  });
  const [errors, setErrors] = useState<Errors>({});
  const shouldUpdate = useRef(false);

  const noteId = savedValues?.id;

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.persist();
      setValues((previous) => ({
        ...previous,
        modified: Date.now(),
        [e.target.name]:
          e.target.name === "tags" ? e.target.value.split(" ") : e.target.value,
      }));
    },
    []
  );

  const onBlur: React.FocusEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      if (e.target.name === "title" && !noteId) {
        setErrors({});
        try {
          const result = await createNote(values);
          setSavedValues({ ...result, modified: Date.now() });
        } catch (e) {
          setErrors({
            title:
              e.name === "ConstraintError"
                ? "Title must be unique"
                : e.message || "Something went wrong creating this note",
          });
        }
      }
    },
    [createNote, noteId, values]
  );

  const onDelete = useCallback(async () => {
    deleteNote(noteId!);
  }, [noteId, deleteNote]);

  useEffect(() => {
    if (!noteId) {
      return;
    }
    if (!shouldUpdate.current) {
      shouldUpdate.current = true;
      return;
    }
    const handleUpdate = async () => {
      setErrors({});
      try {
        const result = await updateNote(noteId, values);
        setSavedValues({ ...result, modified: Date.now() });
      } catch (e) {
        const isConstraintError = e.failures?.some(
          (f: any) => f.name === "ConstraintError"
        );
        setErrors({
          title: isConstraintError
            ? "Title must be unique"
            : e.message || "Something went wrong updating this note",
        });
      }
    };
    const timeout = setTimeout(handleUpdate, 200);
    return () => clearTimeout(timeout);
  }, [noteId, updateNote, values]);

  useEffect(() => {
    setValues({
      title: note?.title ?? "",
      md: note?.md ?? "",
      tags: note?.tags ?? [],
      modified: 0,
    });
    setErrors({});
    setSavedValues({ ...(note ?? newNote), modified: 0 });
    shouldUpdate.current = false;
  }, [note]);

  const { modified: changedMod } = values;
  const { modified: savedMod } = savedValues;

  let saved;
  if (savedValues.id || changedMod !== 0)
    saved = Boolean(changedMod === 0 || savedMod >= changedMod);

  return {
    values,
    savedValues,
    errors,
    onChange,
    onBlur,
    onDelete,
    saved,
  };
};
