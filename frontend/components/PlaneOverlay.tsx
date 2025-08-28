'use client';
import { useEffect, useRef, useState } from 'react';

export default function PlaneOverlay() {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    function step(ts: number) {
      if (start == null) start = ts;
      const dt = ts - start;
      const cycle = 4000; // ms
      const n = (dt % cycle) / cycle; // 0..1
      setT(n);
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const x = -10 + t * 120; // percent
  const y = 60 - t * 70; // percent
  const rotate = -15 + t * 20;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{}}
    >
      <div
        className="select-none text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] transition-transform"
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          transform: `rotate(${rotate}deg)`,
        }}
      >
        ✈️
      </div>
    </div>
  );
}


