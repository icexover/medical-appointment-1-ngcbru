import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Patient } from '@/types'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    id: 'user-001',
    name: '张三',
    phone: '138****8888',
    avatar: '',
  })

  const patients = ref<Patient[]>([
    {
      id: 'p-001',
      name: '张三',
      idCard: '110101********1234',
      phone: '13888888888',
      gender: '男',
      age: 35,
      isDefault: true,
    },
    {
      id: 'p-002',
      name: '李四',
      idCard: '110101********5678',
      phone: '13999999999',
      gender: '女',
      age: 32,
      isDefault: false,
    },
  ])

  const defaultPatient = computed(() =>
    patients.value.find((p) => p.isDefault) || patients.value[0]
  )

  function addPatient(patient: Omit<Patient, 'id'>) {
    const newPatient: Patient = {
      ...patient,
      id: `p-${Date.now()}`,
    }
    patients.value.push(newPatient)
  }

  function updatePatient(id: string, data: Partial<Patient>) {
    const index = patients.value.findIndex((p) => p.id === id)
    if (index > -1) {
      patients.value[index] = { ...patients.value[index], ...data }
    }
  }

  function removePatient(id: string) {
    patients.value = patients.value.filter((p) => p.id !== id)
  }

  function setDefaultPatient(id: string) {
    patients.value.forEach((p) => (p.isDefault = p.id === id))
  }

  return {
    userInfo,
    patients,
    defaultPatient,
    addPatient,
    updatePatient,
    removePatient,
    setDefaultPatient,
  }
})
