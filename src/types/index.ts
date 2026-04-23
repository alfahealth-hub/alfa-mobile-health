export interface Patient {
  id: string; // Internal UUID
  patientId: string; // Assigned Unique ID Number (e.g., ALFA-001)
  name: string;
  age?: string;
  contact?: string; // Phone
  email?: string;
  gender?: string;
  address?: string;
}

export type AppointmentStatus = 'scheduled' | 'in progress' | 'done' | 'cancelled';

export interface Appointment {
  id: string;
  patientId?: string; // Linked patient internal ID
  patientName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason: string;
}

export interface PatientRecord {
  id: string;
  patientId: string; // Internal UUID
  patientUid?: string; // Assigned Unique ID Number
  appointmentId?: string; // Linked appointment
  patientName: string;
  history: string;
  symptoms: string;
  signs: string;
  diagnosis: string;
  treatment: string;
  referral: string;
  date: string;
  gender?: string;
  laboratoryTests?: string;
  // Vital Signs
  temperature?: string;
  bloodPressure?: string;
  bloodSugar?: string;
  pulse?: string;
}

export const CLINIC_CONTACT = "+234 912 790 4102";