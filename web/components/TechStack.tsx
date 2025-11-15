import { h } from "preact";
import { PreactLogo } from "../icons/PreactLogo.tsx";
import { DenoLogo } from "../icons/DenoLogo.tsx";
import { NodejsLogo } from "../icons/NodejsLogo.tsx";
import { WebWorkersLogo } from "../icons/WebWorkersLogo.tsx";
import { MicroFrontendsLogo } from "../icons/MicroFrontendsLogo.tsx";

const tech = [
  { name: "Preact", logo: <PreactLogo /> },
  { name: "Deno", logo: <DenoLogo /> },
  { name: "NodeJS", logo: <NodejsLogo /> },
  { name: "Web Workers", logo: <WebWorkersLogo /> },
  { name: "Micro-frontends", logo: <MicroFrontendsLogo /> },
];

export function TechStack() {
  return (
    <div class="flex flex-wrap justify-center items-center gap-4 mt-8 mb-8">
      {tech.map((t) => (
        <div
          class="flex items-center gap-2 p-2 rounded-lg bg-base-200"
          title={t.name}
        >
          {t.logo}
        </div>
      ))}
    </div>
  );
}
