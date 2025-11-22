"use client"

export function GoodToKnowSection() {
  return (
    <section
      id="good-to-know"
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-[hsl(var(--color-card))] rounded-2xl p-8 sm:p-12 md:p-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[hsl(var(--color-foreground))] text-center mb-12 uppercase tracking-wide">
            GOOD TO KNOW
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Mangalore */}
            <div className="text-center space-y-6">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[hsl(var(--color-foreground))] uppercase">
                BE THERE IN MANGALORE
              </h3>
              <div className="text-xl sm:text-2xl font-serif text-[hsl(var(--color-foreground))]">
                BY 7TH or 8TH
              </div>
              <p className="text-base sm:text-lg font-serif text-[hsl(var(--color-foreground))] leading-relaxed">
                PEOPLE TRAVELLING BY TRAIN SHOULD CONSIDER BOOKING TICKETS ON DECEMBER 8TH
              </p>
              <div className="text-xl sm:text-2xl font-serif font-bold text-[hsl(var(--color-foreground))] uppercase pt-4">
                ETHNIC
              </div>
            </div>

            {/* Right Column - Kochi */}
            <div className="text-center space-y-6">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[hsl(var(--color-foreground))] uppercase">
                REACH KOCHI
              </h3>
              <div className="text-xl sm:text-2xl font-serif text-[hsl(var(--color-foreground))]">
                BY 13TH OR 14TH
              </div>
              <p className="text-base sm:text-lg font-serif text-[hsl(var(--color-foreground))] leading-relaxed">
                PEOPLE TRAVELLING BY TRAIN SHOULD CONSIDER BOOKING TICKETS ON DECEMBER 14TH
              </p>
              <div className="text-xl sm:text-2xl font-serif font-bold text-[hsl(var(--color-foreground))] uppercase pt-4">
                FORMAL
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

