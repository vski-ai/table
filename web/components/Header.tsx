import { ThemeSwitch } from "../navbar/ThemeSwitch.tsx";
import GithubIcon from "lucide-react/dist/esm/icons/github.js";
import TwitterIcon from "lucide-react/dist/esm/icons/twitter.js";
import HireIcon from "lucide-react/dist/esm/icons/flame.js";
import { ui } from "../state.ts";

export function Header() {
  return (
    <div class="absolute top-5 right-12 flex items-center gap-2 z-100">
      <a
        href="https://github.com/vski-ai/table"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-ghost btn-circle"
      >
        <GithubIcon />
      </a>
      <a
        href="https://x.com/vski_ai"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-ghost btn-circle"
      >
        <TwitterIcon />
      </a>
      <a href="/hire" class="btn btn-ghost text-amber-500">
        <HireIcon />
        Hire
      </a>

      <span class="mx-4">
        <ThemeSwitch theme={ui.value.theme!} />
      </span>
    </div>
  );
}
