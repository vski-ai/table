import { Signal } from "@preact/signals";

const UNITS = Intl.supportedValuesOf("unit");

export interface UnitSelectorProps {
  data: Signal<string>;
  className?: string;
}

export const UnitSelector = ({ className = "", data }: UnitSelectorProps) => {
  return (
    <select
      onChange={(e) => data.value = e.target.value}
      defaultValue={data.value}
      className={"select select-sm " + className}
    >
      <option value={data.value} disabled>Select Unit</option>
      {UNITS.map((unit) => <option value={unit}>{unit}</option>)}
    </select>
  );
};
