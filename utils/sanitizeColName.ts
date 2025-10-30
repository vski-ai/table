export function sanitizeColName(col: string) {
  return col.replace(/[^a-zA-Z0-9]/g, "_");
}
