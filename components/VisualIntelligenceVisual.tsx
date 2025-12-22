import React, { useEffect, useRef } from 'react';

/**
 * Visual Intelligence animated component (category 3).
 * Ported from the user's HTML/CSS/JS into a responsive React component.
 */
const VisualIntelligenceVisual: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Build 20x12 = 240 pixel units
    grid.innerHTML = '';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (let i = 0; i < 240; i++) {
      const unit = document.createElement('div');
      unit.className = 'pixel-unit';
      if (!prefersReducedMotion && Math.random() > 0.9) {
        unit.style.animation = `blink ${Math.random() * 2 + 1}s infinite`;
        unit.style.background = 'rgba(255, 77, 0, 0.1)';
      }
      grid.appendChild(unit);
    }

    const onMove = (e: MouseEvent) => {
      const el = gridRef.current;
      const coords = coordsRef.current;
      if (!el || !coords) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(999, Math.floor(((e.clientX - rect.left) / rect.width) * 999)));
      const y = Math.max(0, Math.min(999, Math.floor(((e.clientY - rect.top) / rect.height) * 999)));
      coords.textContent = `X: ${String(x).padStart(3, '0')} | Y: ${String(y).padStart(3, '0')}`;
    };

    grid.addEventListener('mousemove', onMove);
    return () => {
      grid.removeEventListener('mousemove', onMove);
      grid.innerHTML = '';
    };
  }, []);

  return (
    <div className="ai-analyzer">
      <div className="info-panel">
        <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
          <span className="status-dot"></span>
          Vision_Core v2.0
        </div>
        <p>المهمة: تفكيك المحتوى البصري</p>
        <div className="layer-box">
          <div id="coords" ref={coordsRef}>X: 000 | Y: 000</div>
          <div>الطراز: Neural_Pattern_R1</div>
          <div>الدقة: 99.82%</div>
        </div>
        <div style={{ marginTop: 30, opacity: 0.6 }}>
          [Processing Layer_01...]<br />
          [Filtering Noise...]<br />
          [Detecting Entities...]
        </div>
      </div>

      <div className="pixel-scanner" ref={gridRef}>
        <div className="scan-bar"></div>
      </div>

      <style>{`
        .ai-analyzer {
          --orange-glow: #FF4D00;
          --dark-space: #050505;
          position: relative;
          width: 100%;
          height: clamp(280px, 35vw, 420px);
          background: rgba(10, 10, 10, 0.9);
          border: 1px solid rgba(255, 77, 0, 0.3);
          border-radius: 15px;
          overflow: hidden;
          display: flex;
          font-family: 'Courier New', monospace;
        }

        .dark .ai-analyzer {
          background: rgba(5, 5, 5, 0.9);
          border-color: rgba(255, 77, 0, 0.25);
        }

        /* Pixel scanner grid */
        .pixel-scanner {
          flex: 1;
          position: relative;
          border-left: 1px solid rgba(255, 77, 0, 0.2);
          display: grid;
          grid-template-columns: repeat(20, 1fr);
          grid-template-rows: repeat(12, 1fr);
        }

        .pixel-unit {
          border: 0.5px solid rgba(255, 77, 0, 0.05);
          transition: 0.3s;
        }

        .pixel-unit:hover {
          background: var(--orange-glow);
          box-shadow: 0 0 15px var(--orange-glow);
        }

        /* Vertical scan bar */
        .scan-bar {
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 100%;
          background: var(--orange-glow);
          box-shadow: 0 0 20px var(--orange-glow);
          animation: scanLine 6s linear infinite;
          z-index: 10;
        }

        @keyframes scanLine {
          0% { left: 0; }
          100% { left: 100%; }
        }

        /* Side info panel */
        .info-panel {
          width: 250px;
          padding: 20px;
          background: rgba(255, 77, 0, 0.02);
          font-size: 12px;
          color: var(--orange-glow);
        }

        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: var(--orange-glow);
          border-radius: 50%;
          margin-left: 10px;
          animation: blink 1s infinite;
        }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .layer-box {
          border: 1px solid rgba(255, 77, 0, 0.2);
          padding: 10px;
          margin-top: 20px;
          background: rgba(0,0,0,0.5);
        }

        /* Accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .scan-bar, .status-dot, .pixel-unit { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default VisualIntelligenceVisual;
