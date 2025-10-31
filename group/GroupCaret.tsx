import { memo } from "preact/compat";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right-circle.js";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down-circle.js";

interface GroupCaretProps {
  size: number;
  active: boolean;
  level: number;
  onClick?: () => void;
  tabIndex?: number;
}

export const GroupCaret = memo((
  { active, size, onClick, level, tabIndex }: GroupCaretProps,
) => {
  const style = { width: size, height: size };
  return (
    <button
      type="button"
      role="checkbox"
      onClick={onClick}
      style={{
        marginLeft: (size * (level ?? 0)) + "px",
      }}
      tabIndex={tabIndex}
    >
      {active ? <ChevronDown style={style} /> : <ChevronRight style={style} />}
    </button>
  );
});
