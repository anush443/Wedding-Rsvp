"use client"

import { useState, useEffect } from "react"

const navItems = [
  { id: "invitation", label: "Invitation" },
  { id: "games", label: "Games" },
  { id: "itinerary", label: "Itinerary" },
  { id: "rsvp", label: "RSVP" },
  { id: "good-to-know", label: "Good to know" },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState("invitation")

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(sectionId)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }))

      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.element) {
          const offsetTop = section.element.offsetTop
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-[hsl(var(--color-background))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center gap-6 sm:gap-8 md:gap-12 py-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                activeSection === item.id
                  ? "text-[hsl(var(--color-foreground))] underline decoration-[hsl(var(--color-foreground))] decoration-1 underline-offset-4"
                  : "text-[hsl(var(--color-foreground))] hover:text-[hsl(var(--color-foreground))] opacity-70 hover:opacity-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

