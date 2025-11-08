import { TextPageLayout } from "./components/TextPageLayout.tsx";
import { TodoItem } from "./components/TodoItem.tsx";

export function About() {
  return (
    <div class="container container mx-auto w-full flex justify-center">
      <div class="w-full flex flex-col items-center">
        <h1 class="mt-12 mb-12 text-4xl font-bold text-center">
          Roadmap
        </h1>

        <ul class="timeline timeline-vertical! gap-6 w-16">
          <TodoItem start done>
            Core Features Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
            ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
          </TodoItem>
          <TodoItem start={false}>
            Core Features Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
            ipsum Lorem ipsum
          </TodoItem>
          <TodoItem>
            Core Features
          </TodoItem>
          <TodoItem>
            Core Features
          </TodoItem>
          <TodoItem>
            Core Features
          </TodoItem>
        </ul>
      </div>
    </div>
  );
}
