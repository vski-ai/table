import { TextPageLayout } from "./components/TextPageLayout.tsx";
import { TodoItem } from "./components/TodoItem.tsx";

export function About() {
  return (
    <TextPageLayout>
      <h1>About vski table</h1>
      <p>
        Tables are incredibly complex. They are the backbone of many
        applications, yet building a performant, feature-rich, and easy-to-use
        table component from scratch is a daunting task. Our mission is to
        provide a solid foundation for building data-driven applications, by
        offering a powerful and extensible table component that handles the
        complexity for you. We believe that developers should focus on their
        application's logic, not on the intricacies of table virtualization,
        data fetching, or state management.
      </p>

      <h2 class="mt-12 ml-6 mb-0!">Roadmap</h2>

      <ul class="timeline timeline-vertical! w-16 -mt-6!">
        <TodoItem start done>
          Core Features
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
        <TodoItem>
          Core Features
        </TodoItem>
      </ul>
    </TextPageLayout>
  );
}
