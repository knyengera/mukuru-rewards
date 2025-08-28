import confetti from 'canvas-confetti';

export function popConfetti() {
  const duration = 1500;
  const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}


