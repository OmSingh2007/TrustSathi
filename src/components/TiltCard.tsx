"use client";

/**
 * TILT CARD COMPONENT (3D Perspective Effect)
 * ─────────────────────────────────────────────────────────────────
 * This is a reusable wrapper that gives its children a realistic
 * 3D tilt effect based on mouse position. 
 *
 * How it works:
 * 1. We track mouse position relative to the card's bounding box.
 * 2. We calculate how far the cursor is from the center.
 * 3. We map that distance to a rotation value in degrees.
 * 4. Framer Motion's useSpring makes the rotation feel smooth and physical.
 */

import { useRef } from "react";
import {
  motion,
  useMotionValue,    // tracks a value that can be animated (like x, y coords)
  useSpring,         // adds spring physics to a motion value for smooth feel
  useTransform,      // maps one range of values to another range
} from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

// Spring config — controls how "snappy" or "floaty" the tilt feels
const SPRING_CONFIG = { stiffness: 150, damping: 20, mass: 0.5 };

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  // Ref to access the actual DOM element and get its size/position
  const cardRef = useRef<HTMLDivElement>(null);

  // Raw motion values for mouse X and Y position (0 to 1, where 0.5 = center)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Apply spring physics so the tilt eases smoothly to the target value
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  /**
   * useTransform maps the spring value (0 to 1) to a rotation angle in degrees.
   * 
   * For rotateY (horizontal tilt):
   *   - Mouse at left edge (0)   → rotateY = +15deg (card tilts left)
   *   - Mouse at center (0.5)    → rotateY = 0deg (flat)
   *   - Mouse at right edge (1)  → rotateY = -15deg (card tilts right)
   * 
   * The [0, 1] → [-15, 15] is the mapping range.
   */
  const rotateY = useTransform(springX, [0, 1], [15, -15]);
  // For rotateX (vertical tilt):
  //   - Mouse at top (0)    → rotateX = -15deg (card tilts down toward viewer)
  //   - Mouse at bottom (1) → rotateX = +15deg (card tilts up toward viewer)
  const rotateX = useTransform(springY, [0, 1], [-15, 15]);

  // Subtle "glare" — as mouse moves right, right side gets slightly brighter
  const glareOpacity = useTransform(springX, [0, 0.5, 1], [0.15, 0, 0.15]);

  // When mouse moves over the card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Calculate normalized position (0 to 1) within the card
    // (e.clientX - rect.left) gives pixels from left edge of card
    // Dividing by rect.width normalizes to 0–1
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  // When mouse leaves, reset the card to flat (0.5 = center = no tilt)
  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    /**
     * perspective: The CSS perspective property creates the 3D depth illusion.
     * A smaller value (e.g. 500px) = more dramatic 3D effect.
     * A larger value (e.g. 1200px) = subtle, premium 3D effect.
     */
    <div style={{ perspective: "1200px" }} className={className}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,  // apply the spring-animated X rotation
          rotateY,  // apply the spring-animated Y rotation
          transformStyle: "preserve-3d", // child elements also participate in 3D space
        }}
        className="relative w-full h-full rounded-2xl will-change-transform"
      >
        {children}

        {/* Glare overlay — a semi-transparent gradient that shifts with mouse position */}
        <motion.div
          style={{ opacity: glareOpacity }}
          className="
            pointer-events-none absolute inset-0 rounded-2xl
            bg-gradient-to-tr from-white/20 via-white/5 to-transparent
          "
        />
      </motion.div>
    </div>
  );
}
