import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  duration: number
  size: number
  color: string
  rotation: number
  horizontalDrift: number
}

const colors = [
  "hsl(43 74% 66%)", // Gold
  "hsl(45 60% 75%)", // Light gold
  "hsl(0 84% 60%)", // Red
  "hsl(120 60% 50%)", // Green
  "hsl(240 60% 60%)", // Blue
  "hsl(300 60% 60%)", // Purple
  "hsl(30 80% 60%)", // Orange
  "hsl(280 60% 70%)", // Pink
]

const goldColors = [
  "hsl(43 74% 66%)", // Rich gold
  "hsl(45 70% 70%)", // Bright gold
  "hsl(43 65% 60%)", // Deep gold
  "hsl(45 75% 75%)", // Light gold
  "hsl(43 80% 68%)", // Warm gold
  "hsl(45 68% 72%)", // Soft gold
  "hsl(43 72% 64%)", // Medium gold
  "hsl(45 78% 78%)", // Pale gold
]

interface ConfettiAnimationProps {
  variant?: "multicolor" | "gold"
  particleCount?: number
}

export function ConfettiAnimation({ 
  variant = "multicolor",
  particleCount = 120 
}: ConfettiAnimationProps = {}) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Generate confetti pieces
    const colorPalette = variant === "gold" ? goldColors : colors
    const pieces: ConfettiPiece[] = []
    for (let i = 0; i < particleCount; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 3 + Math.random() * 3,
        size: 6 + Math.random() * 14,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        rotation: Math.random() * 360,
        horizontalDrift: (Math.random() - 0.5) * 30, // Drift left or right
      })
    }
    setConfetti(pieces)

    // Remove confetti after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 6000)

    return () => clearTimeout(timer)
  }, [variant, particleCount])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            "--drift": `${piece.horizontalDrift}px`,
            "--rotation": `${piece.rotation}deg`,
          } as React.CSSProperties & {
            "--drift": string
            "--rotation": string
          }}
        />
      ))}
      <style>{`
        .confetti-piece {
          position: absolute;
          top: -30px;
          border-radius: 50%;
          animation: confetti-fall linear forwards;
          opacity: 0.9;
          box-shadow: 0 0 6px currentColor;
          transform: rotate(var(--rotation, 0deg));
        }

        ${variant === "gold" ? `
        .confetti-piece {
          box-shadow: 0 0 8px currentColor, 0 0 12px currentColor;
          filter: brightness(1.1);
        }
        ` : ''}

        @keyframes confetti-fall {
          0% {
            transform: translateY(-30px) translateX(0) rotate(var(--rotation, 0deg)) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(calc(50vh)) translateX(calc(var(--drift, 0px) * 0.5)) rotate(calc(var(--rotation, 0deg) + 360deg)) scale(1);
            opacity: 0.95;
          }
          100% {
            transform: translateY(calc(100vh + 30px)) translateX(var(--drift, 0px)) rotate(calc(var(--rotation, 0deg) + 720deg)) scale(0.7);
            opacity: 0;
          }
        }

        /* Add variety - make some square, some triangular */
        .confetti-piece:nth-child(3n) {
          border-radius: 3px;
        }

        .confetti-piece:nth-child(5n) {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          border-radius: 0;
        }

        .confetti-piece:nth-child(7n) {
          border-radius: 20% 80% 20% 80% / 80% 20% 80% 20%;
        }
      `}</style>
    </div>
  )
}
