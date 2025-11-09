export type StyleScope = "column" | "row" | "cell";

export interface CellStyle extends Record<string, string | undefined> {
  "color"?: string;
  "background-color"?: string;
  "font-weight"?: "normal" | "bold";
  "font-style"?: "normal" | "italic";
  "text-Decoration"?: "none" | "underline";
}
