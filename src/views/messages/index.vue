<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import NavBar from '@/components/NavBar.vue'
import { useNotificationStore } from '@/stores/notification'
import type { NotificationType } from '@/types'

const router = useRouter()
const notificationStore = useNotificationStore()

const activeTab = ref<NotificationType | 'all'>('all')

const tabs = [
  { label: '全部', value: 'all' as const, icon: '📬' },
  { label: '就诊提醒', value: 'reminder' as const, icon: '⏰' },
  { label: '停诊通知', value: 'cancellation' as const, icon: '⚠️' },
  { label: '系统消息', value: 'system' as const, icon: '📢' },
]

const displayNotifications = computed(() =>
  notificationStore.getNotificationsByType(activeTab.value)
)

function getTypeIcon(type: NotificationType) {
  const map: Record<NotificationType, string> = {
    reminder: '⏰',
    cancellation: '⚠️',
    transfer: '🔄',
    system: '📢',
  }
  return map[type] || '📢'
}

function handleClick(notif: typeof notificationStore.notifications[0]) {
  notificationStore.markAsRead(notif.id)

  if (notif.type === 'reminder' && notif.orderId) {
    router.push(`/order/${notif.orderId}`)
  } else if (notif.type === 'cancellation' && notif.departmentId) {
    router.push(`/department/${notif.departmentId}`)
  }
}

async function handleTransfer(notif: typeof notificationStore.notifications[0], e: Event) {
  e.stopPropagation()

  try {
    await ElMessageBox.confirm(
      '是否立即转诊至同科室其他医生？',
      '一键转诊',
      {
        confirmButtonText: '立即转诊',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
    notificationStore.markAsRead(notif.id)

    notificationStore.showInAppNotification({
      type: 'system',
      title: '转诊成功',
      content: '您的转诊申请已提交，请查看新的预约信息。',
    })
    ElMessage.success('转诊成功')

    if (notif.departmentId) {
      router.push(`/department/${notif.departmentId}`)
    }
  } catch {
    // 用户取消
  }
}

function handleMarkAllRead() {
  notificationStore.markAllAsRead()
  ElMessage.success('已全部标为已读')
}

async function handleEnableBrowserNotify() {
  await notificationStore.requestNotificationPermission()
  if (notificationStore.browserNotificationEnabled) {
    ElMessage.success('浏览器通知已开启')
  }
}
</script>

<template>
  <div class="messages-page">
    <NavBar :show-back="false" title="消息中心">
      <template #right>
        <span class="read-all-btn" @click="handleMarkAllRead">全部已读</span>
      </template>
    </NavBar>

    <div v-if="!notificationStore.browserNotificationEnabled" class="notify-tip" @click="handleEnableBrowserNotify">
      <span class="tip-icon">🔔</span>
      <span class="tip-text">开启浏览器通知，不错过重要提醒</span>
      <span class="tip-action">去开启 →</span>
    </div>

    <div class="tabs-bar">
      <div
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </div>
    </div>

    <div class="notification-list">
      <div v-if="displayNotifications.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p class="empty-text">暂无消息</p>
      </div>

      <div
        v-for="notif in displayNotifications"
        :key="notif.id"
        class="notification-item"
        :class="{ unread: !notif.read }"
        @click="handleClick(notif)"
      >
        <div class="notif-icon">
          {{ getTypeIcon(notif.type) }}
          <span v-if="!notif.read" class="dot"></span>
        </div>
        <div class="notif-content">
          <div class="notif-header">
            <span class="notif-title">{{ notif.title }}</span>
            <span class="notif-time">{{ notif.time }}</span>
          </div>
          <p class="notif-text">{{ notif.content }}</p>
          <div v-if="notif.type === 'cancellation'" class="notif-actions">
            <span class="action-btn primary" @click="handleTransfer(notif, $event)">
              一键转诊
            </span>
            <span class="action-btn">查看详情</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.messages-page {
  padding-bottom: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.read-all-btn {
  font-size: 13px;
  color: #2c7be5;
  cursor: pointer;
}

.notify-tip {
  display: flex;
  align-items: center;
  margin: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
  border-radius: 12px;
  cursor: pointer;

  .tip-icon {
    font-size: 20px;
    margin-right: 10px;
  }

  .tip-text {
    flex: 1;
    font-size: 14px;
    color: #d48806;
  }

  .tip-action {
    font-size: 13px;
    color: #fa8c16;
    font-weight: 500;
  }
}

.tabs-bar {
  display: flex;
  background-color: #fff;
  padding: 10px 0;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  .tab-icon {
    font-size: 22px;
    margin-bottom: 4px;
  }

  .tab-label {
    font-size: 12px;
    color: #6b7280;
  }

  &.active .tab-label {
    color: #2c7be5;
    font-weight: 500;
  }
}

.notification-list {
  padding: 0 12px;
}

.notification-item {
  display: flex;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &.unread {
    background-color: #f0f7ff;
  }
}

.notif-icon {
  position: relative;
  width: 44px;
  height: 44px;
  background-color: #e8f0fe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;

  .dot {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    background-color: #ff4d4f;
    border-radius: 50%;
    border: 2px solid #fff;
  }
}

.notif-content {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;

  .notif-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
  }

  .notif-time {
    font-size: 11px;
    color: #9ca3af;
    flex-shrink: 0;
    margin-left: 10px;
  }
}

.notif-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 10px 0;
}

.notif-actions {
  display: flex;
  gap: 10px;

  .action-btn {
    padding: 5px 14px;
    font-size: 12px;
    color: #6b7280;
    background-color: #f5f7fa;
    border-radius: 14px;
    cursor: pointer;

    &.primary {
      color: #fff;
      background-color: #2c7be5;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background-color: #fff;
  border-radius: 12px;

  .empty-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 14px;
    color: #9ca3af;
  }
}
</style>
