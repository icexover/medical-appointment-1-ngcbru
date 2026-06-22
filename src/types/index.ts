export interface Department {
  id: string
  name: string
  icon: string
  description: string
  doctorCount: number
  floor: string
}

export type DoctorTitle = '主任医师' | '副主任医师' | '主治医师'

export interface Doctor {
  id: string
  name: string
  title: DoctorTitle
  departmentId: string
  departmentName: string
  avatar: string
  specialty: string
  score: number
  reviewCount: number
  price: number
  bio: string
}

export type ScheduleStatus = 'available' | 'full' | 'closed'

export interface TimeSlot {
  id: string
  time: string
  period: 'morning' | 'afternoon' | 'night'
  remaining: number
  total: number
  status: ScheduleStatus
}

export interface DaySchedule {
  date: string
  dayOfWeek: string
  status: ScheduleStatus
  timeSlots: TimeSlot[]
}

export interface Patient {
  id: string
  name: string
  idCard: string
  phone: string
  gender: '男' | '女'
  age: number
  isDefault: boolean
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled'

export interface AppointmentOrder {
  id: string
  doctorId: string
  doctorName: string
  doctorTitle: string
  departmentName: string
  patientName: string
  date: string
  timeSlot: string
  location: string
  price: number
  status: OrderStatus
  symptom?: string
  createTime: string
  paymentMethod?: 'wechat' | 'alipay' | 'unionpay'
  transactionId?: string
  payTime?: string
  medicalRecord?: {
    diagnosis: string
    prescription: string
    advice: string
  }
}

export type NotificationType = 'reminder' | 'cancellation' | 'transfer' | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  content: string
  time: string
  read: boolean
  orderId?: string
  doctorId?: string
  departmentId?: string
}

export interface FloorMap {
  floor: string
  name: string
  departments: { name: string; x: number; y: number; width: number; height: number }[]
}

export interface NavigationPoint {
  id: string
  name: string
  floor: string
  x: number
  y: number
}

export interface SearchResult {
  type: 'department' | 'doctor' | 'disease'
  id: string
  name: string
  description: string
}
