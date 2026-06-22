import { generateWeekSchedule, generateDaySchedule } from '@/mock/schedule'
import type { DaySchedule, TimeSlot } from '@/types'

function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms))
}

export function getWeekSchedule(doctorId: string, startDate?: string): Promise<DaySchedule[]> {
  return delay(generateWeekSchedule(doctorId, startDate), 150)
}

export function getDaySchedule(doctorId: string, date: string): Promise<DaySchedule> {
  return delay(generateDaySchedule(date, doctorId), 100)
}

export function bookAppointment(
  doctorId: string,
  date: string,
  timeSlot: TimeSlot,
  patientId: string,
  symptom: string
): Promise<{ orderId: string; price: number }> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        orderId: `ord-${Date.now()}`,
        price: 100,
      })
    }, 400)
  })
}

export function cancelAppointment(orderId: string): Promise<boolean> {
  return delay(true, 200)
}
