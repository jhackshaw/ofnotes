import { useState, useEffect, useCallback, useRef } from "react";
import { useNote, useNoteContext } from "hooks";
import { UserNoteFields, UnsavedNote } from "db";

const newNote: UserNoteFields = {
  title: "",
  md: "",
  tags: [],
};

type Errors = {
  [K in keyof UserNoteFields]?: string;
};

export const useNoteForm = (slug: string | undefined) => {
  const { createNote, updateNote, deleteNote } = useNoteContext();
  const { note } = useNote(slug);
  const [values, setValues] = useState<UserNoteFields>(newNote);
  const [savedValues, setSavedValues] = useState<UnsavedNote>(newNote);
  const [errors, setErrors] = useState<Errors>({});
  const shouldUpdate = useRef(false);

  const noteId = savedValues?.id;

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.persist();
      setValues((previous) => ({
        ...previous,
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
          setSavedValues(result);
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
        setSavedValues(result);
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
    });
    setErrors({});
    setSavedValues(note ?? newNote);
    shouldUpdate.current = false;
  }, [note]);

  return {
    values,
    savedValues,
    errors,
    onChange,
    onBlur,
    onDelete,
  };
};
