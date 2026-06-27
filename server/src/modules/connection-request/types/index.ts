import { ConnectionRequest } from '@prisma/client';

export type ConnectionRequestPublic = Pick<
  ConnectionRequest,
  'id' | 'status' | 'nutritionistId' | 'patientId' | 'createdAt'
>;

export type ConnectionRequestWithPatient = ConnectionRequestPublic & {
  patient: { user: { name: string; email: string } };
};

export const connectionRequestSelect = {
  id: true,
  status: true,
  nutritionistId: true,
  patientId: true,
  createdAt: true,
} as const;

export const connectionRequestWithPatientSelect = {
  ...connectionRequestSelect,
  patient: { select: { user: { select: { name: true, email: true } } } },
} as const;
