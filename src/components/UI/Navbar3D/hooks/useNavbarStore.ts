import { useSyncExternalStore } from "react";
import { clamp01 } from "../constants";

export type NavbarState = {
  activeNavIndex: number;
  hoveredNavIndex: number;
  scrollProgress: number;
  scrollVelocity: number;
  mouseX: number;
  mouseY: number;
  reducedMotion: boolean;
};

type Listener = () => void;

type Store = {
  getState: () => NavbarState;
  setState: (partial: Partial<NavbarState>) => void;
  subscribe: (listener: Listener) => () => void;
};

const listeners = new Set<Listener>();

let state: NavbarState = {
  activeNavIndex: 0,
  hoveredNavIndex: -1,
  scrollProgress: 0,
  scrollVelocity: 0,
  mouseX: 0.5,
  mouseY: 0.5,
  reducedMotion: false,
};

export const navbarStore: Store = {
  getState: () => state,
  setState: (partial) => {
    state = {
      ...state,
      ...partial,
      scrollProgress: partial.scrollProgress === undefined ? state.scrollProgress : clamp01(partial.scrollProgress),
    };
    listeners.forEach((listener) => listener());
  },
  subscribe: (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useNavbarStore<T>(selector: (next: NavbarState) => T) {
  return useSyncExternalStore(
    navbarStore.subscribe,
    () => selector(navbarStore.getState()),
    () => selector(navbarStore.getState())
  );
}

export const navbarActions = {
  setActiveNavIndex: (activeNavIndex: number) => navbarStore.setState({ activeNavIndex }),
  setHoveredNavIndex: (hoveredNavIndex: number) => navbarStore.setState({ hoveredNavIndex }),
  setMouse: (mouseX: number, mouseY: number) => navbarStore.setState({ mouseX, mouseY }),
  setScroll: (scrollProgress: number, scrollVelocity: number) =>
    navbarStore.setState({ scrollProgress, scrollVelocity }),
  setReducedMotion: (reducedMotion: boolean) => navbarStore.setState({ reducedMotion }),
};
