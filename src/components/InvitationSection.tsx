"use client"

import { Button } from "@/components/ui/button"

export function InvitationSection() {
  const handleDownloadInvite = () => {
    // You can implement actual download functionality here
    console.log("Download invite clicked")
  }

  return (
    <section
      id="invitation"
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="text-center space-y-6">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-[hsl(var(--color-foreground))]">
          NIHAL
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl font-handwritten text-[hsl(var(--color-foreground))]">
          WEDS
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-[hsl(var(--color-foreground))]">
          SNEHA
        </h1>
        <div className="pt-8">
          <Button
            onClick={handleDownloadInvite}
            className="bg-[hsl(var(--color-foreground))] text-[hsl(var(--color-background))] hover:bg-[hsl(var(--color-foreground))]/90 px-8 py-6 text-base sm:text-lg font-medium rounded-lg"
          >
            Download Invite
          </Button>
        </div>
      </div>
    </section>
  )
}

