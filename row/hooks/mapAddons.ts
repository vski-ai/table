import { cloneElement } from "preact";

export const mapAddons = (e: any) => {
  if (!e) return e;
  e.props.children = cloneElement(e.props.children as any, {
    "data-loading-addon": true,
  });
  return e;
};
