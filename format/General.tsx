import { Signal } from "@preact/signals";
import { NumberFormatting } from "./Number.tsx";
import { StyleFormatting } from "./Style.tsx";
import { DateFormatting } from "./Date.tsx";

export const GeneralFormatting = (
  { column, formatting }: { column: string; formatting: Signal<any> },
) => (
  <ul class="menu p-2 mt-0 bg-base-100 w-full gap-6">
    <li tabIndex={2}>
      <StyleFormatting column={column} formatting={formatting} />
    </li>
    <li tabIndex={4}>
      <NumberFormatting column={column} formatting={formatting} />
    </li>
    <li tabIndex={6}>
      <DateFormatting column={column} formatting={formatting} />
    </li>
  </ul>
);
