import { useEffect } from "react";
import { clamp01 } from "../constants";
import { navbarActions } from "./useNavbarStore";

export default function useMouseTracking() {
  useEffect(() => {
    let raf = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const x = clamp01(event.clientX / Math.max(1, window.innerWidth));
      const y = clamp01(event.clientY / Math.max(1, window.innerHeight));

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        navbarActions.setMouse(x, y);
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(raf);
    };
  }, []);
}
