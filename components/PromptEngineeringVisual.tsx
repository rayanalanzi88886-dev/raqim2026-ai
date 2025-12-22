import React, { useEffect, useRef } from 'react';

/**
 * Prompt Engineering animated visual, ported from user-provided HTML.
 * Responsive, with reduced particle counts on mobile and respects reduced motion.
 */
const PromptEngineeringVisual: React.FC = () => {
  const logRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const agentWebRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const logs = [
      'تحليل بنية الأمر...',
      'وكيل NLP: فهم السياق مكتمل',
      'وكيل GPT: توليد النص...',
      'AI Engine: تحسين الجودة...',
      'ML Module: تعلم من التفضيلات',
      'النظام: جاهز للأمر التالي'
    ];

    // Activity log generator
    if (!prefersReducedMotion && logRef.current) {
      let logIndex = 0;
      const container = logRef.current;
      const interval = setInterval(() => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="tag">[AGENT]</span> ${logs[logIndex]}`;
        container.prepend(entry);
        logIndex = (logIndex + 1) % logs.length;
        if (container.children.length > 8) container.lastChild?.remove();
      }, 2500);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Code particles
    if (!prefersReducedMotion && codeRef.current) {
      const codeTexts = ['AI', 'ML', 'GPT', 'NLP', 'PROMPT', 'GEN', 'NEURAL', 'DEEP', 'LLM', 'API'];
      const count = window.innerWidth < 768 ? 10 : 20;
      for (let i = 0; i < count; i++) {
        const code = document.createElement('div');
        code.className = 'code-particle';
        code.textContent = codeTexts[Math.floor(Math.random() * codeTexts.length)];
        code.style.left = `${Math.random() * 100}%`;
        code.style.animationDelay = `${Math.random() * 15}s`;
        code.style.animationDuration = `${10 + Math.random() * 10}s`;
        codeRef.current.appendChild(code);
      }
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Connection lines between center and agents
    if (!prefersReducedMotion && agentWebRef.current) {
      const web = agentWebRef.current;
      const agents = Array.from(web.querySelectorAll('.sub-agent')) as HTMLElement[];
      const centerX = web.clientWidth / 2;
      const centerY = web.clientHeight / 2;
      agents.forEach((agent, index) => {
        const line = document.createElement('div');
        line.className = 'connection-line';
        const agentRect = agent.getBoundingClientRect();
        const parentRect = web.getBoundingClientRect();
        const agentX = agentRect.left - parentRect.left + agent.clientWidth / 2;
        const agentY = agentRect.top - parentRect.top + agent.clientHeight / 2;
        const length = Math.sqrt(Math.pow(centerX - agentX, 2) + Math.pow(centerY - agentY, 2));
        const angle = Math.atan2(agentY - centerY, agentX - centerX) * 180 / Math.PI;
        line.style.width = `${length}px`;
        line.style.left = `${centerX}px`;
        line.style.top = `${centerY}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.animationDelay = `${index * 0.5}s`;
        web.appendChild(line);
      });
    }
  }, []);

  return (
    <div className="lab-container">
      <div className="neural-grid"></div>
      <div className="scan-line"></div>
      <div className="corner top-left"></div>
      <div className="corner top-right"></div>
      <div className="corner bottom-left"></div>
      <div className="corner bottom-right"></div>

      <div className="agent-web" ref={agentWebRef}>
        <div className="orbit-ring ring-3"><div className="orbit-dot"></div></div>
        <div className="orbit-ring ring-2"><div className="orbit-dot"></div></div>
        <div className="orbit-ring ring-1"><div className="orbit-dot"></div></div>
        <div className="central-brain">⚡</div>
        <div className="sub-agent" style={{ top: '15%', left: '15%' }}>🧠<span>AI</span></div>
        <div className="sub-agent" style={{ top: '15%', right: '15%' }}>💡<span>GPT</span></div>
        <div className="sub-agent" style={{ bottom: '15%', left: '15%' }}>🔮<span>ML</span></div>
        <div className="sub-agent" style={{ bottom: '15%', right: '15%' }}>✨<span>NLP</span></div>
      </div>

      <div className="terminal-side">
        <div className="terminal-header">هندسة الأوامر<br /><span style={{ fontSize: 12, color: '#888' }}>Prompt Engineering</span></div>
        <div id="log-container" ref={logRef}>
          <div className="log-entry"><span className="tag">[SYSTEM]</span> تهيئة المنظومة...</div>
        </div>
      </div>

      <div id="codeParticles" ref={codeRef}></div>

      <style>{`
        :root {
          --primary-glow: #FF4D00;
          --secondary-glow: #ff8c42;
          --bg-deep: #000000;
        }

        .lab-container {
          width: 100%;
          max-width: 100%;
          height: clamp(300px, 40vw, 550px);
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
          border-radius: 25px;
          border: 2px solid rgba(255, 77, 0, 0.3);
          display: flex;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 50px rgba(255, 77, 0, 0.2);
        }

        .neural-grid {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(rgba(255, 77, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 77, 0, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
          opacity: 0.3;
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .agent-web {
          flex: 1.2;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .central-brain {
          width: clamp(90px, 12vw, 140px);
          height: clamp(90px, 12vw, 140px);
          background: radial-gradient(circle, var(--primary-glow), var(--secondary-glow));
          border-radius: 50%;
          box-shadow: 0 0 60px var(--primary-glow), inset 0 0 40px rgba(0, 0, 0, 0.5);
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: clamp(40px, 6vw, 60px);
          animation: brainPulse 3s infinite;
          position: relative;
        }
        @keyframes brainPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px var(--primary-glow); }
          50% { transform: scale(1.08); box-shadow: 0 0 80px var(--primary-glow); }
        }

        .orbit-ring { position: absolute; border: 2px solid rgba(255, 77, 0, 0.3); border-radius: 50%; animation: rotate 15s linear infinite; }
        .ring-1 { width: clamp(200px, 26vw, 220px); height: clamp(200px, 26vw, 220px); }
        .ring-2 { width: clamp(260px, 34vw, 300px); height: clamp(260px, 34vw, 300px); animation-duration: 20s; }
        .ring-3 { width: clamp(330px, 42vw, 380px); height: clamp(330px, 42vw, 380px); animation-duration: 25s; animation-direction: reverse; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .orbit-dot { position: absolute; width: 12px; height: 12px; background: var(--primary-glow); border-radius: 50%; box-shadow: 0 0 20px var(--primary-glow); top: 0; left: 50%; transform: translateX(-50%); }

        .sub-agent {
          position: absolute;
          width: clamp(54px, 7vw, 70px);
          height: clamp(54px, 7vw, 70px);
          background: rgba(10, 10, 10, 0.8);
          border: 2px solid var(--primary-glow);
          border-radius: 15px;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          font-size: clamp(22px, 3vw, 28px);
          transition: all 0.5s;
          cursor: pointer;
          animation: agentFloat 4s ease-in-out infinite;
        }
        .sub-agent:hover { transform: scale(1.15); border-color: var(--secondary-glow); box-shadow: 0 0 30px var(--primary-glow); }
        .sub-agent span { font-size: 9px; color: var(--primary-glow); margin-top: 2px; font-weight: bold; }
        @keyframes agentFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .connection-line { position: absolute; height: 2px; background: linear-gradient(90deg, transparent, var(--primary-glow), transparent); transform-origin: left center; opacity: 0.5; animation: dataFlow 3s ease-in-out infinite; }
        @keyframes dataFlow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }

        .terminal-side { flex: 0.8; background: rgba(0, 0, 0, 0.6); border-left: 1px solid rgba(255, 77, 0, 0.2); padding: 25px; display: flex; flex-direction: column; position: relative; overflow: hidden; }
        .terminal-header { color: var(--primary-glow); font-size: 18px; font-weight: bold; margin-bottom: 20px; text-align: center; text-shadow: 0 0 10px var(--primary-glow); }
        .log-entry { font-family: 'Courier New', monospace; font-size: 12px; margin-bottom: 12px; color: #00ff88; opacity: 0; animation: fadeIn 0.5s forwards; padding: 8px; background: rgba(255, 77, 0, 0.05); border-right: 3px solid var(--primary-glow); border-radius: 3px; }
        @keyframes fadeIn { to { opacity: 1; } }
        .tag { color: var(--primary-glow); font-weight: bold; }

        .code-particle { position: absolute; font-family: 'Courier New', monospace; font-size: 10px; color: rgba(255, 77, 0, 0.6); animation: floatCode 15s linear infinite; pointer-events: none; }
        @keyframes floatCode { 0% { transform: translateY(0) translateX(-50px); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateY(-600px) translateX(50px); opacity: 0; } }

        .scan-line { position: absolute; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, var(--primary-glow), transparent); box-shadow: 0 0 20px var(--primary-glow); animation: scan 4s linear infinite; }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }

        .corner { position: absolute; width: 40px; height: 40px; border: 2px solid rgba(255, 77, 0, 0.6); }
        .top-left { top: 15px; left: 15px; border-right: none; border-bottom: none; }
        .top-right { top: 15px; right: 15px; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 15px; left: 15px; border-right: none; border-top: none; }
        .bottom-right { bottom: 15px; right: 15px; border-left: none; border-top: none; }

        @media (prefers-reduced-motion: reduce) {
          .orbit-ring, .central-brain, .sub-agent, .connection-line, .code-particle, .scan-line, .neural-grid {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PromptEngineeringVisual;
