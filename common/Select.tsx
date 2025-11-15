import { FunctionComponent as FC } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { className, cn } from "./className.ts";
import { TargetedEvent } from "preact";
import SearchIcon from "lucide-react/dist/esm/icons/search.js";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const Select: FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
}) => {
  const isOpen = useSignal(false);
  const searchTerm = useSignal("");
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    isOpen.value = false;
    searchTerm.value = "";
  };

  const handleClickOutside = (event: globalThis.MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      isOpen.value = false;
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div class="relative w-full" ref={selectRef}>
      <div
        class={className([
          "border",
          "border-gray-300 dark:border-gray-700",
          "rounded-md",
          "p-2 px-3",
          "cursor-pointer",
          "flex",
          "justify-between",
          "items-center",
        ])}
        onClick={() => isOpen.value = !isOpen.value}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          class={`w-4 h-4 transition-transform ${
            isOpen.value ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen.value && (
        <div
          class={cn([
            "w-full ",
            "absolute z-10 mt-1",
            "bg-gray-100 dark:bg-gray-700",
            "border border-gray-300 dark:border-gray-900",
            "rounded-lg shadow-lg",
          ])}
        >
          <div class="p-2 join flex items-center">
            <SearchIcon className="join-item" />
            <input
              type="text"
              class="w-full px-2 py-1 border-none outline-none bg-transparent rounded-none join-item"
              placeholder="search..."
              value={searchTerm.value}
              onInput={(e: TargetedEvent<HTMLInputElement, InputEvent>) =>
                searchTerm.value = e.currentTarget?.value ?? ""}
            />
          </div>
          <ul class="py-1">
            {options
              .filter((option) =>
                option.label.toLowerCase().includes(
                  searchTerm.value.toLowerCase(),
                )
              )
              .map((option) => (
                <li
                  key={option.value}
                  class="px-4 py-2 cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-600"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};
