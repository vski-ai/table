import { Hero } from "./components/Hero.tsx";
import { Background } from "./components/Background.tsx";
import { Features } from "./components/Features.tsx";
import { Header } from "./components/Header.tsx";

export function Home() {
  return (
    <div class="relative">
      <Header />
      <section class="absolute top-25 left-0 right-0 z-20">
        <Hero />
        <p class="my-1 text-center w-full">
          Tables are <i>incredibly complex</i>. Building a <i>feature-rich</i>
          {" "}
          and{" "}
          <i>ai-enabled</i>table is a dauniting task. This is why most
          developers avoid working with tables. <br />
          <strong class="inline-block mt-2">we are here to fix it</strong>
        </p>
        <Features />
        <footer class="footer footer-center p-4 bg-base-300 text-base-content">
          <div>
            <p>Copyright © 2025 - All right reserved by ACME Industries Ltd</p>
          </div>
        </footer>
      </section>
      <Background />
    </div>
  );
}
