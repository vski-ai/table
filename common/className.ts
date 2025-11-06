export const className = (cn: Record<string, boolean>) => {
  return Object.keys(cn).filter((key) => cn[key]).join(" ");
};

export const cn = className;
