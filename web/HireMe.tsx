import { h } from "preact";
import { TextPageLayout } from "./components/TextPageLayout.tsx";
import GithubIcon from "lucide-react/dist/esm/icons/github.js";
import LinkedinIcon from "lucide-react/dist/esm/icons/linkedin.js";

export function HireMe() {
  return (
    <TextPageLayout>
      <div class="flex flex-row justify-center items-center gap-6">
        <div class="avatar">
          <img
            class="w-28 rounded-full"
            src="https://avatars.githubusercontent.com/u/1024025?v=4"
          />
        </div>
        <div class="flex flex-col">
          <h2 class="text-md font-bold pb-2 m-0!">
            Anton V.
          </h2>
          <div class="flex gap-4">
            <a
              href="https://github.com/vski"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost btn-circle"
            >
              <GithubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/anton-v-baker/"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost btn-circle"
            >
              <LinkedinIcon />
            </a>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-2xl font-semibold">
          "Want to make things that actually work?"
        </p>
        <p class="mt-4">
          Full-stack engineer with more than a decade of experience. Residing in
          Europe - Valencia, Spain.
        </p>
      </div>

      <div class="mt-12">
        <h2 class="text-3xl font-bold text-center">Tech Stack</h2>
        <div class="flex flex-wrap justify-center gap-4 mt-4">
          <div class="badge badge-lg badge-outline">React</div>
          <div class="badge badge-lg badge-outline">TypeScript</div>
          <div class="badge badge-lg badge-outline">Node.js</div>
          <div class="badge badge-lg badge-outline">Deno</div>
          <div class="badge badge-lg badge-outline">Go</div>
          <div class="badge badge-lg badge-outline">PostgreSQL</div>
          <div class="badge badge-lg badge-outline">AWS</div>
        </div>
      </div>
    </TextPageLayout>
  );
}
