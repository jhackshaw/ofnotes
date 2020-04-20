import { useState, useEffect, useCallback, useRef } from "react";
import { useNote, useNoteContext } from "hooks";
import { UserNoteFields, UnsavedNote } from "db";

const newNote: UserNoteFields = {
  title: "",
  md: "",
  tags: [],
};

type Timer = ReturnType<typeof setTimeout> | number | undefined;

export const useNoteForm = (slug: string | undefined) => {
  const { createNote, updateNote, deleteNote } = useNoteContext();
  const { note } = useNote(slug);
  const [values, setValues] = useState<UserNoteFields>(newNote);
  const [savedValues, setSavedValues] = useState<UnsavedNote>(newNote);
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

  // if creating, attempt to save note in DB on title field blur
  const onBlur: React.FocusEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      if (e.target.name === "title" && !noteId) {
        const result = await createNote(values);
        setSavedValues(result);
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
      const result = await updateNote(noteId, values);
      setSavedValues(result);
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
    setSavedValues(note ?? newNote);
    shouldUpdate.current = false;
  }, [note]);

  return {
    values,
    savedValues,
    onChange,
    onBlur,
    onDelete,
  };
};
