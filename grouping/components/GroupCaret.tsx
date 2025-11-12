import ChevronRight from "lucide-react/dist/esm/icons/chevron-right-circle.js";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down-circle.js";

interface GroupCaretProps {
  size: number;
  active: boolean;
  level: number;
  onClick?: () => void;
  height?: number;
}

export const GroupCaret = (
  { active, size, onClick, level, height = 64 }: GroupCaretProps,
) => {
  const style = { width: size, height: size };
  return (
    <>
      <button
        type="button"
        role="checkbox"
        onClick={onClick}
        style={{
          marginLeft: (size * (level ?? 0)) + "px",
        }}
      >
        {active
          ? <ChevronDown style={style} />
          : <ChevronRight style={style} />}
      </button>
      {active
        ? (
          <span
            class="absolute border-l-1 border-dashed dark:opacity-50"
            style={{
              left: (size * (level + 1)) + size / 2 + "px",
              bottom: 0 + "px",
              height: height / 2 - size + "px",
            }}
          >
          </span>
        )
        : null}
    </>
  );
};
