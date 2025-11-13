import { Hero } from "./components/Hero.tsx";
import { Background } from "./components/Background.tsx";
import { Features } from "./components/Features.tsx";
import { Header } from "./components/Header.tsx";
import { Demo } from "./components/Demo.tsx";
import { Roadmap } from "./components/Roadmap.tsx";
import { useRef } from "preact/hooks";

import NextIcon from "lucide-react/dist/esm/icons/chevron-down.js";

export function Home() {
  const demoRef = useRef<HTMLDivElement>(null);
  const goDemo = () => demoRef.current?.scrollIntoView({ behavior: "smooth" });

  const roadmapRef = useRef<HTMLDivElement>(null);
  const goRoadmap = () => {
    roadmapRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const featuresRef = useRef<HTMLDivElement>(null);
  const goFeatures = () =>
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div class="relative">
      <Header />
      <section class="absolute top-25 left-0 right-0 z-20">
        <Hero cta={goRoadmap} />
        <p class="-mt-12 mb-6 text-center w-full">
          <a onClick={goDemo} class="btn btn-circle btn-outline">
            <NextIcon />
          </a>
        </p>
        <p class="my-1 text-center w-full">
          Tables are <i>complex</i>. Building a <i>feature-rich</i> and{" "}
          <i>ai-enabled</i> table is a dauniting task. <br />
          <i class="inline-block mt-2">we are here to fix it</i>
        </p>
        <div ref={demoRef}>
          <Demo />
        </div>
        <p class="-mt-6 mb-6 text-center w-full">
          <a onClick={goRoadmap} class="btn btn-circle btn-outline">
            <NextIcon />
          </a>
        </p>
        <div>
          <Roadmap refEl={roadmapRef} />
        </div>
        <div ref={featuresRef}>
          <Features />
        </div>
        <footer class="footer footer-center p-4 bg-base-300 text-base-content">
          <div>
            <p>Copyright © 2025 - Anton A Nesterov</p>
          </div>
        </footer>
      </section>
      <Background />
    </div>
  );
}
