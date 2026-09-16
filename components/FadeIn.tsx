"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps <main> content and replays a fade-up entrance on every route change.
 * The key change forces a fresh DOM subtree, which restarts the CSS
 * animation from the `from{}` keyframe (opacity 0 → 1, slight rise).
 * Disabled under prefers-reduced-motion.
 */
export default function FadeIn({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}