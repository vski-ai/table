import { TechStack } from "./TechStack.tsx";
import { VskiTableLogo } from "../icons/VskiTableLogo.tsx";

export function Hero() {
  return (
    <div class="hero min-h-[calc(100vh-500px)] bg-transparent">
      <div class="hero-content text-center">
        <div class="max-w-lg">
          <div class="flex justify-center items-center mb-6">
            <VskiTableLogo />
          </div>
          <p class="my-6 py-6 text-2xl">
            Powerful and Flexible Data-Table Engine.
          </p>
          <a class="btn btn-lg btn-outline" href="/about">Roadmap</a>
          {/* <a href="/flat" class="btn btn-ghost">Get Started</a> */}

          <div class="my-10"></div>
          <TechStack />
        </div>
      </div>
    </div>
  );
}
