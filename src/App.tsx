import { RSVPForm } from "@/components/RSVPForm"
import { Navigation } from "@/components/Navigation"
import { InvitationSection } from "@/components/InvitationSection"
import { GamesSection } from "@/components/GamesSection"
import { ItinerarySection } from "@/components/ItinerarySection"
import { GoodToKnowSection } from "@/components/GoodToKnowSection"

function App() {
  // Replace this with your Google Apps Script Web App URL
  // See GOOGLE_SHEETS_SETUP.md for instructions
  const googleSheetScriptUrl = import.meta.env.VITE_GOOGLE_SHEET_SCRIPT_URL

  return (
    <div className="min-h-screen relative bg-[hsl(var(--color-background))]">
      <Navigation />

      <div className="relative z-10">
        <InvitationSection />
        <GamesSection />
        <ItinerarySection />
        <RSVPSection googleSheetScriptUrl={googleSheetScriptUrl || undefined} />
        <GoodToKnowSection />
      </div>
    </div>
  )
}

// RSVP Section Component
function RSVPSection({
  googleSheetScriptUrl,
}: {
  googleSheetScriptUrl?: string
}) {
  return (
    <section id="rsvp" className="min-h-screen px-4 sm:px-6 lg:px-8 py-20">
      <RSVPForm googleSheetScriptUrl={googleSheetScriptUrl} />
    </section>
  )
}

export default App
