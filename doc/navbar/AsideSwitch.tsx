import MenuIcon from "lucide-react/dist/esm/icons/menu.js";
import LogsIcon from "lucide-react/dist/esm/icons/logs.js";
import { ui } from "../state.ts";

export function AsideSwitch() {
  return (
    <a
      role="button"
      className="btn btn-circle ml-2 border border-primary text-primary"
      onClick={() => {
        ui.value.aside = ui.value.aside == "1" ? "0" : "1";
        ui.value = { ...ui.value };
      }}
    >
      <LogsIcon
        className="hidden aside-open:block"
        style={{ width: "24px", height: "24px" }}
      />
      <MenuIcon
        className="block aside-open:hidden"
        style={{ width: "24px", height: "24px" }}
      />
    </a>
  );
}

export default AsideSwitch;
