export const NAV_ITEMS = ["Work", "About", "Process", "Contact"] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export const ACCENT_RGB: Array<[number, number, number]> = [
  [0.0, 1.0, 1.0],
  [0.545, 0.361, 0.965],
  [1.0, 0.176, 0.471],
  [1.0, 1.0, 1.0],
];

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function clamp01(value: number) {
  return clamp(value, 0, 1);
}
