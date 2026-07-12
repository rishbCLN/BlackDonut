import { AnimatePresence, animate, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ContactSection from "../Contact/ContactSection";
import InlineDonutCanvas from "../Hero/InlineDonutCanvas";

const SECTION_IDS = ["services", "impact", "work", "process", "testimonials", "pricing"];
const EXIT_THRESHOLD = 140;
const CONTACT_ENTER_THRESHOLD = 160;
const CONTACT_TOUCH_THRESHOLD = 72;
const CONTACT_PROGRESS_START = 0.82;
const TRANSITION_PROGRESS_START = 0;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mapSiteDonutProgress(progress: number) {
  return clamp(progress, 0, 1) * CONTACT_PROGRESS_START;
}

type ContactStage = "idle" | "transition" | "visible";

interface Props {
  children: React.ReactNode[];
  disabled?: boolean;
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  resetSignal?: number;
  onExitBackward?: () => void;
}

export default function SiteCarousel({ children, disabled = false, activeIndex, onActiveChange, resetSignal, onExitBackward }: Props) {
  const [internalActive, setInternalActive] = useState(0);
  const [contactStage, setContactStage] = useState<ContactStage>("idle");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contactWrapperRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const exitCarryRef = useRef(0);
  const enterCarryRef = useRef(0);
  const contactExitCarryRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const contactTouchStartYRef = useRef<number | null>(null);
  const siteDonutProgressRef = useRef(0);
  const contactProgressRef = useRef(TRANSITION_PROGRESS_START);
  const contactStageRef = useRef<ContactStage>("idle");
  const lastResetSignal = useRef(resetSignal);
  const transitionControlsRef = useRef<Array<{ stop: () => void }>>([]);
  const active = activeIndex ?? internalActive;
  const isContactVisible = contactStage !== "idle";

  useEffect(() => {
    contactStageRef.current = contactStage;
  }, [contactStage]);

  const updateActive = useCallback(
    (next: number) => {
      if (activeIndex === undefined) {
        setInternalActive(next);
      }

      onActiveChange?.(next);
    },
    [activeIndex, onActiveChange],
  );

  const scrollToIndex = useCallback((index: number) => {
    const wrapper = wrapperRef.current;
    const section = sectionRefs.current[index];

    if (!section || !wrapper) {
      return;
    }

    wrapper.scrollTo({
      top: Math.max(0, section.offsetTop - 28),
      behavior: "smooth",
    });
  }, []);

  const stopContactTransition = useCallback(() => {
    transitionControlsRef.current.forEach((control) => control.stop());
    transitionControlsRef.current = [];
  }, []);

  const closeContactTransition = useCallback(() => {
    if (contactStageRef.current === "idle") {
      return;
    }

    stopContactTransition();
    contactStageRef.current = "idle";
    setContactStage("idle");
    contactProgressRef.current = TRANSITION_PROGRESS_START;
    siteDonutProgressRef.current = CONTACT_PROGRESS_START;
    contactExitCarryRef.current = 0;
    contactTouchStartYRef.current = null;
  }, [stopContactTransition]);

  const startContactTransition = useCallback(() => {
    if (contactStageRef.current !== "idle") {
      return;
    }

    contactStageRef.current = "transition";
    setContactStage("transition");
    enterCarryRef.current = 0;
    touchStartYRef.current = null;
    siteDonutProgressRef.current = CONTACT_PROGRESS_START;
    contactProgressRef.current = TRANSITION_PROGRESS_START;
    stopContactTransition();

    const progressControl = animate(TRANSITION_PROGRESS_START, 1, {
      duration: 1.72,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        contactProgressRef.current = value;
      },
      onComplete: () => {
        contactStageRef.current = "visible";
        contactProgressRef.current = 1;
        setContactStage("visible");
      },
    });

    transitionControlsRef.current = [progressControl];
  }, [stopContactTransition]);

  useEffect(() => {
    return () => {
      stopContactTransition();
    };
  }, [stopContactTransition]);

  useEffect(() => {
    if (contactStage !== "visible") {
      contactExitCarryRef.current = 0;
      contactTouchStartYRef.current = null;
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const contactWrapper = contactWrapperRef.current;
      if (!contactWrapper) {
        return;
      }

      if (["ArrowUp", "PageUp"].includes(event.key) && contactWrapper.scrollTop <= 2) {
        event.preventDefault();
        closeContactTransition();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeContactTransition, contactStage]);

  useEffect(() => {
    if (disabled) return;

    const wrapper = wrapperRef.current;

    if (!wrapper) return;

    const getMaxScroll = () => Math.max(1, wrapper.scrollHeight - wrapper.clientHeight);
    const isAtBottom = () => wrapper.scrollTop >= getMaxScroll() - 2;

    const syncSiteProgress = () => {
      if (contactStageRef.current !== "idle") {
        return;
      }

      const maxScroll = getMaxScroll();
      const rawProgress = wrapper.scrollTop / maxScroll;
      siteDonutProgressRef.current = mapSiteDonutProgress(rawProgress);
    };

    syncSiteProgress();

    const handleWheel = (event: WheelEvent) => {
      if (contactStageRef.current !== "idle") {
        return;
      }

      if (onExitBackward && wrapper.scrollTop <= 2 && event.deltaY < 0) {
        exitCarryRef.current += Math.abs(event.deltaY);

        if (exitCarryRef.current >= EXIT_THRESHOLD) {
          exitCarryRef.current = 0;
          onExitBackward();
        }

        return;
      }

      exitCarryRef.current = 0;

      if (event.deltaY > 0 && isAtBottom()) {
        enterCarryRef.current += Math.abs(event.deltaY);

        if (enterCarryRef.current >= CONTACT_ENTER_THRESHOLD) {
          startContactTransition();
        }

        return;
      }

      enterCarryRef.current = 0;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (contactStageRef.current !== "idle") {
        return;
      }

      if (onExitBackward && ["ArrowUp", "PageUp"].includes(event.key) && wrapper.scrollTop <= 2) {
        event.preventDefault();
        onExitBackward();
        return;
      }

      if (["ArrowDown", "PageDown", " ", "Enter"].includes(event.key) && isAtBottom()) {
        event.preventDefault();
        startContactTransition();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (contactStageRef.current !== "idle" || event.touches.length === 0) {
        return;
      }

      touchStartYRef.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (contactStageRef.current !== "idle" || touchStartYRef.current === null || event.touches.length === 0) {
        return;
      }

      const delta = touchStartYRef.current - event.touches[0].clientY;

      if (delta <= 0 || !isAtBottom()) {
        enterCarryRef.current = 0;
        return;
      }

      enterCarryRef.current = delta;

      if (delta >= CONTACT_TOUCH_THRESHOLD) {
        event.preventDefault();
        startContactTransition();
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
      enterCarryRef.current = 0;
    };

    wrapper.addEventListener("scroll", syncSiteProgress, { passive: true });
    wrapper.addEventListener("wheel", handleWheel, { passive: true });
    wrapper.addEventListener("touchstart", handleTouchStart, { passive: true });
    wrapper.addEventListener("touchmove", handleTouchMove, { passive: false });
    wrapper.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      wrapper.removeEventListener("scroll", syncSiteProgress);
      wrapper.removeEventListener("wheel", handleWheel);
      wrapper.removeEventListener("touchstart", handleTouchStart);
      wrapper.removeEventListener("touchmove", handleTouchMove);
      wrapper.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [disabled, onExitBackward, startContactTransition]);

  useEffect(() => {
    if (disabled) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const nextIndex = Number((visibleEntry.target as HTMLElement).dataset.sectionIndex ?? 0);
        if (!Number.isNaN(nextIndex) && nextIndex !== active) {
          updateActive(nextIndex);
        }
      },
      {
        root: wrapper,
        threshold: [0.35, 0.5, 0.68],
        rootMargin: "-14% 0px -18% 0px",
      },
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [active, children.length, disabled, updateActive]);

  useEffect(() => {
    const hasResetRequest = resetSignal !== undefined && resetSignal !== lastResetSignal.current;
    if (!hasResetRequest || isContactVisible) {
      return;
    }

    scrollToIndex(activeIndex ?? active);
    lastResetSignal.current = resetSignal;
  }, [active, activeIndex, isContactVisible, resetSignal, scrollToIndex]);

  if (disabled) {
    return null;
  }

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="site-scroll-shell fixed inset-0 overflow-y-auto overflow-x-hidden bg-[#090612]"
    >
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.04),transparent_16%),radial-gradient(circle_at_50%_66%,rgba(107,233,255,0.08),transparent_24%),linear-gradient(180deg,rgba(5,3,10,0.1)_0%,rgba(5,3,10,0.18)_28%,rgba(5,3,10,0.42)_100%)]" />
        <div className="absolute inset-0 opacity-[0.98]">
          <InlineDonutCanvas spinProgressRef={siteDonutProgressRef} motionMode="site" />
        </div>
      </div>

      <div className="relative z-[3] min-h-full pb-20">
        {children.map((child, index) => (
          <section
            key={SECTION_IDS[index] ?? index}
            id={SECTION_IDS[index]}
            ref={(element) => {
              sectionRefs.current[index] = element;
            }}
            data-section-index={index}
            className="relative min-h-screen scroll-mt-28"
          >
            {child}
          </section>
        ))}
      </div>

      {!isContactVisible && null}

      <AnimatePresence>
        {isContactVisible && (
          <motion.div
            ref={contactWrapperRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onWheel={(event) => {
              if (contactStage !== "visible") {
                return;
              }

              const currentTarget = event.currentTarget;
              if (currentTarget.scrollTop > 2 || event.deltaY >= 0) {
                contactExitCarryRef.current = 0;
                return;
              }

              contactExitCarryRef.current += Math.abs(event.deltaY);

              if (contactExitCarryRef.current >= CONTACT_ENTER_THRESHOLD) {
                closeContactTransition();
              }
            }}
            onTouchStart={(event) => {
              if (contactStage !== "visible" || event.touches.length === 0) {
                return;
              }

              contactTouchStartYRef.current = event.touches[0].clientY;
            }}
            onTouchMove={(event) => {
              if (contactStage !== "visible" || contactTouchStartYRef.current === null || event.touches.length === 0) {
                return;
              }

              const currentTarget = event.currentTarget;
              const delta = contactTouchStartYRef.current - event.touches[0].clientY;

              if (currentTarget.scrollTop > 2 || delta >= 0) {
                contactExitCarryRef.current = 0;
                return;
              }

              contactExitCarryRef.current = Math.abs(delta);

              if (contactExitCarryRef.current >= CONTACT_TOUCH_THRESHOLD) {
                closeContactTransition();
              }
            }}
            onTouchEnd={() => {
              contactTouchStartYRef.current = null;
              contactExitCarryRef.current = 0;
            }}
            className="contact-scroll-shell fixed inset-0 z-[70] overflow-y-auto overflow-x-hidden bg-[#04020a]"
          >
            <div className="pointer-events-none absolute inset-0 violet-speckles opacity-60" />
            <div className="pointer-events-none absolute inset-[-16%] section-spectrum-backdrop opacity-95" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.04),rgba(109,233,255,0.08)_14%,rgba(4,2,10,0.24)_36%,rgba(4,2,10,0.92)_72%,rgba(4,2,10,1)_100%)]" />
            <div className="pointer-events-none absolute left-1/2 top-[48%] z-[1] h-[26rem] w-[62rem] max-w-[96vw] -translate-x-1/2 -translate-y-1/2 section-spectrum-glow opacity-80" />

            {contactStage === "transition" && (
              <div className="pointer-events-none fixed inset-0 z-[5]">
                <InlineDonutCanvas spinProgressRef={contactProgressRef} motionMode="transition" />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.82, delay: 1.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ pointerEvents: contactStage === "visible" ? "auto" : "none" }}
              className="relative z-[3] flex min-h-full items-center px-4 py-8 md:px-10"
            >
              <div className="mx-auto w-full max-w-6xl">
                <ContactSection className="min-h-[calc(100vh-4rem)] py-6 md:py-10" sectionId="contact" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
