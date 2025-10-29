import { memo } from "preact/compat";

/**
 * This is a vertival line drawn from the group caret to bottom of the group
 */
export const GroupLevelLine = memo((
  { level, height, caretSize }: {
    level: number;
    height: number;
    caretSize: number;
  },
) => {
  return new Array(level).fill(0).map((_, i) => (
    <span
      key={i}
      style={{
        height: height + "px",
        top: -(height / 2),
        left: caretSize * (i + 1) + (caretSize / 2),
      }}
      class="absolute border-l-1 border-dashed dark:opacity-50"
    >
    </span>
  ));
});

/**
 * This is a line pointing to the group name (---- )
 */
export const GroupLinePointer = memo((
  { level, height }: { level: number; height: number },
) => {
  return (
    <span
      class="border-b-1 border-dashed absolute left-0 dark:opacity-50"
      style={{
        top: (height / 2) + "px",
        left: (16 * (level ?? 0)) + (16 / 2 + 1) + "px",
        width: (16) + "px",
      }}
    >
    </span>
  );
});
