import { h } from "preact";
import { TextPageLayout } from "./components/TextPageLayout.tsx";
import GithubIcon from "lucide-react/dist/esm/icons/github.js";
import LinkedinIcon from "lucide-react/dist/esm/icons/linkedin.js";
import Mail from "lucide-react/dist/esm/icons/at-sign.js";
import HireIcon from "lucide-react/dist/esm/icons/flame.js";

export function HireMe() {
  return (
    <TextPageLayout>
      <div class="flex flex-row justify-center items-center gap-12">
        {
          /* <div class="avatar">
          <img
            class="w-28 rounded-full"
            src={face}
          />
        </div> */
        }
        <div class="flex flex-col mt-12">
          <h2 class="text-sm font-bold pb-2">
            Anton Nesterov
          </h2>
          <div class="flex gap-4 justify-around">
            <a
              href="https://github.com/nesterow"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost btn-circle text-accent"
            >
              <GithubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/anton-alex-nesterov/"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost btn-circle text-sky-500"
            >
              <LinkedinIcon />
            </a>
            <a
              class="btn btn-ghost btn-circle text-primary"
              href="mailto:an+hire@vski.sh"
            >
              <Mail />
            </a>
          </div>
        </div>
      </div>

      <div class="mt-2 p-12 text-center">
        <p class="text-2xl font-semibold">
          Want to make things that actually work?
        </p>
        <span class="inline-block mt-4 p-1 text-md">
          Hi! I am sofware engineer living in Valencia, Spain, but Usually
          working US hours. Over decade of experience building best solutions.
        </span>
      </div>

      <div class="mt-0 text-center">
        <a
          class="btn btn-sm btn-outline"
          href="https://www.linkedin.com/in/anton-alex-nesterov/"
        >
          <HireIcon />
          Contact
        </a>
      </div>

      <div class="mt-22 flex justify-center text-sm">
        see my other projects:
      </div>
      <div class="mt-2 flex justify-center gap-1 text-xs">
        <a href="https://vski.science/">vski·science</a> -{" "}
        <a href="https://vski.sh">vski·sh</a>
      </div>
    </TextPageLayout>
  );
}
