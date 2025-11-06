import { h } from "preact";
import GithubIcon from "lucide-react/dist/esm/icons/github.js";
import TwitterIcon from "lucide-react/dist/esm/icons/twitter.js";

export function Header() {
  return (
    <div class="absolute md:fixed top-5 right-12 flex items-center gap-2 z-100">
      <div class="badge badge-lg badge-warning">pre-alpha</div>
      <a
        href="https://github.com/vski/table"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-ghost btn-circle"
      >
        <GithubIcon />
      </a>
      <a
        href="https://twitter.com/vski"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-ghost btn-circle"
      >
        <TwitterIcon />
      </a>
      <a href="/hire" class="btn btn-ghost">Hire Me</a>
    </div>
  );
}
