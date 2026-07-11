import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroSection from "./components/Hero/HeroSection";
import Navbar from "./components/UI/Navbar";
import SiteCarousel from "./components/Sections/SiteCarousel";
import ServicesSection from "./components/Sections/ServicesSection";
import StatsSection from "./components/Sections/StatsSection";
import WorksSection from "./components/Sections/WorksSection";
import ProcessSection from "./components/Sections/ProcessSection";
import TestimonialsSection from "./components/Sections/TestimonialsSection";
import PricingSection from "./components/Sections/PricingSection";

type FlowStage = "hero" | "site";
type OverlayDirection = "forward" | "backward";

export default function App() {
  const [stage, setStage] = useState<FlowStage>("hero");
  const [overlayDirection, setOverlayDirection] = useState<OverlayDirection>("forward");
  const [heroEntryProgress, setHeroEntryProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [sectionResetSignal, setSectionResetSignal] = useState(0);

  const handleHeroComplete = useCallback(() => {
    setOverlayDirection("forward");
    setStage("site");
  }, []);

  const handleSiteReverse = useCallback(() => {
    setOverlayDirection("backward");
    setHeroEntryProgress(1);
    setActiveSection(0);
    setStage("hero");
  }, []);

  const handleSectionChange = useCallback((nextIndex: number) => {
    setActiveSection(nextIndex);
  }, []);

  const handleSectionNavigate = useCallback((nextIndex: number) => {
    setActiveSection(nextIndex);
    setSectionResetSignal((value) => value + 1);
  }, []);

  return (
    <div className="bg-[#0b0613]">
      {stage === "site" && (
        <>
          <SiteCarousel
            activeIndex={activeSection}
            onActiveChange={handleSectionChange}
            resetSignal={sectionResetSignal}
            onExitBackward={handleSiteReverse}
          >
            {[
              <ServicesSection key="services" />,
              <StatsSection key="stats" />,
              <WorksSection key="works" />,
              <ProcessSection key="process" />,
              <TestimonialsSection key="testimonials" />,
              <PricingSection key="pricing" onNavigate={handleSectionNavigate} />,
            ]}
          </SiteCarousel>

          <Navbar activeIndex={activeSection} onNavigate={handleSectionNavigate} />
        </>
      )}

      <AnimatePresence initial={false} mode="sync">
        {stage === "hero" && (
          <motion.div
            key={`hero-overlay-${overlayDirection}`}
            className="fixed inset-0 z-50"
            initial={
              overlayDirection === "backward"
                ? { opacity: 0, y: -22, scale: 1.005 }
                : { opacity: 0, scale: 1.01 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              overlayDirection === "forward"
                ? { opacity: 0, scale: 1.015, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } }
                : { opacity: 0, y: 30, scale: 0.995, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
            }
          >
            <HeroSection
              initialProgress={heroEntryProgress}
              onComplete={handleHeroComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
