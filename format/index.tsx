import { Signal, useSignal } from "@preact/signals";
import { GenericEventHandler } from "preact";
import { NumberFormatting } from "./Number.tsx";
import { StyleFormatting } from "./Style.tsx";
import { DateFormatting } from "./Date.tsx";

export const Formatting = (
  { column, formatting }: { column: string; formatting: Signal<any> },
) => {
  const active = useSignal("0");
  const setActive: GenericEventHandler<HTMLInputElement> = (ev) => {
    active.value = (ev.target as HTMLInputElement)?.value;
  };
  return (
    <div>
      <form className="join">
        <input
          className="join-item btn w-1/3"
          type="radio"
          name="options"
          aria-label="Style"
          value="0"
          onChange={setActive}
          checked={active.value === "0"}
        />
        <input
          className="join-item btn w-1/3"
          type="radio"
          name="options"
          aria-label="Number"
          value="1"
          onChange={setActive}
          checked={active.value === "1"}
        />
        <input
          className="join-item btn w-1/3"
          type="radio"
          name="options"
          aria-label="Datetime"
          value="2"
          onChange={setActive}
          checked={active.value === "2"}
        />
      </form>

      {active.value === "0" && (
        <StyleFormatting column={column} formatting={formatting} />
      )}
      {active.value === "1" && (
        <NumberFormatting column={column} formatting={formatting} />
      )}
      {active.value === "2" && (
        <DateFormatting column={column} formatting={formatting} />
      )}
    </div>
  );
};
