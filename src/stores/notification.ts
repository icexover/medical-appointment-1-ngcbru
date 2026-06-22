import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import type { Notification, NotificationType } from '@/types'

const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'reminder',
    title: '就诊提醒',
    content: '您预约的明天（06月25日）上午8:00 王建国医生的门诊，请准时就诊。',
    time: '2026-06-24 20:00:00',
    read: false,
    orderId: 'ord-001',
  },
  {
    id: 'notif-002',
    type: 'cancellation',
    title: '停诊通知',
    content: '抱歉通知您，李秀英医生 06月26日 下午门诊临时停诊，您可申请退款或转诊至其他医生。',
    time: '2026-06-23 15:30:00',
    read: false,
    doctorId: 'doc-201',
    departmentId: 'dept-02',
  },
  {
    id: 'notif-003',
    type: 'system',
    title: '预约成功',
    content: '您已成功预约 刘芳医生 06月28日 上午10:00 的门诊，挂号费80元。',
    time: '2026-06-21 08:00:00',
    read: true,
    orderId: 'ord-004',
  },
  {
    id: 'notif-004',
    type: 'reminder',
    title: '就诊提醒',
    content: '您今天（06月22日）下午2:00 有张明华医生的门诊，请提前15分钟到达医院。',
    time: '2026-06-22 07:00:00',
    read: true,
    orderId: 'ord-003',
  },
]

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([...mockNotifications])
  const browserNotificationEnabled = ref(false)

  const unreadCount = computed(() =>
    notifications.value.filter((n) => !n.read).length
  )

  function initBrowserNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      browserNotificationEnabled.value = true
    }
  }

  async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      browserNotificationEnabled.value = permission === 'granted'
    }
  }

  function showBrowserNotification(title: string, body: string) {
    if (browserNotificationEnabled.value && 'Notification' in window) {
      new Notification(title, { body })
    }
  }

  function showInAppNotification(notification: Omit<Notification, 'id' | 'time' | 'read'>) {
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      time: new Date().toLocaleString('zh-CN'),
      read: false,
    }
    notifications.value.unshift(newNotif)

    const typeMap: Record<NotificationType, 'success' | 'warning' | 'error' | 'info'> = {
      reminder: 'info',
      cancellation: 'warning',
      transfer: 'success',
      system: 'info',
    }

    ElNotification({
      title: newNotif.title,
      message: newNotif.content,
      type: typeMap[newNotif.type],
      duration: 5000,
    })

    showBrowserNotification(newNotif.title, newNotif.content)
  }

  function markAsRead(id: string) {
    const notif = notifications.value.find((n) => n.id === id)
    if (notif) {
      notif.read = true
    }
  }

  function markAllAsRead() {
    notifications.value.forEach((n) => (n.read = true))
  }

  function getNotificationsByType(type?: NotificationType | 'all') {
    if (!type || type === 'all') return notifications.value
    return notifications.value.filter((n) => n.type === type)
  }

  return {
    notifications,
    unreadCount,
    browserNotificationEnabled,
    initBrowserNotification,
    requestNotificationPermission,
    showBrowserNotification,
    showInAppNotification,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
  }
})
