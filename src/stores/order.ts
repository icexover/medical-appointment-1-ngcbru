import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppointmentOrder, OrderStatus } from '@/types'

const mockOrders: AppointmentOrder[] = [
  {
    id: 'ord-001',
    doctorId: 'doc-101',
    doctorName: '王建国',
    doctorTitle: '主任医师',
    departmentName: '心血管内科',
    patientName: '张三',
    date: '2026-06-25',
    timeSlot: '08:00-08:30',
    location: '门诊楼3层 305诊室',
    price: 100,
    status: 'pending',
    symptom: '胸闷、气短，偶尔心慌',
    createTime: '2026-06-20 10:30:00',
  },
  {
    id: 'ord-002',
    doctorId: 'doc-201',
    doctorName: '李秀英',
    doctorTitle: '副主任医师',
    departmentName: '普外科',
    patientName: '李四',
    date: '2026-06-18',
    timeSlot: '14:00-14:30',
    location: '门诊楼4层 412诊室',
    price: 80,
    status: 'completed',
    symptom: '胃部不适，饭后疼痛',
    createTime: '2026-06-10 09:00:00',
    medicalRecord: {
      diagnosis: '慢性胃炎',
      prescription: '奥美拉唑肠溶胶囊、胶体果胶铋',
      advice: '饮食清淡，规律三餐，避免辛辣刺激食物，一周后复诊',
    },
  },
  {
    id: 'ord-003',
    doctorId: 'doc-301',
    doctorName: '张明华',
    doctorTitle: '主治医师',
    departmentName: '儿科',
    patientName: '张小宝',
    date: '2026-06-15',
    timeSlot: '09:30-10:00',
    location: '门诊楼2层 208诊室',
    price: 60,
    status: 'cancelled',
    symptom: '发烧、咳嗽',
    createTime: '2026-06-12 16:00:00',
  },
  {
    id: 'ord-004',
    doctorId: 'doc-102',
    doctorName: '刘芳',
    doctorTitle: '副主任医师',
    departmentName: '心血管内科',
    patientName: '张三',
    date: '2026-06-28',
    timeSlot: '10:00-10:30',
    location: '门诊楼3层 306诊室',
    price: 80,
    status: 'pending',
    symptom: '定期复查',
    createTime: '2026-06-21 08:00:00',
  },
]

export const useOrderStore = defineStore('order', () => {
  const orders = ref<AppointmentOrder[]>([...mockOrders])

  const allOrders = computed(() => orders.value)

  const pendingOrders = computed(() =>
    orders.value.filter((o) => o.status === 'pending')
  )

  const completedOrders = computed(() =>
    orders.value.filter((o) => o.status === 'completed')
  )

  const cancelledOrders = computed(() =>
    orders.value.filter((o) => o.status === 'cancelled')
  )

  function getOrderById(id: string) {
    return orders.value.find((o) => o.id === id)
  }

  function addOrder(order: AppointmentOrder) {
    orders.value.unshift(order)
  }

  function cancelOrder(id: string) {
    const order = orders.value.find((o) => o.id === id)
    if (order) {
      order.status = 'cancelled'
    }
  }

  function updateOrderPaid(id: string, transactionId: string, paymentMethod: 'wechat' | 'alipay' | 'unionpay') {
    const order = orders.value.find((o) => o.id === id)
    if (order) {
      order.status = 'pending'
      order.paymentMethod = paymentMethod
      order.transactionId = transactionId
      order.payTime = new Date().toLocaleString('zh-CN')
    }
  }

  function getOrdersByStatus(status?: OrderStatus | 'all') {
    if (!status || status === 'all') return orders.value
    return orders.value.filter((o) => o.status === status)
  }

  return {
    orders,
    allOrders,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    getOrderById,
    addOrder,
    cancelOrder,
    updateOrderPaid,
    getOrdersByStatus,
  }
})
