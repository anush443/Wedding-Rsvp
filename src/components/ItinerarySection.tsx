"use client"

export function ItinerarySection() {
  return (
    <section id="itinerary" className="min-h-screen px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[hsl(var(--color-card))] rounded-2xl p-8 sm:p-12 md:p-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[hsl(var(--color-foreground))] text-center mb-12 uppercase tracking-wide">
            ITINERARY
          </h2>

          <div className="space-y-12">
            {/* Wedding Event */}
            <div className="text-center space-y-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[hsl(var(--color-foreground))]">
                8TH FEB | WEDDING
              </div>
              <div className="text-xl sm:text-2xl font-serif text-[hsl(var(--color-foreground))]">
                11AM ONWARDS
              </div>
              <div className="text-base sm:text-lg font-sans uppercase text-[hsl(var(--color-foreground))] tracking-wide">
                INDIANA CONVENTION CENTER
              </div>
              <div className="text-xl sm:text-2xl font-serif text-[hsl(var(--color-foreground))] uppercase">
                MANGALORE
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="flex justify-center">
              <div className="w-px h-16 bg-[hsl(var(--color-foreground))] opacity-30"></div>
            </div>

            {/* Reception Event */}
            <div className="text-center space-y-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[hsl(var(--color-foreground))]">
                14TH FEB | RECEPTION
              </div>
              <div className="text-xl sm:text-2xl font-serif text-[hsl(var(--color-foreground))]">
                7:00 PM ONWARDS
              </div>
              <div className="text-base sm:text-lg font-sans uppercase text-[hsl(var(--color-foreground))] tracking-wide">
                CHAKOLAS PAVILION
              </div>
              <div className="text-xl sm:text-2xl font-serif text-[hsl(var(--color-foreground))] uppercase">
                KOCHI
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

