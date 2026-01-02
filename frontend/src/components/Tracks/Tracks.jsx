import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Tracks.css";

const Tracks = () => {
  const [activeTrack, setActiveTrack] = useState(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setActiveTrack(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <motion.div
        className="relative w-full overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* LEFT & RIGHT SPOTS */}
        <div className="absolute z-0 pointer-events-none" style={{ top: "10vh", left: "0vw", width: "50vw", height: "40vh", backgroundImage: "url(/Faqs/SpotPattern.svg)", backgroundRepeat: "no-repeat", backgroundSize: "75vw 75vh", backgroundPosition: "-10vw -25vh" }} />
        <div className="absolute z-0 pointer-events-none" style={{ top: "10vh", right: "0vw", width: "50vw", height: "40vh", backgroundImage: "url(/Faqs/SpotPattern.svg)", backgroundRepeat: "no-repeat", backgroundSize: "50vw 75vh", backgroundPosition: "0 -25vh" }} />

        <img src="/Faqs/ActionBubble.svg" alt="comic-slap" className="absolute inset-0
      mx-auto
      z-5
      w-[50vw] max-w-[600px]
      opacity-80
      pointer-events-none
      md:-top-30
      top-5" />

        <h1 className="relative z-5 mb-5 heading text-white w-full mt-20 mx-auto text-center" style={{ fontSize: "clamp(48px, 10vw, 100px)" }}>
          Tracks:
        </h1>
      </motion.div>

      {/* CAROUSEL */}
      <motion.div
        className="banner"
      >
        <img src="/aboutUsBorder.svg" alt="Decorative Border" className="pointer-events-none absolute bottom-0 right-0 z-2 w-[40%] h-[30%]" />
        <div className="slider" style={{ "--quantity": 7 }}>
          {[...Array(7)].map((_, index) => (
            <motion.div
              className="item"
              style={{ "--position": index + 1 }}
              key={index}
              onClick={() => setActiveTrack(index)}
              
            >
              <div className="click-text heading">Track {index + 1}<br />Coming Soon...</div>
              <img src="/Track/card.png" alt={`Track ${index + 1}`} />
              <div className="click-indicator"><span className="arrow heading">⌄</span></div>
            </motion.div>
          ))}
        </div>
        <div className="content"><div className="model"></div></div>
      </motion.div>

      {/* DIVIDER */}
      <motion.hr
        className="glow-hr border-0 h-2 w-full bg-linear-to-r from-transparent via-[#bba75d] to-transparent"
      />

      {/* MODAL */}
      {activeTrack !== null && (
        <motion.div
          className="track-modal"
          onClick={() => setActiveTrack(null)}
        >
          <motion.div className="track-flip" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <div className="track-face track-front"><img src="/Track/card.png" alt="Track Front" /></div>
            <div className="track-face track-back">
              <button className="track-close" onClick={() => setActiveTrack(null)} aria-label="Close">✕</button>
              <h2>Track {activeTrack + 1}</h2>
              <p>Details coming soon…</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Tracks;
