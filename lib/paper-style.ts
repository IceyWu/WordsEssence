import type { Essay } from "./types";
import { toLines } from "./format";

export type PaperVariant = "cream" | "ruled" | "index" | "sticky";
export type InkColor = "ink-blueblack" | "ink-black" | "ink-sepia";
export type TapeKind =
  | "none"
  | "tape"
  | "tape--amber"
  | "tape--blue"
  | "tape--rose"
  | "clip";

export interface PaperStyle {
  variant: PaperVariant;
  ink: InkColor;
  tape: TapeKind;
  /** rotation in degrees, small */
  tilt: number;
}

const INKS: InkColor[] = ["ink-blueblack", "ink-black", "ink-sepia"];

/**
 * Derive a stable, "scattered desk" look for an entry from its id, so a note
 * always keeps the same paper, ink and tilt across renders. Short quotes get
 * sticky notes; everything else rotates through cream / ruled / index.
 */
export function paperStyleFor(essay: Essay): PaperStyle {
  const id = essay.id;
  const lines = toLines(essay.content);
  const len = essay.content.length;
  const short = lines.length <= 2 && len <= 18;

  const variant: PaperVariant = short
    ? "sticky"
    : (["cream", "ruled", "index", "cream"] as const)[id % 4];

  const ink: InkColor = INKS[id % INKS.length];

  const tapeOptions: TapeKind[] =
    variant === "sticky"
      ? ["none", "none"]
      : ["tape", "tape--amber", "tape--blue", "tape--rose", "clip", "none"];
  const tape = tapeOptions[id % tapeOptions.length];

  // deterministic small tilt in [-2.4, 2.4]
  const tilt = (((id * 73) % 49) - 24) / 10;

  return { variant, ink, tape, tilt };
}
