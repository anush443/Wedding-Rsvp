"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import MandapGame from "@/components/MandapRaceGame"
// import { GroomBrideGame } from "@/components/GroomBrideGame"

export function GamesSection() {
  const [showGame, setShowGame] = useState(false)

  return (
    <section id="games" className="min-h-screen px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[hsl(var(--color-foreground))] mb-8">
            Chase the Mantap
          </h2>
        </div>

        {!showGame ? (
          <div className="bg-[hsl(var(--color-card))] rounded-2xl p-12 sm:p-16 md:p-20 min-h-[400px] flex items-center justify-center">
            <Button
              onClick={() => setShowGame(true)}
              className="bg-[hsl(var(--color-foreground))] text-[hsl(var(--color-background))] hover:bg-[hsl(var(--color-foreground))]/90 px-8 py-6 text-base sm:text-lg font-medium rounded-lg"
            >
              Play Game
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center mb-8">
              <Button
                onClick={() => setShowGame(false)}
                variant="outline"
                className="mb-4"
              >
                Back to Menu
              </Button>
            </div>
            <MandapGame />
            {/* <GroomBrideGame /> */}
          </div>
        )}
      </div>
    </section>
  )
}
