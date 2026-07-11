import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, select, label, summary";

export default function CustomCursor() {
  const haloRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const dotPosRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const haloPosRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);
  const hoverRef = useRef(false);
  const pressedRef = useRef(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setEnabled(pointerQuery.matches && !reducedMotionQuery.matches);
    };

    update();
    pointerQuery.addEventListener("change", update);
    reducedMotionQuery.addEventListener("change", update);

    return () => {
      pointerQuery.removeEventListener("change", update);
      reducedMotionQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("has-custom-cursor");
      return undefined;
    }

    document.body.classList.add("has-custom-cursor");
    let animationFrame = 0;

    const applyVisualState = () => {
      const isVisible = visibleRef.current;
      const isHover = hoverRef.current;
      const isPressed = pressedRef.current;

      dotPosRef.current.x += (targetRef.current.x - dotPosRef.current.x) * 0.42;
      dotPosRef.current.y += (targetRef.current.y - dotPosRef.current.y) * 0.42;
      ringPosRef.current.x += (targetRef.current.x - ringPosRef.current.x) * (isHover ? 0.26 : 0.18);
      ringPosRef.current.y += (targetRef.current.y - ringPosRef.current.y) * (isHover ? 0.26 : 0.18);
      haloPosRef.current.x += (targetRef.current.x - haloPosRef.current.x) * 0.14;
      haloPosRef.current.y += (targetRef.current.y - haloPosRef.current.y) * 0.14;

      if (dotRef.current) {
        const dotScale = isPressed ? 0.84 : isHover ? 1.22 : 1;
        dotRef.current.style.opacity = isVisible ? "1" : "0";
        dotRef.current.style.transform = `translate3d(${dotPosRef.current.x}px, ${dotPosRef.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      }

      if (ringRef.current) {
        const ringScale = isPressed ? 0.9 : isHover ? 1.35 : 1;
        ringRef.current.style.opacity = isVisible ? "1" : "0";
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ringRef.current.style.borderColor = isHover ? "rgba(255,255,255,0.46)" : "rgba(183,124,255,0.4)";
        ringRef.current.style.background = isHover ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)";
      }

      if (haloRef.current) {
        const haloScale = isPressed ? 0.92 : isHover ? 1.4 : 1;
        haloRef.current.style.opacity = isVisible ? (isHover ? "0.75" : "0.45") : "0";
        haloRef.current.style.transform = `translate3d(${haloPosRef.current.x}px, ${haloPosRef.current.y}px, 0) translate(-50%, -50%) scale(${haloScale})`;
      }

      animationFrame = window.requestAnimationFrame(applyVisualState);
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      visibleRef.current = true;
      hoverRef.current = Boolean(event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR));
    };

    const handlePointerLeave = () => {
      visibleRef.current = false;
      hoverRef.current = false;
      pressedRef.current = false;
    };

    const handlePointerDown = () => {
      pressedRef.current = true;
    };

    const handlePointerUp = () => {
      pressedRef.current = false;
    };

    const handlePointerOver = (event: PointerEvent) => {
      hoverRef.current = Boolean(event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR));
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    animationFrame = window.requestAnimationFrame(applyVisualState);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerover", handlePointerOver);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div
        ref={haloRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "88px",
          height: "88px",
          borderRadius: "999px",
          background:
            "radial-gradient(circle, rgba(126,242,255,0.2) 0%, rgba(183,124,255,0.16) 34%, rgba(255,118,207,0.08) 54%, transparent 74%)",
          filter: "blur(14px)",
          pointerEvents: "none",
          zIndex: 99997,
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "42px",
          height: "42px",
          borderRadius: "999px",
          border: "1px solid rgba(183,124,255,0.4)",
          boxShadow: "0 0 30px rgba(183,124,255,0.12)",
          backdropFilter: "blur(6px)",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "12px",
          height: "12px",
          borderRadius: "999px",
          border: "2px solid rgba(6, 4, 12, 0.38)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(206,237,255,0.94), rgba(215,198,255,0.9))",
          boxShadow: "0 0 18px rgba(126,242,255,0.34), 0 0 24px rgba(183,124,255,0.22)",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
