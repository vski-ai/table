import { TechStack } from "./TechStack.tsx";

export function Hero() {
  return (
    <div class="hero min-h-[calc(100vh-500px)] bg-transparent">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold mb-3">
            VSKI TABLE
          </h1>
          <p class="py-6 text-2xl">
            A powerful and flexible table for your data-driven applications.
          </p>
          <a class="btn btn-outline" href="/about">Roadmap</a>
          {/* <a href="/flat" class="btn btn-ghost">Get Started</a> */}

          <div class="my-10"></div>
          <TechStack />
        </div>
      </div>
    </div>
  );
}
