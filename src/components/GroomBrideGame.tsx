import { useMemo, useState } from "react"

const participants = [
  {
    id: "bride",
    name: "The Bride",
    emoji: "👰🏻‍♀️",
    color: "from-rose-100/10 via-rose-500/10 to-rose-900/10",
    description:
      "Graceful, stylish, and always two steps ahead on the dance floor.",
    funFacts: [
      "Loves handwritten notes and late-night dessert runs.",
      "Secret karaoke champion with a soft spot for 90s ballads.",
      "Can spot gorgeous florals from a mile away.",
    ],
  },
  {
    id: "groom",
    name: "The Groom",
    emoji: "🤵🏻‍♂️",
    color: "from-slate-100/10 via-slate-500/10 to-slate-900/10",
    description:
      "Charming, witty, and ready with the best stories for every toast.",
    funFacts: [
      "Has a legendary sneaker collection for every occasion.",
      "Makes the fluffiest pancakes on lazy Sunday mornings.",
      "Knows every guest's coffee order by heart.",
    ],
  },
]

const celebratoryMessages = [
  "You unlocked a flurry of confetti hearts! 💕",
  "The stars are cheering for your pick! ✨",
  "Love points doubled! 💞",
  "Cheers & sparkles coming your way! 🥂",
]

const getRandomMessageIndex = () => {
  return Math.floor(Math.random() * celebratoryMessages.length)
}

export function GroomBrideGame() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [funFactIndex, setFunFactIndex] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)

  const selectedParticipant = useMemo(
    () => participants.find((p) => p.id === selectedId) ?? null,
    [selectedId]
  )

  const celebratoryMessage = useMemo(() => {
    if (!selectedId) return ""
    return celebratoryMessages[messageIndex]
  }, [selectedId, messageIndex])

  const handleChoose = (id: string) => {
    setSelectedId(id)
    setFunFactIndex((prev) => (prev + 1) % 3)
    setMessageIndex(getRandomMessageIndex())
  }

  return (
    <section className="max-w-5xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 animate-fade-in-up">
        <span className="wedding-sparkle text-3xl opacity-60">✨</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold gradient-text mt-2">
          Pick Your Celebration Partner
        </h2>
        <p className="text-muted-foreground mt-3 text-base sm:text-lg max-w-2xl mx-auto">
          Tap a card to cheer for the Bride or Groom and unlock a charming fun
          fact. There are no wrong answers—just sparkles, smiles, and love
          points!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {participants.map((participant) => (
          <button
            key={participant.id}
            onClick={() => handleChoose(participant.id)}
            className="group relative overflow-hidden elegant-card rounded-3xl p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl sm:text-5xl drop-shadow">
                {participant.emoji}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs uppercase tracking-widest">
                {selectedId === participant.id ? "Your Pick" : "Tap to cheer"}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-serif font-semibold text-foreground">
              {participant.name}
            </h3>
            <p className="mt-2 text-muted-foreground leading-relaxed text-sm sm:text-base">
              {participant.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
              <span>Reveal fun fact</span>
              <span className="wedding-sparkle">✨</span>
            </div>
            <div
              className={`mt-4 rounded-2xl border border-primary/20 bg-black/20 p-4 text-sm leading-relaxed transition-all duration-500 ${
                selectedId === participant.id
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              {participant.funFacts[funFactIndex]}
            </div>
            <span
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {selectedParticipant && (
        <div className="mt-10 elegant-card rounded-3xl p-6 text-center animate-fade-in-up">
          <p className="text-lg sm:text-xl text-muted-foreground mb-3">
            You cheered for{" "}
            <span className="font-semibold text-primary">
              {selectedParticipant.name}
            </span>
            !
          </p>
          <p className="text-foreground text-xl font-serif">
            {celebratoryMessage}
          </p>
          <div className="flex justify-center gap-3 mt-5 text-3xl">
            <span className="wedding-heart opacity-80">💖</span>
            <span className="wedding-sparkle opacity-70">✨</span>
            <span className="wedding-heart opacity-80">💖</span>
          </div>
        </div>
      )}
    </section>
  )
}
