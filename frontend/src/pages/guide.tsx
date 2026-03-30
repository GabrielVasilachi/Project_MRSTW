import React from "react"
import Cards from "../content/Cards_HowItWorks.json"
import icons from "../components/base/Icons_HowItWorks"

type Step = {
  icon_key: "document" | "box" | "search" | "info" | "card" | "check"
  heading: string
  description: string
  bullets: string[]
}

const HowItWorksStep: React.FC = () => {
  const steps = Cards.steps as Step[]

  return (
    <div className="space-y-4 max-w-4xl mx-auto px-4 py-8">
      {steps.map((s, idx) => (
        <div key={idx} className="bg-white border rounded-lg p-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              {icons[s.icon_key]}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{s.heading}</h3>
              <p className="text-sm text-gray-600 mb-3">{s.description}</p>

              <ul className="space-y-1 text-sm text-gray-600">
                {s.bullets.map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HowItWorksStep
