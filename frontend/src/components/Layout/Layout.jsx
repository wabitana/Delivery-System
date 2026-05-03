import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./Navbar.jsx";
import { FloatingChat } from "../Chatbot/FloatingChat.jsx";
import { ParticleCanvas } from "../Background/ParticleCanvas.jsx";

export function Layout() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen mesh-bg">
      <ParticleCanvas />
      <Navbar />
      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-28 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <FloatingChat />
    </div>
  );
}
