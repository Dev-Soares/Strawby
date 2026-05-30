export interface MacroRing {
  label: string
  value: number
  max: number
  unit: string
  color: string
  trackColor: string
}

export interface DailySummary {
  macros: MacroRing[]
}
