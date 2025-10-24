import { type JSX } from "preact";
import SlidersIcon from "lucide-react/dist/esm/icons/sliders-horizontal.js";

interface ColumnMenuProps {
  title?: string;
  children?: JSX.Element;
}

export const ColumnMenu = ({ children, title }: ColumnMenuProps) => {
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <button
        className="btn btn-ghost btn-sm w-10 h-10"
        title={title}
      >
        <SlidersIcon />
      </button>

      <div class="dropdown-content z-100 mt-4">
        {children}
      </div>
    </div>
  );
};
