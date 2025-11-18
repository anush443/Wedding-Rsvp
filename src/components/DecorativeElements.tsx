/**
 * Decorative floating elements for elegant dark wedding theme
 */
export function DecorativeElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='gold' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23d4af37;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23f4d03f;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M50 20 Q60 30 70 20 Q60 40 50 30 Q40 40 30 20 Q40 30 50 20' fill='url(%23gold)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Floating floral elements - desktop */}
      <div
        className="hidden sm:block absolute top-20 left-10 text-xl opacity-[0.08] animate-float"
        style={{ animationDelay: "0s" }}
      >
        🌿
      </div>
      <div
        className="hidden sm:block absolute top-40 right-20 text-lg opacity-[0.08] animate-float"
        style={{ animationDelay: "1s" }}
      >
        🌸
      </div>
      <div
        className="hidden sm:block absolute bottom-40 left-20 text-xl opacity-[0.08] animate-float"
        style={{ animationDelay: "2s" }}
      >
        🌿
      </div>
      <div
        className="hidden sm:block absolute bottom-20 right-10 text-lg opacity-[0.08] animate-float"
        style={{ animationDelay: "1.5s" }}
      >
        🌸
      </div>

      {/* Floating sparkles - desktop */}
      <div
        className="hidden md:block absolute top-60 left-1/4 text-base opacity-[0.06] animate-sparkle"
        style={{ animationDelay: "0.5s" }}
      >
        ✨
      </div>
      <div
        className="hidden md:block absolute top-1/3 right-1/4 text-lg opacity-[0.06] animate-sparkle"
        style={{ animationDelay: "1.2s" }}
      >
        ⭐
      </div>
      <div
        className="hidden md:block absolute bottom-1/3 left-1/3 text-base opacity-[0.06] animate-sparkle"
        style={{ animationDelay: "0.8s" }}
      >
        ✨
      </div>
      <div
        className="hidden md:block absolute bottom-60 right-1/3 text-lg opacity-[0.06] animate-sparkle"
        style={{ animationDelay: "1.8s" }}
      >
        ⭐
      </div>

      {/* Mobile decorative elements - fewer and smaller */}
      <div
        className="sm:hidden absolute top-10 left-5 text-sm opacity-[0.06] animate-float"
        style={{ animationDelay: "0s" }}
      >
        🌿
      </div>
      <div
        className="sm:hidden absolute bottom-10 right-5 text-sm opacity-[0.06] animate-float"
        style={{ animationDelay: "1.5s" }}
      >
        🌸
      </div>
    </div>
  )
}
