export const matches = (el: unknown, selector: string): boolean =>
  el instanceof Element && el.matches(selector);
