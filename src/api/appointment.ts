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
  symptom: string,
  price: number
): Promise<{ orderId: string; price: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId: `ord-${Date.now()}`,
        price: price,
      })
    }, 400)
  })
}

export interface PaymentResult {
  success: boolean
  orderId: string
  transactionId?: string
  errorMsg?: string
}

export function processPayment(
  orderId: string,
  amount: number,
  paymentMethod: 'wechat' | 'alipay' | 'unionpay'
): Promise<PaymentResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const successRate = paymentMethod === 'unionpay' ? 0.7 : 0.9
      const isSuccess = Math.random() < successRate

      if (isSuccess) {
        resolve({
          success: true,
          orderId,
          transactionId: `TX${Date.now()}${Math.floor(Math.random() * 1000)}`,
        })
      } else {
        const errors = [
          '账户余额不足，请充值后重试',
          '支付超时，请重新发起支付',
          '网络异常，请检查网络连接',
          '银行系统维护中，请稍后重试',
        ]
        resolve({
          success: false,
          orderId,
          errorMsg: errors[Math.floor(Math.random() * errors.length)],
        })
      }
    }, 2000 + Math.random() * 1000)
  })
}

export function cancelAppointment(orderId: string): Promise<boolean> {
  return delay(true, 200)
}
