import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

type CharacterChoice = "bride" | "groom"
type Phase = "select" | "running" | "gameover"

type ObstacleType = {
  id: string
  label: string
  imageUrl: string
  width: number
  height: number
  baseY: number
}

type ObstacleInstance = ObstacleType & {
  x: number
  uid: number // unique id for React key
  passed?: boolean // Track if obstacle has been successfully dodged
}

const RUNNER_HEIGHT = 82
const RUNNER_WIDTH = 60
const GRAVITY = 2400
const JUMP_VELOCITY = 1050
const BASE_SPEED = 340 // Balanced: slightly faster than original (320) but not too fast (360)
const SPEED_CAP = 550 // Balanced: higher than original (520) but not too extreme (580)
const RUNNER_START_X = 80
const RUNNER_TARGET_X = 220
const TRACK_WIDTH = 860

// Runner base position is at bottom-16 (64px from container bottom)
const RUNNER_BASE_Y = 64

// Dummy image URL - replace with actual images later
const DUMMY_IMAGE_URL = "https://i.ibb.co/sdDkqHNy/pexels-catscoming-978555.jpg"

// Bride-specific obstacles
const brideObstacles: ObstacleType[] = [
  {
    id: "flowers",
    label: "Flower Basket",
    imageUrl: DUMMY_IMAGE_URL,
    width: 72,
    height: 78,
    baseY: RUNNER_BASE_Y,
  },
  {
    id: "thali",
    label: "Pooja Thali",
    imageUrl: DUMMY_IMAGE_URL,
    width: 68,
    height: 68,
    baseY: RUNNER_BASE_Y,
  },
  {
    id: "confetti",
    label: "Petal Shower",
    imageUrl: DUMMY_IMAGE_URL,
    width: 60,
    height: 60,
    baseY: RUNNER_BASE_Y + 120, // Air obstacle
  },
  {
    id: "bangles",
    label: "Bangles",
    imageUrl: DUMMY_IMAGE_URL,
    width: 64,
    height: 64,
    baseY: RUNNER_BASE_Y,
  },
]

// Groom-specific obstacles
const groomObstacles: ObstacleType[] = [
  {
    id: "dhol",
    label: "Mini Dhol",
    imageUrl: DUMMY_IMAGE_URL,
    width: 74,
    height: 74,
    baseY: RUNNER_BASE_Y,
  },
  {
    id: "baraat",
    label: "Baraat Prop",
    imageUrl: DUMMY_IMAGE_URL,
    width: 76,
    height: 80,
    baseY: RUNNER_BASE_Y,
  },
  {
    id: "turban",
    label: "Turban",
    imageUrl: DUMMY_IMAGE_URL,
    width: 70,
    height: 70,
    baseY: RUNNER_BASE_Y,
  },
  {
    id: "shoes",
    label: "Shoes",
    imageUrl: DUMMY_IMAGE_URL,
    width: 66,
    height: 66,
    baseY: RUNNER_BASE_Y,
  },
]

const characterThemes = {
  bride: {
    name: "Bride",
    imageUrl: DUMMY_IMAGE_URL,
    primary: "from-rose-300/90 to-rose-500/90",
    accent: "text-rose-200",
    cursor: createCursor(DUMMY_IMAGE_URL),
  },
  groom: {
    name: "Groom",
    imageUrl: DUMMY_IMAGE_URL,
    primary: "from-amber-200/90 to-amber-500/90",
    accent: "text-amber-200",
    cursor: createCursor(DUMMY_IMAGE_URL),
  },
} satisfies Record<
  CharacterChoice,
  {
    name: string
    imageUrl: string
    primary: string
    accent: string
    cursor: string
  }
>

// Mandap image URL
const MANDAP_IMAGE_URL = DUMMY_IMAGE_URL

function createCursor(imageUrl: string) {
  // Create a cursor from an image URL
  return `url("${imageUrl}") 16 16, auto`
}

export default function MandapGame() {
  const [phase, setPhase] = useState<Phase>("select")
  const [character, setCharacter] = useState<CharacterChoice | null>(null)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem("mandap-cursor-best")
    return saved ? parseInt(saved, 10) : 0
  })

  const [runnerX, setRunnerX] = useState(RUNNER_START_X)
  const [runnerY, setRunnerY] = useState(0)
  const [obstacles, setObstacles] = useState<ObstacleInstance[]>([])
  const [distance, setDistance] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)

  const runnerXRef = useRef(RUNNER_START_X)
  const runnerYRef = useRef(0)
  const velocityRef = useRef(0)
  const speedRef = useRef(BASE_SPEED)
  const lastTimeRef = useRef<number | null>(null)
  const spawnTimerRef = useRef(0)
  const animationRef = useRef<number | null>(null)
  const stepRef = useRef<((timestamp: number) => void) | null>(null)
  const uidCounterRef = useRef(1)
  const bestScoreRef = useRef(bestScore)

  useEffect(() => {
    bestScoreRef.current = bestScore
  }, [bestScore])

  const theme = useMemo(
    () => (character ? characterThemes[character] : null),
    [character]
  )
  const backgroundPosition = useMemo(
    () => `${-(distance % TRACK_WIDTH)}px`,
    [distance]
  )

  const resetGame = useCallback(() => {
    runnerXRef.current = RUNNER_START_X
    setRunnerX(RUNNER_START_X)
    runnerYRef.current = 0
    setRunnerY(0)
    velocityRef.current = 0
    speedRef.current = BASE_SPEED
    lastTimeRef.current = null
    spawnTimerRef.current = 0
    setObstacles([])
    setDistance(0)
    setScore(0)
    setShowInstructions(true)
    setPhase("running")
  }, [])

  const handleCharacterSelect = (choice: CharacterChoice) => {
    setCharacter(choice)
    resetGame()
  }

  const handleSwitchCharacter = () => {
    setCharacter(null)
    setPhase("select")
    setScore(0)
    setDistance(0)
    setObstacles([])
    runnerXRef.current = RUNNER_START_X
    runnerYRef.current = 0
    velocityRef.current = 0
    speedRef.current = BASE_SPEED
    lastTimeRef.current = null
    spawnTimerRef.current = 0
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }

  const handleJump = useCallback(() => {
    if (phase !== "running") return
    // allow new jump only when near ground
    if (runnerYRef.current > 10) return
    velocityRef.current = JUMP_VELOCITY
  }, [phase])

  const spawnObstacle = useCallback((): ObstacleInstance => {
    // Use character-specific obstacles
    const obstacleCatalog =
      character === "bride" ? brideObstacles : groomObstacles
    const blueprint =
      obstacleCatalog[Math.floor(Math.random() * obstacleCatalog.length)]
    // Optimal spacing: balanced between too easy and too hard
    // Minimum 350px, maximum 600px between obstacles
    const spacing = 350 + Math.random() * 250
    const uid = uidCounterRef.current++
    return {
      ...blueprint,
      x: TRACK_WIDTH + spacing,
      uid,
    }
  }, [character])

  // Main animation step
  const step = useCallback(
    (timestamp: number) => {
      if (phase !== "running") {
        // ensure animation is cancelled
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        return
      }

      if (lastTimeRef.current == null) {
        lastTimeRef.current = timestamp
        animationRef.current = requestAnimationFrame((ts) =>
          stepRef.current?.(ts)
        )
        return
      }

      const delta = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      // runner physics
      // integrate velocity then apply gravity
      runnerYRef.current = Math.max(
        0,
        runnerYRef.current + velocityRef.current * delta
      )
      velocityRef.current =
        runnerYRef.current === 0 ? 0 : velocityRef.current - GRAVITY * delta
      setRunnerY(runnerYRef.current)

      // move runner forward to target X smoothly
      if (runnerXRef.current < RUNNER_TARGET_X) {
        runnerXRef.current = Math.min(
          RUNNER_TARGET_X,
          runnerXRef.current + delta * 240
        )
        setRunnerX(runnerXRef.current)
      }

      // update distance and speed
      const distanceDelta = speedRef.current * delta
      setDistance((prev) => prev + distanceDelta)
      // Balanced speed progression: moderate increase (was 35 easy, 50 hard, now 42)
      speedRef.current = Math.min(speedRef.current + delta * 42, SPEED_CAP)

      // spawn obstacles on timer
      // Optimal interval: balanced frequency
      // Interval starts at 1.8s and decreases to 1.0s at max speed
      spawnTimerRef.current += delta
      const interval = Math.max(1.0, 1.8 - speedRef.current / 650)
      if (spawnTimerRef.current > interval) {
        setObstacles((prev) => [...prev, spawnObstacle()])
        spawnTimerRef.current = 0
      }

      // Runner hitbox coordinates (in container coordinates)
      // Runner bottom coordinate measured from container bottom: RUNNER_BASE_Y - runnerY
      // We'll compute top/bottom in same coordinate space as obstacle baseY values.
      const runnerActualBottom = RUNNER_BASE_Y - runnerYRef.current
      const runnerActualTop = runnerActualBottom + RUNNER_HEIGHT
      const runnerLeft = runnerXRef.current
      const runnerRight = runnerLeft + RUNNER_WIDTH

      // Important: do collision detection and scoring inside a single setObstacles functional update
      setObstacles((prev) => {
        let localHit = false
        let localPoints = 0

        const updated = prev
          .map((obs) => {
            const newX = obs.x - speedRef.current * delta

            // obstacle bounds
            const obsLeft = newX
            const obsRight = newX + obs.width
            const obsBottom = obs.baseY
            const obsTop = obs.baseY + obs.height

            // Optimal hitbox: balanced forgiveness
            const paddingX = 15 // horizontal forgiveness (balanced between 18 easy and 12 hard)
            const paddingY = 12 // vertical forgiveness (balanced between 15 easy and 10 hard)

            const overlapX =
              runnerRight - paddingX > obsLeft &&
              runnerLeft + paddingX < obsRight
            const overlapY =
              runnerActualTop - paddingY > obsBottom &&
              runnerActualBottom + paddingY < obsTop

            // detect collision if not already hit
            if (!localHit && overlapX && overlapY) {
              localHit = true
            }

            // handle passed/dodged obstacles
            if (!obs.passed && obsRight < runnerLeft - 10) {
              localPoints += 10 // award points for successful dodge
              return { ...obs, x: newX, passed: true }
            }

            return { ...obs, x: newX }
          })
          .filter((obs) => obs.x > -150) // remove far-left obstacles

        // Apply points immediately (inside same closure)
        if (localPoints > 0) {
          setScore((prev) => {
            const updatedScore = prev + localPoints
            if (updatedScore > bestScoreRef.current) {
              setBestScore(updatedScore)
              bestScoreRef.current = updatedScore
              localStorage.setItem("mandap-cursor-best", String(updatedScore))
            }
            return updatedScore
          })
        }

        // Trigger game over if hit detected
        if (localHit) {
          // stop the loop and set phase
          setPhase("gameover")
          setShowInstructions(false)
          // Note: we still return updated obstacles (game over UI will show)
        }

        return updated
      })

      // If phase got set to gameover inside setObstacles, we should cancel the animation.
      if (phase === "running") {
        // If setPhase("gameover") was called above, React will schedule an update and phase will become 'gameover' next render.
        // We'll check phaseRef by reading current phase state (but in this closure phase is the current render's value).
        // To ensure we cancel if gameover was set, check animationRef after microtick via requestAnimationFrame scheduling.
        animationRef.current = requestAnimationFrame((ts) =>
          stepRef.current?.(ts)
        )
      } else {
        // ensure stopped
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
      }
    },
    [phase, spawnObstacle]
  )

  useEffect(() => {
    stepRef.current = step
  }, [step])

  useEffect(() => {
    if (phase === "running") {
      // start animation
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame((ts) =>
          stepRef.current?.(ts)
        )
      }
      const instructionTimer = setTimeout(
        () => setShowInstructions(false),
        2500
      )
      return () => {
        clearTimeout(instructionTimer)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
      }
    } else {
      // if leaving running phase, cancel frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [phase])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault()
        handleJump()
      }
    }
    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [handleJump])

  const gameBackground = useMemo(
    () =>
      `linear-gradient(135deg, hsl(240 8% 6%), hsl(240 10% 8%)),
       url("data:image/svg+xml,${encodeURIComponent(
         `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><g fill='none' opacity='0.08' stroke='%23d4af37' stroke-width='1.5'><path d='M0 20h40L30 0'/><path d='M200 180h-40l10 20'/><circle cx='60' cy='60' r='18'/><circle cx='160' cy='140' r='18'/></g></svg>`
       )}")`,
    []
  )

  const handleReplay = () => {
    if (!character) return
    // reset refs and state
    runnerXRef.current = RUNNER_START_X
    setRunnerX(RUNNER_START_X)
    runnerYRef.current = 0
    setRunnerY(0)
    velocityRef.current = 0
    speedRef.current = BASE_SPEED
    lastTimeRef.current = null
    spawnTimerRef.current = 0
    setObstacles([])
    setDistance(0)
    setScore(0)
    setShowInstructions(true)
    setPhase("running")
  }

  return (
    <section
      className="mt-16 px-4 sm:px-6 lg:px-8"
      style={{
        cursor: character ? characterThemes[character].cursor : "default",
      }}
    >
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 text-2xl">
          <span className="wedding-heart text-3xl">💫</span>
          <p className="text-sm uppercase tracking-[0.4em] text-primary-foreground/70">
            Mandap Cursor Game
          </p>
          <span className="wedding-sparkle text-2xl">✨</span>
        </div>
        <h2 className="gradient-text text-4xl sm:text-5xl font-serif font-bold mt-2">
          Help Them Reach the Mandap
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto mt-4 text-base sm:text-lg">
          Choose Bride or Groom, glide your cursor across a pastel pathway, and
          tap or press space to jump over adorable baraat obstacles. Stay
          graceful—one tumble and the celebration pauses!
        </p>
      </div>

      {phase === "select" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {(Object.keys(characterThemes) as CharacterChoice[]).map((choice) => (
            <button
              key={choice}
              onClick={() => handleCharacterSelect(choice)}
              className="group elegant-card rounded-3xl p-6 text-left transition hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-primary/30"
            >
              <div className="flex items-center justify-between mb-4">
                <img
                  src={characterThemes[choice].imageUrl}
                  alt={characterThemes[choice].name}
                  className="w-16 h-16 drop-shadow object-contain"
                />
                <span className="text-xs uppercase tracking-[0.3em] text-primary/80 font-semibold">
                  Select
                </span>
              </div>
              <h3 className="text-3xl font-serif font-bold mb-3 gradient-text">
                {characterThemes[choice].name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {choice === "bride"
                  ? "Graceful leaps, floral sparkles, and petal-powered jumps."
                  : "Dashing strides, baraat rhythm, and suave dodges."}
              </p>
              <div className="mt-5 text-xs uppercase tracking-[0.4em] text-primary/60">
                Click to run →
              </div>
            </button>
          ))}
        </div>
      )}

      {character && (
        <div className="mt-10">
          {/* Character Switch and Restart Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwitchCharacter}
              className="text-primary"
            >
              Switch Character
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReplay}
              className="text-primary"
            >
              Restart Game
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6 text-center text-foreground">
            <div className="elegant-card rounded-2xl px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.4em] text-primary/70">
                Score
              </p>
              <p className="text-4xl font-bold mt-1 tabular-nums">{score}</p>
            </div>
            <div className="elegant-card rounded-2xl px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.4em] text-primary/70">
                Best
              </p>
              <p className="text-4xl font-bold mt-1 tabular-nums">
                {bestScore}
              </p>
            </div>
            <div className="elegant-card rounded-2xl px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.4em] text-primary/70">
                Journey (m)
              </p>
              <p className="text-4xl font-bold mt-1 tabular-nums">
                {Math.floor(distance / 8)}
              </p>
            </div>
          </div>

          <div
            className="relative mx-auto max-w-5xl h-[360px] sm:h-[420px] rounded-[30px] border-2 border-primary/40 shadow-[0_25px_80px_rgba(0,0,0,0.45)] overflow-hidden"
            style={{ background: gameBackground }}
            onMouseDown={handleJump}
            onTouchStart={handleJump}
          >
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml," +
                  encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="2" fill="%23d4a373" opacity="0.25"/><path d="M25 0v10M25 40v10M0 25h10M40 25h10" stroke="%23d4a373" stroke-width="1" opacity="0.12"/></svg>'
                  ) +
                  "')",
                backgroundRepeat: "repeat",
              }}
            />

            <div
              className="absolute bottom-0 left-0 w-[200%] h-40 bg-linear-to-b from-transparent via-black/45 to-black/80 pointer-events-none"
              style={{ backgroundPositionX: backgroundPosition }}
            />
            <div
              className="absolute bottom-16 left-0 h-[2px] w-full bg-linear-to-r from-transparent via-primary/60 to-transparent opacity-80 pointer-events-none"
              style={{ backgroundPositionX: backgroundPosition }}
            />

            <div
              className="absolute bottom-16 transition-transform duration-75 ease-linear"
              style={{ left: runnerX, transform: `translateY(-${runnerY}px)` }}
            >
              <div
                className={`w-16 h-24 rounded-2xl border-2 border-primary/60 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm bg-linear-to-b ${theme?.primary}`}
              >
                <img
                  src={theme?.imageUrl}
                  alt={theme?.name}
                  className="w-12 h-12 drop-shadow object-contain"
                />
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary/90 font-semibold mt-1">
                  {theme?.name}
                </span>
              </div>
              {runnerY < 8 && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-primary/25 blur-md rounded-full" />
              )}
            </div>

            {obstacles.map((obstacle) => (
              <div
                key={obstacle.uid}
                className="absolute flex flex-col items-center text-center"
                style={{ left: obstacle.x, bottom: obstacle.baseY }}
              >
                <img
                  src={obstacle.imageUrl}
                  alt={obstacle.label}
                  className="drop-shadow-lg"
                  style={{
                    width: `${obstacle.width}px`,
                    height: `${obstacle.height}px`,
                    objectFit: "contain",
                  }}
                />
                <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-primary/70 bg-black/40 px-2 py-1 rounded-full">
                  {obstacle.label}
                </span>
              </div>
            ))}

            <div className="absolute bottom-10 right-10 text-center opacity-80">
              <img
                src={MANDAP_IMAGE_URL}
                alt="Mandap"
                className="w-20 h-20 drop-shadow-2xl object-contain"
              />
              <div className="mt-2 px-4 py-1 text-xs uppercase tracking-[0.35em] text-primary-foreground bg-black/50 rounded-full border border-primary/30">
                Mandap
              </div>
            </div>

            {showInstructions && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 elegant-card rounded-2xl px-6 py-3 text-sm text-center text-primary w-max animate-fade-in">
                click or press space to jump ✨
              </div>
            )}

            {phase === "gameover" && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-center px-6">
                <p className="text-3xl font-serif gradient-text">Whoops!</p>
                <p className="text-muted-foreground">
                  An obstacle stopped your grand entry. Tap "Run Again" to keep
                  the baraat moving!
                </p>
                <Button
                  variant="outline"
                  onClick={handleReplay}
                  className="mt-2"
                >
                  Run Again
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-secondary border border-primary/30 rounded text-xs font-mono">
                SPACE
              </kbd>
              <span>or click track to jump</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
