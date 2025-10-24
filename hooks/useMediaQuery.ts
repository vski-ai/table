import { useSignal, useSignalEffect } from "@preact/signals";

export function useMediaQuery(query: string) {
  const matches = useSignal(
    globalThis.innerWidth <= parseInt(
      query.match(/\d+/ig)?.at(0) ?? "768",
    ),
  );

  useSignalEffect(() => {
    if (typeof window !== "undefined") {
      const media = globalThis.matchMedia(query);
      if (media.matches !== matches.value) {
        matches.value = media.matches;
      }
      const listener = () => {
        matches.value = media.matches;
      };
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  });

  return matches;
}
