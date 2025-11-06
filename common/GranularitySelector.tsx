import { type JSX } from "preact";

interface GranularitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const GranularitySelector = (
  { value, onChange }: GranularitySelectorProps,
): JSX.Element => {
  return (
    <select
      class="select select-bordered"
      value={value}
      onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
    >
      <option value="auto">Auto</option>
      <option value="year">Year</option>
      <option value="month">Month</option>
      <option value="day">Day</option>
      <option value="hour">Hour</option>
      <option value="minute">Minute</option>
      <option value="second">Second</option>
    </select>
  );
};
