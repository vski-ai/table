import { generateRows } from "./flat-table.ts";

console.log("Generating persistent data...");
Deno.writeTextFileSync(
  "./flat-persistent-data.json",
  JSON.stringify(generateRows(3000)),
);
console.log("Done");
