'use client';

import React, { useEffect, useRef } from 'react';

interface Orb {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  hue: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize orbs
    const initOrbs = () => {
      orbsRef.current = [];
      for (let i = 0; i < 5; i++) {
        orbsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 200 + 100,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          hue: Math.random() * 60 + 300, // Pink to purple range
        });
      }
    };
    initOrbs();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply subtle mouse influence
      const mouseInfluence = 0.0001;

      orbsRef.current.forEach((orb, index) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - orb.x;
        const dy = mouseRef.current.y - orb.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply gentle attraction to mouse
        if (distance < 300) {
          orb.speedX += dx * mouseInfluence;
          orb.speedY += dy * mouseInfluence;
        }

        // Update position
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        // Apply damping
        orb.speedX *= 0.99;
        orb.speedY *= 0.99;

        // Bounce off walls
        if (orb.x < -orb.size) orb.x = canvas.width + orb.size;
        if (orb.x > canvas.width + orb.size) orb.x = -orb.size;
        if (orb.y < -orb.size) orb.y = canvas.height + orb.size;
        if (orb.y > canvas.height + orb.size) orb.y = -orb.size;

        // Draw orb with gradient
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.size
        );
        
        const alpha = 0.03;
        gradient.addColorStop(0, `hsla(${orb.hue}, 70%, 60%, ${alpha})`);
        gradient.addColorStop(0.5, `hsla(${orb.hue}, 70%, 50%, ${alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${orb.hue}, 70%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-50 dark:opacity-50"
      style={{ 
        zIndex: 0,
        opacity: document.documentElement.getAttribute('data-theme') === 'light' ? 0.3 : 0.5
      }}
    />
  );
}