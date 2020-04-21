import React from "react";
import { useParams } from "react-router-dom";
import { MainPanel, RenderedNote, CreateNoteFAB } from "components";
import { useNote } from "hooks";

export const Note: React.FC = () => {
  const { slug } = useParams();
  const { note } = useNote(slug ?? "");

  return (
    <MainPanel>
      {note ? <RenderedNote note={note} /> : <div>not found</div>}
      <CreateNoteFAB />
    </MainPanel>
  );
};
