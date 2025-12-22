import React, { useEffect, useRef } from 'react';

/**
 * Animated Social & Content visual for category 2.
 * Ported from user's HTML/CSS into a React component.
 */
const SocialContentVisual: React.FC = () => {
  const bubblesRef = useRef<HTMLDivElement>(null);
  const streamsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const texts = ['جاري إنشاء ثريد...', 'أنسنة النص برمجياً', 'تحليل تريند X', 'توليد وصف TikTok', 'تحسين الـ SEO'];
    const container = bubblesRef.current;
    if (!container) return;

    // Respect reduced motion user preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const maxBubbles = 6;
    const intervalMs = window.innerWidth < 768 ? 2000 : 1500;
    const interval = setInterval(() => {
      // Cap existing bubbles to avoid DOM bloat
      if (container.childElementCount > maxBubbles) {
        container.removeChild(container.firstElementChild as Node);
      }
      const b = document.createElement('div');
      b.className = 'msg-bubble';
      b.textContent = texts[Math.floor(Math.random() * texts.length)];
      b.style.left = `${Math.random() * 80 + 10}%`;
      b.style.bottom = '20%';
      container.appendChild(b);
      setTimeout(() => b.remove(), 5000);
    }, intervalMs);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = streamsRef.current;
    if (!target) return;
    target.innerHTML = '';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const count = window.innerWidth < 768 ? 8 : 12;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'data-stream';
      s.style.left = `${Math.random() * 100}%`;
      s.style.animationDelay = `${Math.random() * 2}s`;
      s.style.opacity = String(Math.random() * 0.3);
      target.appendChild(s);
    }
    return () => {
      target.innerHTML = '';
    };
  }, []);

  return (
    <div className="social-canvas">
      <div className="content-hub"><div className="hub-core"></div></div>

      <div className="orbit orbit-1">
        <div className="social-node" style={{ top: 0, left: '50%', transform: 'translateX(-50%)', borderColor: 'var(--x-color)' }}>𝕏</div>
        <div className="social-node" style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)', borderColor: 'var(--yt-color)' }}>▶</div>
      </div>

      <div className="orbit orbit-2">
        <div className="social-node" style={{ top: '50%', right: 0, transform: 'translateY(-50%)', borderColor: 'var(--tiktok-color)' }}>♪</div>
        <div className="social-node" style={{ top: '50%', left: 0, transform: 'translateY(-50%)', borderColor: 'var(--ig-color)' }}>📸</div>
      </div>

      <div ref={bubblesRef} id="bubbles"></div>
      <div ref={streamsRef} id="streams"></div>

      <style>{`
        :root {
          --social-primary: #7b61ff;
          --x-color: #ffffff;
          --tiktok-color: #00f2ea;
          --yt-color: #ff0000;
          --ig-color: #ff006e;
        }

        /* Component-scoped color variables default (light mode) */
        .social-canvas {
          --bg-start: #f4f5fb;
          --bg-end: #e9eaf7;
          --panel-border: rgba(0, 0, 0, 0.08);
          --node-bg: #ffffff;
          --node-text: #111111;
        }
        /* Override in dark mode */
        .dark .social-canvas {
          --bg-start: #1a1033;
          --bg-end: #050505;
          --panel-border: rgba(123, 97, 255, 0.2);
          --node-bg: #111111;
          --node-text: #ffffff;
        }

        /* Make the canvas fill the container */
        .social-canvas {
          position: relative;
          width: 100%;
          max-width: 100%;
          height: clamp(260px, 35vw, 420px);
          background: radial-gradient(circle at center, var(--bg-start) 0%, var(--bg-end) 100%);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--panel-border);
        }

        .content-hub {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          background: rgba(123, 97, 255, 0.1);
          border: 2px solid var(--social-primary);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: morph 8s ease-in-out infinite;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }

        @keyframes morph {
          0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          50% { border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%; }
        }

        .hub-core { width: 40px; height: 40px; background: var(--social-primary); border-radius: 50%; box-shadow: 0 0 30px var(--social-primary); }

        .orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px dashed rgba(123, 97, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .orbit-1 { width: clamp(180px, 22vw, 250px); height: clamp(180px, 22vw, 250px); animation: rotate 15s linear infinite; }
        .orbit-2 { width: clamp(280px, 33vw, 380px); height: clamp(280px, 33vw, 380px); animation: rotate 25s linear infinite reverse; }

        @keyframes rotate { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

        .social-node {
          position: absolute;
          width: clamp(34px, 4vw, 45px);
          height: clamp(34px, 4vw, 45px);
          background: var(--node-bg);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          color: var(--node-text);
          box-shadow: 0 0 15px rgba(0,0,0,0.5);
        }

        .msg-bubble {
          position: absolute;
          padding: 8px 15px;
          background: rgba(123, 97, 255, 0.1);
          border-right: 3px solid var(--social-primary);
          color: #d1d1d1;
          font-size: 11px;
          border-radius: 4px;
          white-space: nowrap;
          animation: float-up 5s linear infinite;
          opacity: 0;
        }

        @keyframes float-up {
          0% { transform: translateY(50px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-150px); opacity: 0; }
        }

        .data-stream {
          position: absolute;
          width: 1px;
          height: 100px;
          background: linear-gradient(to bottom, transparent, var(--social-primary), transparent);
          animation: stream 2s linear infinite;
        }

        @keyframes stream { 0% { top: -100px; } 100% { top: 500px; } }
        /* Accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .orbit-1, .orbit-2, .msg-bubble, .data-stream, .content-hub {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SocialContentVisual;
