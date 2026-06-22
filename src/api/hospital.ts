import type { FloorMap, NavigationPoint } from '@/types'

function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms))
}

export const hospitalInfo = {
  name: '市第一人民医院',
  level: '三级甲等综合医院',
  address: '北京市朝阳区健康大道88号',
  phone: '010-88888888',
  emergencyPhone: '010-88888120',
  workTime: '门诊：周一至周日 08:00-17:30，急诊：24小时',
  description: '市第一人民医院始建于1950年，是一所集医疗、教学、科研、预防保健为一体的大型三级甲等综合医院。医院占地面积12万平方米，建筑面积25万平方米，开放床位2000张，年门诊量超过280万人次。医院现有职工3000余人，其中高级职称400余人，博士、硕士研究生600余人。',
  departments: 45,
  doctors: 800,
  beds: 2000,
}

export const floorMaps: FloorMap[] = [
  {
    floor: '1F',
    name: '一层',
    departments: [
      { name: '门诊大厅', x: 10, y: 10, width: 80, height: 25 },
      { name: '收费处', x: 10, y: 40, width: 30, height: 15 },
      { name: '药房', x: 50, y: 40, width: 30, height: 15 },
      { name: '急诊科', x: 10, y: 60, width: 35, height: 30 },
      { name: '检验科', x: 55, y: 60, width: 35, height: 30 },
    ],
  },
  {
    floor: '2F',
    name: '二层',
    departments: [
      { name: '儿科', x: 10, y: 10, width: 35, height: 25 },
      { name: '皮肤科', x: 55, y: 10, width: 35, height: 25 },
      { name: '眼科', x: 10, y: 45, width: 35, height: 25 },
      { name: '耳鼻喉科', x: 55, y: 45, width: 35, height: 25 },
    ],
  },
  {
    floor: '3F',
    name: '三层',
    departments: [
      { name: '心血管内科', x: 10, y: 10, width: 35, height: 25 },
      { name: '呼吸内科', x: 55, y: 10, width: 35, height: 25 },
      { name: '消化内科', x: 10, y: 45, width: 35, height: 25 },
      { name: '神经内科', x: 55, y: 45, width: 35, height: 25 },
    ],
  },
  {
    floor: '4F',
    name: '四层',
    departments: [
      { name: '普外科', x: 10, y: 10, width: 35, height: 25 },
      { name: '骨科', x: 55, y: 10, width: 35, height: 25 },
      { name: '妇产科', x: 10, y: 45, width: 35, height: 25 },
      { name: '口腔科', x: 55, y: 45, width: 35, height: 25 },
    ],
  },
  {
    floor: '5F',
    name: '五层',
    departments: [
      { name: '手术室', x: 10, y: 10, width: 80, height: 30 },
      { name: 'ICU', x: 10, y: 50, width: 80, height: 30 },
    ],
  },
]

export const navigationPoints: NavigationPoint[] = [
  { id: 'entry', name: '医院大门', floor: '1F', x: 10, y: 95 },
  { id: 'lobby', name: '门诊大厅', floor: '1F', x: 50, y: 70 },
  { id: 'elevator', name: '电梯间', floor: '1F', x: 90, y: 50 },
  { id: 'elevator-2', name: '电梯间', floor: '2F', x: 90, y: 50 },
  { id: 'elevator-3', name: '电梯间', floor: '3F', x: 90, y: 50 },
  { id: 'elevator-4', name: '电梯间', floor: '4F', x: 90, y: 50 },
  { id: 'pediatrics', name: '儿科', floor: '2F', x: 25, y: 20 },
  { id: 'cardiology', name: '心血管内科', floor: '3F', x: 25, y: 20 },
  { id: 'surgery', name: '普外科', floor: '4F', x: 25, y: 20 },
  { id: 'ophthalmology', name: '眼科', floor: '2F', x: 70, y: 20 },
  { id: 'pharmacy', name: '药房', floor: '1F', x: 65, y: 50 },
]

export function getHospitalInfo() {
  return delay(hospitalInfo, 150)
}

export function getFloorMaps() {
  return delay(floorMaps, 200)
}

export function getNavigationPath(from: string, to: string) {
  const fromPoint = navigationPoints.find(p => p.id === from)
  const toPoint = navigationPoints.find(p => p.id === to)
  if (!fromPoint || !toPoint) return delay([], 100)

  const path: NavigationPoint[] = [fromPoint]

  if (fromPoint.floor === toPoint.floor) {
    path.push(toPoint)
  } else {
    const elevatorId = `elevator${toPoint.floor === '1F' ? '' : '-' + toPoint.floor.replace('F', '')}`
    const elevator = navigationPoints.find(p => p.id === elevatorId)
    if (elevator) {
      path.push(elevator)
    }
    path.push(toPoint)
  }

  return delay(path, 200)
}
