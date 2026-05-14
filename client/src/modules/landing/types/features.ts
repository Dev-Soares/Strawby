import type { ReactNode } from 'react'

export interface Course {
  course: string
  number: string
  title: ReactNode
  description: string
  preview: ReactNode
}
