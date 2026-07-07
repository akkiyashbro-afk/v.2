import React, { useCallback, useMemo, useState } from "react";
import "@/App.css";
import Nav from "@/components/Nav";
import PreHeroLoading from "@/components/PreHeroLoading";
import MouseSpotlight from "@/components/MouseSpotlight";
import Hero from "@/components/Hero";
import RecoveryGalaxy from "@/components/RecoveryGalaxy";
import ReviewWall from "@/components/ReviewWall";
import Playbook from "@/components/Playbook";
import TrustBand from "@/components/TrustBand";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import GlassPopup from "@/components/GlassPopup";
import RecoveryAppealModal from "@/components/RecoveryAppealModal";
import { recoveredProfiles } from "@/data/recoveredProfiles";

function App() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [appealOpen, setAppealOpen] = useState(false);

  const profile = useMemo(
    () => (activeIndex == null ? null : recoveredProfiles[activeIndex]),
    [activeIndex]
  );

  const openProfile = useCallback((p) => {
    const idx = recoveredProfiles.findIndex((x) => x.id === p.id);
    setActiveIndex(idx === -1 ? 0 : idx);
  }, []);

  const close = useCallback(() => setActiveIndex(null), []);

  const next = useCallback(() => {
    setActiveIndex((i) =>
      i == null ? 0 : (i + 1) % recoveredProfiles.length
    );
  }, []);
  const prev = useCallback(() => {
    setActiveIndex((i) =>
      i == null
        ? 0
        : (i - 1 + recoveredProfiles.length) % recoveredProfiles.length
    );
  }, []);

  const openAppeal = useCallback(() => setAppealOpen(true), []);
  const closeAppeal = useCallback(() => setAppealOpen(false), []);

  return (
    <div
      data-testid="app-root"
      className="relative min-h-screen bg-[#050505] text-white antialiased selection:bg-white/20 selection:text-white"
    >
      <PreHeroLoading onComplete={() => setLoaded(true)} />
      <MouseSpotlight />
      <Nav onOpenAppeal={openAppeal} />

      <main
        className={loaded ? "opacity-100" : "opacity-0"}
        style={{ transition: "opacity 700ms ease" }}
      >
        <Hero onOpenAppeal={openAppeal} />
        <RecoveryGalaxy onOpen={openProfile} />
        <Playbook />
        <ReviewWall onOpen={openProfile} />
        <TrustBand />
        <CTA onOpenAppeal={openAppeal} />
        <Footer />
      </main>

      <GlassPopup
        profile={profile}
        onClose={close}
        onNext={next}
        onPrev={prev}
        onStartRecovery={() => {
          close();
          openAppeal();
        }}
      />
      <RecoveryAppealModal open={appealOpen} onClose={closeAppeal} />
    </div>
  );
}

export default App;
