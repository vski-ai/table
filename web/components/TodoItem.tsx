import { ComponentChildren } from "preact";
import { cn } from "@/common/className.ts";

type TodoItemProps = {
  done?: boolean;
  children: ComponentChildren;
  start?: boolean;
};

export const TodoItem = ({
  done,
  start = true,
  children,
}: TodoItemProps) => {
  return (
    <li class="m-0!">
      <div class="bg-sky-700/20 w-1 absolute h-[calc(100%+1.5em)]!" />
      <div
        class={cn({
          "timeline-start": start,
          "timeline-end": !start,
          "timeline-box w-100": true,
          "bg-gray-50/50 dark:bg-gray-700/50": true,
        })}
      >
        {children}
      </div>
      <div
        class={cn({
          "timeline-end": start,
          "timeline-start": !start,
        })}
      >
        {done
          ? (
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-5 h-5 text-primary"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          )
          : (
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.75 10a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z"
                clip-rule="evenodd"
              />
            </svg>
          )}
      </div>
    </li>
  );
};
