"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ParticleCanvas from "./ParticleCanvas";
import ContactBar from "./ContactBar";

export type DisplayMode = "name" | "email" | "github" | "linkedin";

const CONTACT_URLS: Record<string, string> = {
  github: "https://github.com/TomComrie",
  linkedin: "https://uk.linkedin.com/in/tomcomrie",
};

const EMAIL = "tom@comr.ie";

export default function HomePage() {
  const [mode, setMode] = useState<DisplayMode>("name");
  const [accessible, setAccessible] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("a11y");
      if (stored !== null) return stored === "1";
      // Auto-enable for reduced motion preference
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("a11y", accessible ? "1" : "0");
  }, [accessible]);

  // Listen for reduced-motion changes (only if user hasn't manually toggled)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("a11y") === null) {
        setAccessible(e.matches);
      }
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  const [tickerMessage, setTickerMessage] = useState<string | null>(null);
  const tickerTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const [a11yCopied, setA11yCopied] = useState(false);
  const a11yCopiedTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("visited")) return;
    localStorage.setItem("visited", "1");
    // Small delay so the page loads first
    const t = setTimeout(() => setShowHint(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Keyboard navigation: 1=email, 2=github, 3=linkedin, Escape=name
  // Pressing the same key again returns to name
  useEffect(() => {
    const keyMap: Record<string, DisplayMode> = {
      "1": "email",
      "2": "github",
      "3": "linkedin",
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Escape") {
        setMode("name");
      } else if (keyMap[e.key]) {
        setMode((prev) => prev === keyMap[e.key] ? "name" : keyMap[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleCanvasClick = useCallback(() => {
    if (mode === "name") return;
    if (tickerTimer.current) clearTimeout(tickerTimer.current);

    if (mode === "email") {
      navigator.clipboard.writeText(EMAIL).then(() => {
        setTickerMessage("Copied to Clipboard");
        tickerTimer.current = setTimeout(() => setTickerMessage(null), 2500);
      });
    } else {
      const url = CONTACT_URLS[mode];
      if (url) {
        setTickerMessage("Redirecting");
        tickerTimer.current = setTimeout(() => {
          setTickerMessage(null);
          window.open(url, "_blank", "noopener,noreferrer");
        }, 1000);
      }
    }
  }, [mode]);

  return (
    <>
      {/* Accessibility toggle */}
      <label className="a11y-toggle">
        <input
          type="checkbox"
          checked={accessible}
          onChange={(e) => {
            setAccessible(e.target.checked);
            setShowHint(false);
          }}
        />
        <span>Accessibility Mode</span>
      </label>

      {showHint && (
        <button
          className="a11y-hint"
          onClick={() => setShowHint(false)}
          aria-label="Dismiss hint"
        >
          Toggle this for a simplified, accessible view
        </button>
      )}

      {accessible ? (
        /* ── Static accessible view ── */
        <main className="a11y-view">
          <p className="a11y-pronunciation">tˈɒm kˈɒmɹi</p>
          <h1 className="a11y-name">Tom Comr.ie</h1>
          <p className="a11y-bio">
            York Formula Student Team Principal 2023–2026<br />
            Software Engineer &amp; Motorsport Race Data Engineer<br />
            Undergraduate BEng Computer Science @ University of York (2026)
          </p>
          <nav className="a11y-links" aria-label="Contact links">
            <span className="a11y-email-wrap">
              <button
                className="a11y-email-btn"
                onClick={() => {
                  navigator.clipboard.writeText(EMAIL).then(() => {
                    setA11yCopied(true);
                    if (a11yCopiedTimer.current) clearTimeout(a11yCopiedTimer.current);
                    a11yCopiedTimer.current = setTimeout(() => setA11yCopied(false), 2000);
                  });
                }}
              >
                {EMAIL}
              </button>
              <span className={`a11y-copied-popup${a11yCopied ? " visible" : ""}`}>
                Copied to Clipboard
              </span>
            </span>
            <a
              href="https://github.com/TomComrie"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://uk.linkedin.com/in/tomcomrie"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </nav>
        </main>
      ) : (
        /* ── Animated view ── */
        <>
          <div className="bg-gradient" />
          <ParticleCanvas mode={mode} tickerMessage={tickerMessage} onClick={handleCanvasClick} />
          <ContactBar activeMode={mode} onModeChange={setMode} />
        </>
      )}
    </>
  );
}
