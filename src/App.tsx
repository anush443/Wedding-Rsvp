import { RSVPForm } from "@/components/RSVPForm"
import { DecorativeElements } from "@/components/DecorativeElements"
import { GroomBrideGame } from "@/components/GroomBrideGame"
import MandapGame from "@/components/MandapRaceGame"
import { ConfettiAnimation } from "@/components/ConfettiAnimation"

function App() {
  // Replace this with your Google Apps Script Web App URL
  // See GOOGLE_SHEETS_SETUP.md for instructions
  const googleSheetScriptUrl = import.meta.env.VITE_GOOGLE_SHEET_SCRIPT_URL

  return (
    <div className="min-h-screen text-foreground relative bg-background">
      <ConfettiAnimation />
      <DecorativeElements />
      <div className="relative z-10">
        <RSVPForm googleSheetScriptUrl={googleSheetScriptUrl || undefined} />
        <GroomBrideGame />
        <MandapGame />
      </div>
    </div>
  )
}

export default App
