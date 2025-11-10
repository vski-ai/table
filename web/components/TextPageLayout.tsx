import { Background } from "./Background.tsx";
import { Header } from "./Header.tsx";

export function TextPageLayout({ children }: { children: any }) {
  return (
    <>
      <Header />
      <div class="relative min-h-screen flex justify-center">
        <div class="container z-1 flex justify-center mx-auto px-4 py-20 max-w-4xl">
          <div class="prose lg:prose-xl bg-base-100/30 p-8 rounded-none shadow-md">
            {children}
          </div>
        </div>
        <Background />
      </div>
    </>
  );
}
