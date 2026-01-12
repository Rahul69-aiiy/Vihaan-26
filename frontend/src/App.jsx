import { useState, useRef, useEffect } from "react";
import Sponsor from "./components/Sponsors/Sponsor.jsx";
import SubscribeGate from "./utils/SubscribeGate.jsx";
import Landing from "./components/Landing/Landing.jsx";
import Intro from "./components/Loader.jsx";
import Tracks from "./components/Tracks/Tracks.jsx";
import Landing2 from "./components/Landing2.jsx";
import Faqs from "./components/Faqs/faqs.jsx";
import Gallery from "./components/Gallery/Gallery.jsx";
import Footer from "./components/Footer/Footer.jsx";

import { Volume2, VolumeX } from "lucide-react";
import "./App.css";

const setNotifCookie = (name, value, days=365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

const getNotifCookie = (name) => {
  return document.cookie.split("; ").find((row) => row.startsWith(name + "="))?.split("=")[1];
};

function App() {

  
  const [showGate, setShowGate] = useState(() => {
    const permission = Notification.permission;
    const interacted = getNotifCookie("push_interacted") === "true";
    
    //show gate if permission is default (meaning it is not "granted" or "denied") and user has not interacted yet
    return permission === "default" && !interacted;
  });
  
  const [showIntro, setShowIntro] = useState(false);
  
  const [muted, setMuted] = useState(
    () => localStorage.getItem("bg-muted") === "true"
  );
  
  const introAudioRef = useRef(new Audio("/audio/intro.mp3"));
  const bgAudioRef = useRef(new Audio("/audio/bg-audio.mp3"));
  
  useEffect(() => {
    //if subscribe gate is skipped (because permission/cookie exists), start intro automatically
    //NOTE: NO USER INTERACTION SO BROWSER BLOCKS AUTOPLAY WITH SOUND ON RELOAD/NEXT VISITS
    if (!showGate && !showIntro) {
      introAudioRef.current.currentTime = 0;
      introAudioRef.current.volume = 0.5;
      introAudioRef.current.play().catch(err => {});

      setShowIntro(true);
    }
  }, []);

  /* Cleanup intro audio */
  useEffect(() => {
    return () => {
      introAudioRef.current.pause();
      introAudioRef.current.currentTime = 0;
    };
  }, []);

  /* 🔊 Background audio lifecycle */
  useEffect(() => {
    if (!showGate && !showIntro) {
      const bgAudio = bgAudioRef.current;

      bgAudio.loop = true;
      bgAudio.volume = muted ? 0 : 0.25;
      bgAudio.currentTime = 0;

      bgAudio.play().catch(() => {});
    }

    return () => {
      bgAudioRef.current.pause();
      bgAudioRef.current.currentTime = 0;
    };
  }, [showGate, showIntro, muted]);

  /* Persist mute state */
  useEffect(() => {
    localStorage.setItem("bg-muted", muted);
    bgAudioRef.current.volume = muted ? 0 : 0.25;
  }, [muted]);

  return (
    <>
   
      {!showGate && !showIntro && (
        <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute background audio" : "Mute background audio"}
        className="
          fixed 
          top-6 left-[calc(35%-9px)]
          z-[9999]
          flex items-center justify-center
          w-9 h-9 rounded-full
          bg-black/50 backdrop-blur-md
          text-white hover:bg-black/70
          transition
        "
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      )}

      {/* SUBSCRIBE GATE */}
      {showGate && (
        <SubscribeGate
          onContinue={() => {
            setNotifCookie("push_interacted", "true");

            introAudioRef.current.currentTime = 0;
            introAudioRef.current.volume = 0.5;
            introAudioRef.current.play().catch(() => {});

            setShowGate(false);
            setShowIntro(true);
          }}
        />
      )}

      {/* INTRO / LOADER */}
      {showIntro && (
        <div id="loader">
          <Intro
            audioRef={introAudioRef}
            onComplete={() => {
              introAudioRef.current.pause();
              introAudioRef.current.currentTime = 0;
              introAudioRef.current.volume = 0;

              setShowIntro(false);
            }}
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      {!showGate && !showIntro && (
        <>
          <div id="landing">
            <Landing />
          </div>

          <div id="about">
            <Landing2 />
          </div>

          <div id="tracks">
            <Tracks />
          </div>

          <div id="gallery">
            <Gallery />
          </div>

          <div id="sponsors">
            <Sponsor></Sponsor>
          </div>

          <div id="faqs">
            <Faqs />
          </div>

          <div id="footer">
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default App;
