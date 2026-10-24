import type React from "react";

/* Props that stop a reader selecting, copying, cutting, dragging or
   right-clicking a statement (into a translator or a chatbot, say), for the
   places where the problem is a competition: a duel and a contest round.
   Anything inside `keep` (the samples) stays copyable, since pasting them into
   one's own program is what they are for. This only raises the bar: the text
   is still on the page. */
export function noCopy(keep: string): {
  style: React.CSSProperties;
  onCopy: (e: React.SyntheticEvent) => void;
  onCut: (e: React.SyntheticEvent) => void;
  onContextMenu: (e: React.SyntheticEvent) => void;
  onDragStart: (e: React.SyntheticEvent) => void;
} {
  const block = (e: React.SyntheticEvent) => {
    if (!(e.target instanceof Element && e.target.closest(keep))) e.preventDefault();
  };
  return {
    style: { userSelect: "none", WebkitUserSelect: "none" },
    onCopy: block, onCut: block, onContextMenu: block, onDragStart: block,
  };
}

/* What the kept part sets back, since user-select is inherited. */
export const COPYABLE: React.CSSProperties = { userSelect: "text", WebkitUserSelect: "text" };
