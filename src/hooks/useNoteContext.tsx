import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { useHistory } from "react-router-dom";
import { db, Note, UserNoteFields } from "db";

export interface NoteContextType {
  notes: Note[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  onFilterChange: React.ChangeEventHandler<HTMLInputElement>;
  getNote(slug: string): Promise<Note | undefined>;
  createNote(values: UserNoteFields): Promise<Note>;
  deleteNote(noteId: number): Promise<void>;
  updateNote(noteId: number, values: UserNoteFields): Promise<Note>;
}

export const NoteContext = createContext<NoteContextType | undefined>(
  undefined
);

export const ProvideNoteContext: React.FC = ({ children }) => {
  const history = useHistory();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState("");

  const getNote = useCallback(async (slug: string) => {
    return db.get(slug);
  }, []);

  const createNote = useCallback(async (values) => {
    const result = await db.create(values);
    setNotes((previous) => [...previous, result]);
    return result;
  }, []);

  const updateNote = useCallback(async (noteId, values) => {
    const result = await db.update(noteId, values);
    setNotes((previous) =>
      previous.map((note) => (note.id === result.id ? result : note))
    );
    return result;
  }, []);

  const deleteNote = useCallback(
    async (noteId) => {
      await db.remove(noteId);
      setNotes((previous) => previous.filter((note) => note.id !== noteId));
      history.push("/");
    },
    [history]
  );

  const onFilterChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      setFilter(e.currentTarget.value);
    },
    []
  );

  useEffect(() => {
    const refreshNotes = async () => {
      if (filter) {
        const notes = await db.listWithFilter(filter);
        setNotes(notes);
      } else {
        const notes = await db.list();
        setNotes(notes);
      }
    };
    refreshNotes();
  }, [filter]);

  const ctx = {
    notes,
    filter,
    setFilter,
    onFilterChange,
    getNote,
    createNote,
    updateNote,
    deleteNote,
  };

  return <NoteContext.Provider value={ctx}>{children}</NoteContext.Provider>;
};

export const useNoteContext = () => {
  const ctx = useContext(NoteContext);
  if (ctx === undefined) {
    throw new Error("Note Context must be used within ProvideNoteContext");
  }
  return ctx;
};
