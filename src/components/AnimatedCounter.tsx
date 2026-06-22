"use client";

/**
 * ANIMATED COUNTER COMPONENT
 * ─────────────────────────────────────────────────────────────────
 * Counts from 0 to a target number when the element enters the viewport.
 * 
 * Core concepts used:
 * - Intersection Observer API: detects when an element enters the screen
 * - useMotionValue: Framer Motion's reactive number (not tied to React state)
 * - animate(): Framer Motion's imperative animation function
 * - useTransform + useMotionValueEvent: to read & round the animated value
 */

import { useEffect, useRef, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

interface AnimatedCounterProps {
  target: number;        // The final number to count up to
  suffix?: string;       // Optional text after the number, e.g. "Lakh+" or "%"
  prefix?: string;       // Optional text before the number
  duration?: number;     // How long the animation takes (in seconds)
  className?: string;
}

export default function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2.5,
  className = "",
}: AnimatedCounterProps) {
  // Ref to the element — we'll watch when it enters the viewport
  const ref = useRef<HTMLSpanElement>(null);

  // motionValue holds the current animated number (starts at 0)
  const count = useMotionValue(0);

  // Regular React state to display the rounded number in the DOM
  const [displayValue, setDisplayValue] = useState(0);

  // Track whether we've already started counting (so we don't repeat)
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    /**
     * IntersectionObserver watches if the element is visible on screen.
     * - threshold: 0.3 means "fire when 30% of the element is visible"
     * - When it enters, we start the count-up animation.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true; // Mark as animated — won't repeat on scroll

          // animate() from Framer Motion: smoothly animates a motionValue
          // From 0 → target, over `duration` seconds, with easeOut easing
          const controls = animate(count, target, {
            duration,
            ease: "easeOut",
            onUpdate: (latest) => {
              // Round down to nearest integer so we don't show decimals
              setDisplayValue(Math.floor(latest));
            },
          });

          // Return cleanup function to stop the animation if component unmounts
          return () => controls.stop();
        }
      },
      { threshold: 0.3 }
    );

    // Start observing the element
    observer.observe(element);

    // Cleanup: unobserve when component unmounts
    return () => observer.unobserve(element);
  }, [count, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
