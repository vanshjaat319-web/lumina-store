/** Thin top bar above the header — scrolls away, never sticks. */
export default function AnnouncementBar() {
  return (
    <div className="bg-[#161618] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">
      <span className="text-white/50">Free US shipping over $50 ·</span> 30-day hassle-free returns · 2-year warranty
    </div>
  );
}