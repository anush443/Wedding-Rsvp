"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ConfettiAnimation } from "@/components/ConfettiAnimation"

const rsvpSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(50, {
      message: "Name must not exceed 50 characters.",
    })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message:
        "Name can only contain letters, spaces, hyphens, and apostrophes.",
    })
    .refine((val) => val.trim().length >= 3, {
      message: "Name cannot be only spaces.",
    }),
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email({
      message: "Please enter a valid email address.",
    })
    .max(100, {
      message: "Email must not exceed 100 characters.",
    }),
  attending: z.enum(["yes", "no"], {
    message: "Please select if you will be attending.",
  }),
  guests: z
    .number()
    .int({
      message: "Number of guests must be a whole number.",
    })
    .min(1, {
      message: "Please enter at least 1 guest.",
    })
    .max(50, {
      message: "Maximum 50 guests allowed.",
    }),
  dietaryRestrictions: z
    .string()
    .max(200, {
      message: "Dietary restrictions must not exceed 200 characters.",
    })
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .max(500, {
      message: "Message must not exceed 500 characters.",
    })
    .optional()
    .or(z.literal("")),
})

type RSVPFormValues = z.infer<typeof rsvpSchema>

interface RSVPFormProps {
  googleSheetScriptUrl?: string
}

export function RSVPForm({ googleSheetScriptUrl }: RSVPFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle")

  const form = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      email: "",
      attending: "yes" as const,
      guests: 1,
      dietaryRestrictions: "",
      message: "",
    },
  })

  async function onSubmit(values: RSVPFormValues) {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Normalize form data before submission
      const normalizedValues = {
        ...values,
        name: values.name.trim(),
        email: values.email.toLowerCase().trim(),
        dietaryRestrictions: values.dietaryRestrictions?.trim() || "",
        message: values.message?.trim() || "",
      }

      if (googleSheetScriptUrl) {
        await submitToGoogleSheet(normalizedValues, googleSheetScriptUrl)
      } else {
        // For development/testing - just log the values
        console.log("Form values:", normalizedValues)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      setSubmitStatus("success")
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitToGoogleSheet(
    values: RSVPFormValues,
    scriptUrl: string
  ) {
    // Validate URL format
    if (!scriptUrl || !scriptUrl.includes("script.google.com")) {
      throw new Error("Invalid Google Apps Script URL. Please check App.tsx")
    }

    // Ensure URL ends with /exec
    const url = scriptUrl.endsWith("/exec") ? scriptUrl : scriptUrl + "/exec"

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzu7MZnjh3J4SloZJGKdjzwYfGJHcfySkWdhD4Hre7tGrL-jrP6iVacKau_SR5YNONv/exec",
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            attending: values.attending,
            guests: values.guests,
            dietaryRestrictions: values.dietaryRestrictions || "",
            message: values.message || "",
            timestamp: new Date().toISOString(),
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || "Submission failed")
      }

      return result
    } catch (error) {
      // Provide more helpful error messages
      console.log("error", error)
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "Failed to connect to Google Apps Script. Common issues:\n\n" +
            "1. CORS Error: If testing on localhost, try deploying your site or use a CORS proxy\n" +
            "2. Script not deployed: Go to script.google.com → Deploy → Manage deployments\n" +
            "3. Wrong permissions: 'Who has access' must be set to 'Anyone' (not 'Anyone with Google account')\n" +
            "4. Invalid URL: The URL should end with /exec\n" +
            "5. Script needs redeployment: If you changed the script, create a new deployment\n\n" +
            `Current URL: ${url}\n` +
            "Try opening this URL in your browser to test if it's accessible."
        )
      }
      throw error
    }
  }

  if (submitStatus === "success") {
    return (
      <>
        <ConfettiAnimation variant="gold" particleCount={150} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
          <div className="elegant-card rounded-2xl p-8 sm:p-10 md:p-12 text-center shadow-2xl">
            <div className="mb-6 sm:mb-8">
              <span className="wedding-heart text-4xl sm:text-5xl mx-2 sm:mx-3 opacity-70">
                🌿
              </span>
              <span className="wedding-sparkle text-3xl sm:text-4xl mx-2 sm:mx-3 opacity-60">
                ✨
              </span>
              <span className="wedding-heart text-4xl sm:text-5xl mx-2 sm:mx-3 opacity-70">
                🌸
              </span>
            </div>

            {/* Elegant divider */}
            <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
              <span className="wedding-sparkle text-base sm:text-lg opacity-50">
                ✨
              </span>
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold gradient-text mb-6 sm:mb-8 animate-fade-in-up tracking-tight">
              Thank You!
            </h2>

            <p
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 animate-fade-in-up font-light leading-relaxed max-w-xl mx-auto"
              style={{ animationDelay: "0.2s" }}
            >
              Your RSVP has been submitted successfully. We're so excited to
              celebrate with you! 🎉
            </p>

            <div className="flex gap-3 sm:gap-4 justify-center mb-8 sm:mb-10">
              <span className="wedding-heart text-2xl sm:text-3xl opacity-60">
                💖
              </span>
              <span className="wedding-sparkle text-xl sm:text-2xl opacity-50">
                ⭐
              </span>
              <span className="wedding-heart text-2xl sm:text-3xl opacity-60">
                💖
              </span>
            </div>

            <Button
              onClick={() => setSubmitStatus("idle")}
              className="mt-6 sm:mt-8 animate-fade-in-up px-8 sm:px-10 py-6 sm:py-7 font-semibold tracking-wide uppercase border border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-300"
              style={{ animationDelay: "0.4s" }}
              variant="outline"
            >
              Submit Another RSVP
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 animate-fade-in">
      {/* Posh, sophisticated header */}
      <div className="mb-10 sm:mb-16 text-center animate-fade-in-up">
        {/* Elegant decorative elements with gold accents */}
        <div className="flex justify-center items-center gap-3 sm:gap-5 mb-6 sm:mb-8">
          <span className="wedding-heart text-3xl sm:text-4xl opacity-70">
            🌿
          </span>
          <span className="wedding-sparkle text-2xl sm:text-3xl opacity-60">
            ✨
          </span>
          <span className="wedding-heart text-3xl sm:text-4xl opacity-70">
            🌸
          </span>
        </div>

        {/* Main heading - luxurious serif with gold shimmer */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-4 sm:mb-6 tracking-tight leading-tight">
          <span className="gradient-text block">Wedding RSVP</span>
        </h1>

        {/* Elegant divider line */}
        <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
          <span className="wedding-sparkle text-lg sm:text-xl opacity-50">
            ✨
          </span>
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
        </div>

        {/* Sophisticated subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-3 sm:mb-4 font-light tracking-wide">
          We'd love to celebrate with you!
        </p>
        <p className="text-sm sm:text-base text-muted-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
          Please fill out the form below to confirm your attendance
        </p>

        {/* Bottom elegant decorative elements */}
        <div className="flex justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <span className="wedding-sparkle text-xl sm:text-2xl opacity-50">
            ⭐
          </span>
          <span className="wedding-heart text-2xl sm:text-3xl opacity-60">
            💖
          </span>
          <span className="wedding-sparkle text-xl sm:text-2xl opacity-50">
            ⭐
          </span>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 sm:space-y-6 elegant-card rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    onChange={(e) => {
                      // Only allow letters, spaces, hyphens, and apostrophes
                      const value = e.target.value.replace(/[^a-zA-Z\s'-]/g, "")
                      field.onChange(value)
                    }}
                    maxLength={50}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                    onBlur={(e) => {
                      // Auto-lowercase and trim email on blur
                      const value = e.target.value.toLowerCase().trim()
                      field.onChange(value)
                    }}
                    maxLength={100}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attending"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Will you be attending?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Yes, I'll be there!</SelectItem>
                    <SelectItem value="no">Sorry, I can't make it</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    placeholder="1"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? "" : parseInt(e.target.value)
                      if (
                        value === "" ||
                        (!isNaN(value) && value >= 1 && value <= 50)
                      ) {
                        field.onChange(value === "" ? undefined : value)
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value)
                      if (isNaN(value) || value < 1) {
                        field.onChange(1)
                      } else if (value > 50) {
                        field.onChange(50)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dietaryRestrictions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dietary Restrictions or Allergies</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Vegetarian, Gluten-free, etc. (optional)"
                    {...field}
                    maxLength={200}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional notes or well wishes..."
                    className="resize-none"
                    {...field}
                    maxLength={500}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {submitStatus === "error" && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive text-sm">
                There was an error submitting your RSVP. Please try again or
                contact us directly.
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full text-base sm:text-lg py-6 sm:py-7 font-semibold tracking-wide uppercase shadow-2xl hover:shadow-[0_0_30px_hsl(var(--color-primary)/0.4)] transition-all duration-500 hover:scale-[1.01] mt-8 sm:mt-10 relative overflow-hidden group"
            disabled={isSubmitting}
            size="lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <span className="wedding-sparkle text-xl sm:text-2xl">
                    ✨
                  </span>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span className="wedding-heart text-xl sm:text-2xl opacity-80">
                    🌿
                  </span>
                  <span>Submit RSVP</span>
                  <span className="wedding-heart text-xl sm:text-2xl opacity-80">
                    🌸
                  </span>
                </>
              )}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          </Button>
        </form>
      </Form>
    </div>
  )
}
