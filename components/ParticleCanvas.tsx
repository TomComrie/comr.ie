"use client";

import { useEffect, useRef, useCallback } from "react";
import type { DisplayMode } from "./HomePage";

/* ── Ambient particle ── */
interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  baseAlpha: number;
}

const COLORS = [
  "#a78bfa", "#818cf8", "#6366f1", "#c084fc", "#e879f9", "#f0abfc",
];

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@./:";

const DISPLAY_TEXT: Record<DisplayMode, string> = {
  name: "Tom Comr.ie",
  email: "tom@comr.ie",
  github: "/TomComrie",
  linkedin: "/tomcomrie",
};

interface SweepingLogoConfig {
  src: string;
  size: number;
  speed: number;
  angle: number;
  y: number;
  opacity: number;
}

const hashCode = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) % 1000000;
  }
  return hash;
};

const pseudoRand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const buildLogoConfigs = (srcs: string[]): SweepingLogoConfig[] => {
  const count = srcs.length;
  const yStart = 0.12;
  const yEnd = 0.92;
  return srcs.map((src, i) => {
    const seed = hashCode(src);
    const r1 = pseudoRand(seed + 1);
    const r2 = pseudoRand(seed + 7);
    const r3 = pseudoRand(seed + 19);
    const r4 = pseudoRand(seed + 31);
    const t = count <= 1 ? 0.5 : i / (count - 1);
    const dir = i % 2 === 0 ? 1 : -1;
    return {
      src,
      size: 0.9 + r1 * 0.35,
      speed: dir * (0.12 + r2 * 0.12),
      angle: (r3 * 16 - 8) * (dir === 1 ? -1 : 1),
      y: yStart + (yEnd - yStart) * t,
      opacity: 0.08 + r4 * 0.05,
    };
  });
};

const buildLogoStates = (configs: SweepingLogoConfig[]): SweepingLogoState[] => (
  configs.map((config) => {
    const seed = hashCode(config.src);
    return {
      phase: pseudoRand(seed + 41) * 200,
      drift: pseudoRand(seed + 73) * 1000,
    };
  })
);

const buildLogoAssets = (configs: SweepingLogoConfig[]): SweepingLogoAsset[] => (
  configs.map((config) => {
    const img = new Image();
    const asset: SweepingLogoAsset = { img, w: 0, h: 0, loaded: false };
    img.onload = () => {
      asset.w = img.naturalWidth || img.width || 1;
      asset.h = img.naturalHeight || img.height || 1;
      asset.loaded = true;
    };
    img.src = config.src;
    return asset;
  })
);

const GITHUB_PATH =
  "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z";
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

/* ── Component ── */
interface Props {
  mode: DisplayMode;
  tickerMessage: string | null;
  onClick: () => void;
}

interface SweepingLogoAsset {
  img: HTMLImageElement;
  w: number;
  h: number;
  loaded: boolean;
}

interface SweepingLogoState {
  phase: number;
  drift: number;
}

export default function ParticleCanvas({ mode, tickerMessage, onClick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motesRef = useRef<Mote[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef(0);
  const dimRef = useRef({ width: 0, height: 0 });
  const modeRef = useRef<DisplayMode>(mode);
  const timeRef = useRef(0);
  const tickerRef = useRef<string | null>(null);
  const tickerStartRef = useRef(0);
  const sweepingLogoConfigRef = useRef<SweepingLogoConfig[]>([]);
  const sweepingLogosRef = useRef<SweepingLogoAsset[]>([]);
  const sweepingLogoStateRef = useRef<SweepingLogoState[]>([]);

  // Scramble state
  const scrambleRef = useRef<{
    display: string[];
    target: string[];
    startTime: number;
  } | null>(null);
  const resolvedTextRef = useRef(DISPLAY_TEXT.name);

  /* ── helpers ── */
  const computeFontSize = useCallback(
    (dm: DisplayMode, w: number) => {
      const mobile = w < 768;
      const base = mobile
        ? Math.min(w * 0.13, 58)
        : Math.min(w * 0.075, 120);
      switch (dm) {
        case "name":
          return base;
        case "email":
          return base * 0.88;
        case "github":
        case "linkedin":
          return base * 0.72;
      }
    },
    []
  );

  const initMotes = useCallback(() => {
    const { width, height } = dimRef.current;
    const mobile = width < 768;
    const count = mobile ? 40 : 70;
    motesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      baseAlpha: Math.random() * 0.25 + 0.08,
    }));
  }, []);

  const startScramble = useCallback((targetText: string) => {
    const target = targetText.split("");
    const display = target.map((ch) =>
      ch === " "
        ? " "
        : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    );
    scrambleRef.current = {
      display,
      target,
      startTime: performance.now(),
    };
  }, []);

  /* ── mode changes ── */
  useEffect(() => {
    modeRef.current = mode;
    startScramble(DISPLAY_TEXT[mode]);
  }, [mode, startScramble]);

  /* ── sweeping logo assets ── */
  useEffect(() => {
    let active = true;
    const loadLogos = async () => {
      try {
        const res = await fetch("/api/logos");
        if (!res.ok) return;
        const data = (await res.json()) as { logos?: string[] };
        const srcs = Array.isArray(data.logos) ? data.logos : [];
        if (!active) return;
        const configs = buildLogoConfigs(srcs);
        sweepingLogoConfigRef.current = configs;
        sweepingLogoStateRef.current = buildLogoStates(configs);
        sweepingLogosRef.current = buildLogoAssets(configs);
      } catch {
        // no-op
      }
    };
    loadLogos();
    return () => {
      active = false;
    };
  }, []);

  /* ── ticker message state ── */
  useEffect(() => {
    if (tickerMessage && !tickerRef.current) {
      tickerRef.current = tickerMessage;
      tickerStartRef.current = performance.now();
    } else if (tickerMessage && tickerRef.current !== tickerMessage) {
      tickerRef.current = tickerMessage;
      tickerStartRef.current = performance.now();
    } else if (!tickerMessage) {
      tickerRef.current = null;
    }
  }, [tickerMessage]);

  /* ── canvas setup + animation loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimRef.current = { width: w, height: h };
      initMotes();
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const offMouse = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0)
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          active: true,
        };
    };
    const offTouch = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", offMouse);
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("touchend", offTouch);

    /* ── frame loop ── */
    const animate = () => {
      const { width, height } = dimRef.current;
      const mobile = width < 768;
      ctx.clearRect(0, 0, width, height);
      const now = performance.now();
      timeRef.current += 1;
      const t = timeRef.current;
      const mouse = mouseRef.current;
      const motes = motesRef.current;
      const mLen = motes.length;
      const currentMode = modeRef.current;

      /* — ambient motes — */
      for (let i = 0; i < mLen; i++) {
        const m = motes[i];
        m.x += m.vx + Math.sin(t * 0.004 + m.y * 0.008) * 0.06;
        m.y += m.vy + Math.cos(t * 0.003 + m.x * 0.008) * 0.06;
        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;
        if (m.y < 0) m.y = height;
        if (m.y > height) m.y = 0;

        if (mouse.active) {
          const dx = m.x - mouse.x;
          const dy = m.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120 && d > 0) {
            m.vx += (dx / d) * 0.04;
            m.vy += (dy / d) * 0.04;
          }
        }
        m.vx *= 0.99;
        m.vy *= 0.99;

        const twinkle = Math.sin(t * 0.025 + i * 1.7) * 0.08;
        ctx.globalAlpha = m.baseAlpha + twinkle;
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();
      }

      /* — constellation lines between nearby motes — */
      const lineR = mobile ? 90 : 120;
      const lineRSq = lineR * lineR;
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      for (let i = 0; i < mLen; i++) {
        for (let j = i + 1; j < mLen; j++) {
          const dx = motes[i].x - motes[j].x;
          const dy = motes[i].y - motes[j].y;
          if (dx * dx + dy * dy < lineRSq) {
            ctx.moveTo(motes[i].x, motes[i].y);
            ctx.lineTo(motes[j].x, motes[j].y);
          }
        }
      }
      ctx.globalAlpha = 0.06;
      ctx.stroke();

      /* — sweeping experience marks — */
      const logos = sweepingLogosRef.current;
      const logoStates = sweepingLogoStateRef.current;
      const logoConfigs = sweepingLogoConfigRef.current;
      const baseSize = mobile ? width * 0.12 : width * 0.14;
      const sweepT = now * 0.06;
      const modeFade = currentMode === "name" ? 1 : 0.5;
      const logoCount = logoConfigs.length;
      for (let i = 0; i < logoConfigs.length; i++) {
        const mark = logoConfigs[i];
        const asset = logos[i];
        const state = logoStates[i];
        if (!asset || !asset.loaded) continue;
        const targetDim = Math.max(36, baseSize * mark.size);
        const scale = targetDim / Math.max(asset.w, asset.h);
        const imgW = asset.w * scale;
        const imgH = asset.h * scale;
        const sweepSpan = width + imgW + 240;
        const startOffset = mark.speed > 0 ? imgW + 120 : 120;
        const phase = state ? state.phase : 0;
        const spacing = (i / Math.max(1, logoCount)) * sweepSpan;
        const move = ((sweepT * Math.abs(mark.speed) + startOffset + spacing + phase) % sweepSpan + sweepSpan) % sweepSpan;
        const x = mark.speed > 0
          ? -imgW - 120 + move
          : width + 120 - move;
        const drift = state ? state.drift : 0;
        const yWave = Math.sin(t * 0.01 + i + drift * 0.001) * (imgH * 0.08);
        const y = height * mark.y + yWave;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((mark.angle * Math.PI) / 180);
        ctx.globalAlpha = mark.opacity * modeFade;
        ctx.globalCompositeOperation = "screen";
        ctx.drawImage(asset.img, 0, -imgH / 2, imgW, imgH);
        ctx.restore();
      }

      /* — scramble update — */
      const scr = scrambleRef.current;
      let displayStr: string;

      if (scr) {
        const elapsed = performance.now() - scr.startTime;
        const dur = 700;
        let allDone = true;

        for (let i = 0; i < scr.target.length; i++) {
          const lockAt = (i / scr.target.length) * dur * 0.75 + dur * 0.25;
          if (elapsed >= lockAt) {
            scr.display[i] = scr.target[i];
          } else {
            allDone = false;
            if (scr.target[i] !== " ") {
              scr.display[i] =
                SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ];
            }
          }
        }

        displayStr = scr.display.join("");
        if (allDone) {
          resolvedTextRef.current = displayStr;
          scrambleRef.current = null;
        }
      } else {
        displayStr = resolvedTextRef.current;
      }

      /* — draw text — */
      const fontSize = computeFontSize(currentMode, width);
      const fontStr = `800 ${fontSize}px "Geist", system-ui, -apple-system, sans-serif`;
      ctx.font = fontStr;
      ctx.textBaseline = "middle";

      const hasIcon =
        currentMode === "github" || currentMode === "linkedin";

      // Measure each character and compute positions
      ctx.textAlign = "left";
      const chars = displayStr.split("");
      const charWidths = chars.map((ch) => ctx.measureText(ch).width);
      const textW = charWidths.reduce((a, b) => a + b, 0);
      const iconSize = hasIcon ? fontSize * 0.85 : 0;
      const iconGap = hasIcon ? fontSize * 0.25 : 0;
      const totalW = iconSize + iconGap + textW;
      const startX = (width - totalW) / 2;
      const centerY = height / 2;
      const textStartX = startX + iconSize + iconGap;

      // Mouse hover influence radius
      const hoverRadius = fontSize * 2.5;

      // Icon (with hover lift)
      ctx.save();
      ctx.shadowColor = "rgba(167, 139, 250, 0.35)";
      ctx.shadowBlur = 30;

      if (hasIcon) {
        const pathData =
          currentMode === "github" ? GITHUB_PATH : LINKEDIN_PATH;
        const p2d = new Path2D(pathData);
        const iconCx = startX + iconSize / 2;
        const iconCy = centerY;
        let iconLift = 0;
        let iconProx = 0;
        if (mouse.active) {
          const dx = mouse.x - iconCx;
          const dy = mouse.y - iconCy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < hoverRadius) {
            iconProx = 1 - d / hoverRadius;
            iconLift = iconProx * iconProx * fontSize * -0.18;
          }
        }
        // Match text colour: white → accent purple based on proximity
        const ir = Math.round(255 - iconProx * 88);
        const ig = Math.round(255 - iconProx * 116);
        const ib = Math.round(255 - iconProx * 5);
        ctx.fillStyle = `rgb(${ir},${ig},${ib})`;
        const iconScale = 1 + iconProx * 0.15;
        ctx.save();
        ctx.translate(startX + iconSize / 2, centerY + iconLift);
        ctx.scale(
          (iconSize / 24) * iconScale,
          (iconSize / 24) * iconScale
        );
        ctx.translate(-12, -12); // centre the 24x24 path
        ctx.fill(p2d);
        ctx.restore();
      }

      // Per-character rendering with hover effects
      let cursorX = textStartX;
      for (let i = 0; i < chars.length; i++) {
        const cw = charWidths[i];
        const charCx = cursorX + cw / 2;
        const charCy = centerY;

        // Distance from mouse to character centre
        let lift = 0;
        let spread = 0;
        let prox = 0;
        if (mouse.active) {
          const dx = mouse.x - charCx;
          const dy = mouse.y - charCy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < hoverRadius) {
            prox = 1 - d / hoverRadius;
            const ease = prox * prox; // quadratic ease
            lift = ease * fontSize * -0.22; // rise up
            spread = (dx < 0 ? -1 : 1) * ease * fontSize * 0.06; // push apart
          }
        }

        // Colour: blend white → accent purple based on proximity
        const r = Math.round(255 - prox * 88);  // 255 → 167
        const g = Math.round(255 - prox * 116); // 255 → 139
        const b = Math.round(255 - prox * 5);   // 255 → 250
        ctx.fillStyle = `rgb(${r},${g},${b})`;

        // Scale up slightly near cursor
        const scale = 1 + prox * 0.15;

        ctx.save();
        ctx.translate(cursorX + cw / 2 + spread, centerY + lift);
        ctx.scale(scale, scale);
        ctx.globalAlpha = 1;

        // Glow intensifies near cursor
        ctx.shadowColor = `rgba(167, 139, 250, ${0.35 + prox * 0.45})`;
        ctx.shadowBlur = 30 + prox * 20;

        ctx.font = fontStr;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(chars[i], 0, 0);
        ctx.restore();

        cursorX += cw;
      }
      ctx.restore(); // drop outer save

      /* — bio subtitle (only in name mode) — */
      if (currentMode === "name") {
        const pronunciation = "t\u02c8\u0252m k\u02c8\u0252m\u0279i";
        const pronFontSize = Math.max(10, fontSize * 0.18);
        const pronFont = `500 ${pronFontSize}px "Geist Mono", "Geist", system-ui, sans-serif`;
        ctx.save();
        ctx.font = pronFont;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(167, 139, 250, 0.25)";
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "#a78bfa";
        ctx.fillText(pronunciation, width / 2, centerY - fontSize * 0.75);
        ctx.restore();

        const bioLines = [
          "York Formula Student Team Principal 2023\u20132026",
          "Software Engineer & Motorsport Race Data Engineer",
          "Undergraduate BEng Computer Science @ University of York (2026)",
        ];
        const bioFontSize = Math.max(11, fontSize * 0.17);
        const bioFont = `400 ${bioFontSize}px "Geist", system-ui, -apple-system, sans-serif`;
        ctx.save();
        ctx.font = bioFont;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(167, 139, 250, 0.2)";
        ctx.shadowBlur = 10;

        const lineGap = bioFontSize * 1.6;
        const bioTopY = centerY + fontSize * 0.7;

        for (let li = 0; li < bioLines.length; li++) {
          const lineY = bioTopY + li * lineGap;
          ctx.globalAlpha = 0.45;
          ctx.fillStyle = "#a78bfa";
          ctx.fillText(bioLines[li], width / 2, lineY);
        }
        ctx.restore();
      }

      /* — ticker tape orbiting text — */
      if (tickerRef.current) {
        const elapsed = performance.now() - tickerStartRef.current;
        const fadeDur = 400;
        const holdDur = 2500;
        let alpha: number;
        if (elapsed < fadeDur) {
          alpha = elapsed / fadeDur;
        } else if (elapsed < holdDur - fadeDur) {
          alpha = 1;
        } else if (elapsed < holdDur) {
          alpha = 1 - (elapsed - (holdDur - fadeDur)) / fadeDur;
        } else {
          alpha = 0;
          tickerRef.current = null;
        }

        if (alpha > 0) {
          const tickerSep = "   \u2022   ";
          const tickerUnit = tickerRef.current + tickerSep;
          const tickerFontSize = Math.max(11, fontSize * 0.16);
          const tickerFont = `600 ${tickerFontSize}px "Geist", system-ui, sans-serif`;

          ctx.save();
          ctx.font = tickerFont;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Rounded rectangle around the email text
          const padX = fontSize * 0.5;
          const padY = fontSize * 0.55;
          const rectW = totalW + padX * 2;
          const rectH = fontSize + padY * 2;
          const cornerR = Math.min(rectH / 2, fontSize * 0.5);
          const rectLeft = (width - totalW) / 2 - padX;
          const rectTop = centerY - fontSize / 2 - padY;

          // Rounded rect perimeter segments (clockwise from top-left after corner)
          const straightH = rectH - 2 * cornerR;
          const straightW = rectW - 2 * cornerR;
          const cornerArc = (Math.PI / 2) * cornerR;
          const perim = 2 * straightW + 2 * straightH + 4 * cornerArc;

          // Segment lengths: top, TR corner, right, BR corner, bottom, BL corner, left, TL corner
          const segs = [
            straightW,  cornerArc,
            straightH,  cornerArc,
            straightW,  cornerArc,
            straightH,  cornerArc,
          ];

          // Given distance d along perimeter, return {x, y, angle}
          const pointAt = (d: number) => {
            // Normalize to [0, perim)
            let dd = ((d % perim) + perim) % perim;
            const l = rectLeft;
            const t = rectTop;
            const r = l + rectW;
            const b = t + rectH;
            const cr = cornerR;

            // Segment 0: top edge (left to right)
            if (dd < segs[0]) {
              return { x: l + cr + dd, y: t, angle: 0 };
            }
            dd -= segs[0];

            // Segment 1: top-right corner
            if (dd < segs[1]) {
              const a = dd / cr; // 0 to π/2
              return {
                x: r - cr + Math.sin(a) * cr,
                y: t + cr - Math.cos(a) * cr,
                angle: a,
              };
            }
            dd -= segs[1];

            // Segment 2: right edge (top to bottom)
            if (dd < segs[2]) {
              return { x: r, y: t + cr + dd, angle: Math.PI / 2 };
            }
            dd -= segs[2];

            // Segment 3: bottom-right corner
            if (dd < segs[3]) {
              const a = dd / cr;
              return {
                x: r - cr + Math.cos(a) * cr,
                y: b - cr + Math.sin(a) * cr,
                angle: Math.PI / 2 + a,
              };
            }
            dd -= segs[3];

            // Segment 4: bottom edge (right to left)
            if (dd < segs[4]) {
              return { x: r - cr - dd, y: b, angle: Math.PI };
            }
            dd -= segs[4];

            // Segment 5: bottom-left corner
            if (dd < segs[5]) {
              const a = dd / cr;
              return {
                x: l + cr - Math.sin(a) * cr,
                y: b - cr + Math.cos(a) * cr,
                angle: Math.PI + a,
              };
            }
            dd -= segs[5];

            // Segment 6: left edge (bottom to top)
            if (dd < segs[6]) {
              return { x: l, y: b - cr - dd, angle: Math.PI * 1.5 };
            }
            dd -= segs[6];

            // Segment 7: top-left corner
            {
              const a = dd / cr;
              return {
                x: l + cr - Math.cos(a) * cr,
                y: t + cr - Math.sin(a) * cr,
                angle: Math.PI * 1.5 + a,
              };
            }
          };

          // Build enough ticker text to fill the perimeter
          const unitW = ctx.measureText(tickerUnit).width;
          const repeats = Math.ceil(perim / unitW) + 1;
          const fullTicker = tickerUnit.repeat(repeats);
          const chars2 = fullTicker.split("");
          const charWidths2 = chars2.map(ch => ctx.measureText(ch).width);

          // Animate: scroll offset along perimeter
          const speed = 80; // pixels per second
          const scrollOffset = (elapsed * speed) / 1000;

          let accumDist = 0;
          for (let i = 0; i < chars2.length; i++) {
            const charDist = accumDist + charWidths2[i] / 2;
            if (charDist > perim) break;

            const pt = pointAt(charDist + scrollOffset);

            ctx.save();
            ctx.translate(pt.x, pt.y);
            ctx.rotate(pt.angle);
            ctx.globalAlpha = alpha * 0.85;
            ctx.fillStyle = "#a78bfa";
            ctx.shadowColor = "rgba(167, 139, 250, 0.5)";
            ctx.shadowBlur = 8;
            ctx.fillText(chars2[i], 0, 0);
            ctx.restore();

            accumDist += charWidths2[i];
          }
          ctx.restore();
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", offMouse);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", offTouch);
    };
  }, [initMotes, computeFontSize]);

  return (
    <canvas
      ref={canvasRef}
      onClick={onClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        cursor: mode !== "name" ? "pointer" : "default",
      }}
    />
  );
}
