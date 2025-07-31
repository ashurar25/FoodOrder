
import { useEffect } from "react";

export default function AnimatedBackground() {
  useEffect(() => {
    // Create animated background element if it doesn't exist
    if (!document.querySelector('.animated-bg')) {
      const animatedBg = document.createElement('div');
      animatedBg.className = 'animated-bg';
      animatedBg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          radial-gradient(circle at 20% 50%, rgba(82, 229, 164, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(38, 208, 206, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%);
        animation: float 20s ease-in-out infinite;
        z-index: -1;
        pointer-events: none;
      `;
      document.body.appendChild(animatedBg);
    }
  }, []);

  return null;
}
