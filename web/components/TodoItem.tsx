import { ComponentChildren } from "preact";

type TodoItemProps = {
  done?: boolean;
  children: ComponentChildren;
  start?: boolean;
};

export const TodoItem = ({
  done,
  start,
  children,
}: TodoItemProps) => {
  return (
    <li class="m-0!" style={{ alignItems: !start ? "center" : "start" }}>
      <hr />
      <div class="timeline-end timeline-box w-100">
        {children}
      </div>
      <div class="timeline-start">
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
      <hr />
    </li>
  );
};
