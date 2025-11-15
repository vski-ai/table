export const className = (
  cn: Record<string, boolean> | (string | boolean | undefined)[],
) => {
  if (Array.isArray(cn)) {
    return cn.filter(Boolean).join(" ");
  }
  return Object.keys(cn).filter((key) => cn[key]).join(" ");
};

export const cn = className;
