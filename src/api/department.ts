import { departments, doctors, getDoctorsByDepartment, getDoctorById, getDepartmentById, searchDoctors, searchDepartments } from '@/mock/data'
import type { Department, Doctor, DoctorTitle, SearchResult } from '@/types'

function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms))
}

export function getDepartments(): Promise<Department[]> {
  return delay(departments, 200)
}

export function getDepartmentDetail(id: string): Promise<Department | undefined> {
  return delay(getDepartmentById(id), 150)
}

export function getDoctors(departmentId?: string, title?: DoctorTitle, period?: string): Promise<Doctor[]> {
  let result = departmentId ? getDoctorsByDepartment(departmentId) : doctors

  if (title) {
    result = result.filter(d => d.title === title)
  }

  return delay(result, 300)
}

export function getDoctorDetail(id: string): Promise<Doctor | undefined> {
  return delay(getDoctorById(id), 200)
}

export function getRecommendDoctors(): Promise<Doctor[]> {
  const result = doctors
    .filter(d => d.score >= 4.8)
    .slice(0, 6)
  return delay(result, 250)
}

export function searchAll(keyword: string): Promise<SearchResult[]> {
  if (!keyword.trim()) return delay([], 100)

  const deps = searchDepartments(keyword).map(d => ({
    type: 'department' as const,
    id: d.id,
    name: d.name,
    description: d.description,
  }))

  const docs = searchDoctors(keyword).map(d => ({
    type: 'doctor' as const,
    id: d.id,
    name: d.name,
    description: `${d.departmentName} · ${d.title} · 擅长：${d.specialty}`,
  }))

  const diseases = [
    { name: '高血压', description: '建议到心血管内科就诊' },
    { name: '糖尿病', description: '建议到内分泌科就诊' },
    { name: '感冒发烧', description: '建议到呼吸内科或儿科就诊' },
  ].filter(d => d.name.includes(keyword)).map(d => ({
    type: 'disease' as const,
    id: d.name,
    name: d.name,
    description: d.description,
  }))

  return delay([...deps, ...docs, ...diseases], 200)
}
