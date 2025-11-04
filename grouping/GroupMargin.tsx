import { memo } from "preact/compat";

interface GroupMarginProps {
  size: number;
  level: number;
}

// For parents w\o children we just calculate margin
export const GroupMargin = memo(({ size, level }: GroupMarginProps) => {
  return (
    <span
      style={{
        marginLeft: (size * (level ?? 0)) + 16 + "px",
      }}
    />
  );
});
