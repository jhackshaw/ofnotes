import { useState, useEffect, useCallback } from "react";
import { Note } from "db";
import { useNoteContext } from "hooks";

export const useNote = (slug: string | undefined) => {
  const { getNote } = useNoteContext();
  const [loading] = useState(true);
  const [note, setNote] = useState<Note | null>(null);

  const refreshNote = useCallback(
    async (slug: string | undefined) => {
      setNote(null);
      if (!slug) {
        return;
      }
      const note = await getNote(slug);
      setNote(note ?? null);
    },
    [getNote]
  );

  useEffect(() => {
    refreshNote(slug);
  }, [slug, refreshNote]);

  return {
    noteId: note?.id,
    note,
    loading,
  };
};
