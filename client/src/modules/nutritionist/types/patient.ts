export type NutritionistPatient = {
  id: string
  weight: number | null
  height: number | null
  age: number | null
  gender: string | null
  user: {
    id: string
    name: string
    email: string
  }
}
