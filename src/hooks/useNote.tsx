import { useState, useEffect, useCallback } from "react";
import { Note } from "db";
import { useNoteContext } from "hooks";

interface NoteState {
  loading: boolean;
  note: Note | null;
}

export const useNote = (slug: string | undefined) => {
  const { getNote } = useNoteContext();
  const [noteState, setNoteState] = useState<NoteState>({
    note: null,
    loading: true,
  });

  const refreshNote = useCallback(
    async (slug: string | undefined) => {
      setNoteState({
        note: null,
        loading: Boolean(slug),
      });
      if (!slug) {
        return;
      }
      const note = await getNote(slug);
      setNoteState({
        note: note ?? null,
        loading: false,
      });
    },
    [getNote]
  );

  useEffect(() => {
    refreshNote(slug);
  }, [slug, refreshNote]);

  const { note, loading } = noteState;

  return {
    noteId: note?.id,
    note: note,
    loading: loading,
  };
};
