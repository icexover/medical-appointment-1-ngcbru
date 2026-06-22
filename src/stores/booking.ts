import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Doctor, Patient, TimeSlot } from '@/types'

export const useBookingStore = defineStore('booking', () => {
  const selectedDoctor = ref<Doctor | null>(null)
  const selectedDate = ref<string>('')
  const selectedTimeSlot = ref<TimeSlot | null>(null)
  const selectedPatient = ref<Patient | null>(null)
  const symptom = ref('')
  const pendingOrderId = ref<string>('')

  function setDoctor(doctor: Doctor) {
    selectedDoctor.value = doctor
    selectedDate.value = ''
    selectedTimeSlot.value = null
  }

  function setDate(date: string) {
    selectedDate.value = date
    selectedTimeSlot.value = null
  }

  function setTimeSlot(slot: TimeSlot) {
    selectedTimeSlot.value = slot
  }

  function setPatient(patient: Patient) {
    selectedPatient.value = patient
  }

  function setSymptom(text: string) {
    symptom.value = text
  }

  function setPendingOrderId(id: string) {
    pendingOrderId.value = id
  }

  function reset() {
    selectedDoctor.value = null
    selectedDate.value = ''
    selectedTimeSlot.value = null
    selectedPatient.value = null
    symptom.value = ''
    pendingOrderId.value = ''
  }

  return {
    selectedDoctor,
    selectedDate,
    selectedTimeSlot,
    selectedPatient,
    symptom,
    pendingOrderId,
    setDoctor,
    setDate,
    setTimeSlot,
    setPatient,
    setSymptom,
    setPendingOrderId,
    reset,
  }
})
