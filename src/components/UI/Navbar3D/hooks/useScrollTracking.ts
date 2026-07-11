import { useEffect } from "react";
import { clamp01 } from "../constants";
import { navbarActions, navbarStore } from "./useNavbarStore";

function progressToActiveIndex(progress: number) {
  const clamped = clamp01(progress);
  return Math.min(3, Math.max(0, Math.floor(clamped * 4)));
}

export default function useScrollTracking() {
  useEffect(() => {
    let raf = 0;
    let lastTime = performance.now();

    const KEYBOARD_STEP = 0.032;

    const handleWheel = (event: WheelEvent) => {
      const delta = event.deltaY;
      const next = clamp01(navbarStore.getState().scrollProgress + delta * 0.00055);
      const velocity = Math.min(120, Math.abs(delta));
      navbarActions.setScroll(next, velocity);
      navbarActions.setActiveNavIndex(progressToActiveIndex(next));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const forwardKeys = ["ArrowDown", "PageDown", " "];
      const backwardKeys = ["ArrowUp", "PageUp"];

      if (forwardKeys.includes(event.key)) {
        const next = clamp01(navbarStore.getState().scrollProgress + KEYBOARD_STEP);
        navbarActions.setScroll(next, 32);
        navbarActions.setActiveNavIndex(progressToActiveIndex(next));
        return;
      }

      if (backwardKeys.includes(event.key)) {
        const next = clamp01(navbarStore.getState().scrollProgress - KEYBOARD_STEP);
        navbarActions.setScroll(next, 32);
        navbarActions.setActiveNavIndex(progressToActiveIndex(next));
      }
    };

    const tick = (time: number) => {
      const dt = Math.max(0.001, (time - lastTime) / 1000);
      lastTime = time;

      const current = navbarStore.getState();
      const decay = Math.pow(0.0008, dt);
      const nextVelocity = current.scrollVelocity * decay;

      if (Math.abs(nextVelocity - current.scrollVelocity) > 0.01) {
        navbarActions.setScroll(current.scrollProgress, nextVelocity);
      }

      const nextActive = progressToActiveIndex(current.scrollProgress);
      if (nextActive !== current.activeNavIndex) {
        navbarActions.setActiveNavIndex(nextActive);
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(raf);
    };
  }, []);
}
