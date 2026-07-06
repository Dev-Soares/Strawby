export type MyConnectionRequest = {
  id: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  nutritionistId: string
  patientId: string
  createdAt: string
  nutritionist: {
    user: {
      name: string
    }
  }
}
