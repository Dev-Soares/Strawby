import { config } from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

config({ path: resolve(__dirname, '../.env') })

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

const scores = [
  0.82, 0.75, 0.91, 0.68, 0.55, 0.88, 0.72, 0.60, 0.95, 0.78,
  0.45, 0.83, 0.70, 0.92, 0.64, 0.77, 0.58, 0.85, 0.73, 0.90,
  0.66, 0.80, 0.52, 0.88, 0.74, 0.61, 0.93, 0.70, 0.84, 0.79,
]

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'paciente@teste.com' } })
  if (!user) throw new Error('Usuário não encontrado')

  const patient = await prisma.patient.findUnique({ where: { id: user.id } })
  if (!patient) throw new Error('Paciente não encontrado para esse usuário')

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const created: string[] = []

  for (let i = 0; i < scores.length; i++) {
    const date = new Date(today)
    date.setUTCDate(date.getUTCDate() - i)

    await prisma.dailyScore.upsert({
      where: { patientId_date: { patientId: patient.id, date } },
      create: { patientId: patient.id, date, score: scores[i] },
      update: { score: scores[i] },
    })
    created.push(date.toISOString().split('T')[0])
  }

  console.log(`✓ ${created.length} pontuações criadas para ${user.email}`)
  console.log('Datas:', created.join(', '))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
