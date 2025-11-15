type PxSliderProps = {
  title: string;
  value: string;
  onInput: (value: number) => void;
};

export function PxSlider({ title, value, onInput }: PxSliderProps) {
  return (
    <div class="border border-gray-200 dark:border-gray-700 rounded-md mt-6 p-2">
      <div class="flex justify-between">
        <p class="text-xs">{title}</p>
        <div>
          <input
            onInput={(ev) => onInput(Number(ev.currentTarget?.value))}
            type="text"
            class="border-none outline-none bg-transparent text-right"
            value={value}
          />
          px
        </div>
      </div>
      <div class="w-full">
        <input
          onInput={(ev) => onInput(Number(ev.currentTarget?.value))}
          type="range"
          min="30"
          max="200"
          value={value}
          class="range range-xs w-full"
          step="10"
        />
      </div>
    </div>
  );
}
