export type ConnectionRequest = {
  id: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  nutritionistId: string
  patientId: string
  createdAt: string
  patient: {
    user: {
      name: string
      email: string
    }
  }
}
