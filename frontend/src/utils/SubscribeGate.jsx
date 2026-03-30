import { useState } from "react";
import { motion } from "framer-motion";

export default function SubscribeGate({ onContinue }) {
  const PUBLIC_VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(false);

  // Helper: convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleSubscribeAndContinue = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in this browser.");
      onContinue();
      return;
    }
    setLoading(true);

    try {
      // 1. Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        // If they denied, we still want to let them in!
        alert("Notifications disabled. You can enable them later.");
        onContinue(); 
        return;
      }

      // 2. Wait for service worker (with a timeout safety)
      // If the SW isn't ready in 3 seconds, just move on
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => setTimeout(() => reject(new Error("SW Timeout")), 3000))
      ]);

      // 3. Subscribe
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      // 4. Save to backend
      await fetch(`${BACKEND_URL}/subs/subscribe`, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      });

      alert("Successfully subscribed to notifications!");
    } catch (error) {
      console.error("Subscription flow error:", error);
      alert("Subscription failed. You can try again later.");
    } finally {
      setLoading(false);
      onContinue(); 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-99999 bg-black/80 backdrop-blur-md flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-black border border-[#ffffff] rounded-xl p-8 w-[90%] max-w-md text-center shadow-[0_0_30px_rgba(156,168,2,0.4)]"
      >
        <h2 className="heading text-3xl mb-4 text-white">
          VIHAAN 9.0 Updates
        </h2>

        <p className="text-gray-300 mb-6">
          Subscribe to get notified about schedules, prizes & announcements.
        </p>

        <div className="flex flex-col gap-3">
          {/* NOTIFY ME */}
          <button
            className="bg-white text-black py-2 rounded-md font-bold hover:scale-105 transition disabled:opacity-60"
            onClick={handleSubscribeAndContinue}
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Notify Me"}
          </button>

          {/* SKIP */}
          <button
            className="text-gray-400 text-sm hover:text-white transition"
            onClick={() => {
              alert("You can subscribe anytime to get updates!");
              onContinue();
            }}
            disabled={loading}
          >
            Continue without subscribing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
