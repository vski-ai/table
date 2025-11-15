export const getDefaultColor = (fallback = "#fff") =>
  typeof document !== "undefined" && "getDefaultComputedStyle" in globalThis
    // @ts-ignore:
    ? globalThis.getDefaultComputedStyle(
      document.body.querySelector(".vt td") ??
        document.body.querySelector(".vt") ?? document.body,
    )
      .getPropertyValue("color")
    : fallback;
