<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/order'
import type { OrderStatus } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const orderStore = useOrderStore()

const activeTab = ref<OrderStatus | 'all'>('all')

const tabs = [
  { label: '全部', value: 'all' as const },
  { label: '待就诊', value: 'pending' as const },
  { label: '已完成', value: 'completed' as const },
  { label: '已取消', value: 'cancelled' as const },
]

const displayOrders = computed(() => {
  return orderStore.getOrdersByStatus(activeTab.value)
})

const orderCounts = computed(() => ({
  all: orderStore.allOrders.length,
  pending: orderStore.pendingOrders.length,
  completed: orderStore.completedOrders.length,
  cancelled: orderStore.cancelledOrders.length,
}))

function getStatusText(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    pending: '待就诊',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status]
}

function getStatusClass(status: OrderStatus) {
  return `status-${status}`
}

function goOrderDetail(id: string) {
  router.push(`/order/${id}`)
}

function goPatients() {
  router.push('/profile/patients')
}

function goHospital() {
  router.push('/hospital')
}
</script>

<template>
  <div class="profile-page">
    <NavBar :show-back="false" title="我的" />

    <div class="user-card">
      <div class="user-avatar">
        <span class="avatar-text">{{ userStore.userInfo.name.charAt(0) }}</span>
      </div>
      <div class="user-info">
        <h2 class="user-name">{{ userStore.userInfo.name }}</h2>
        <p class="user-phone">{{ userStore.userInfo.phone }}</p>
      </div>
      <div class="user-arrow">›</div>
    </div>

    <div class="order-card">
      <div class="order-header">
        <span class="order-title">我的预约</span>
        <span class="order-more" @click="activeTab = 'all'">全部预约 ›</span>
      </div>
      <div class="order-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="order-tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          <span class="tab-icon">
            <template v-if="tab.value === 'pending'">📅</template>
            <template v-else-if="tab.value === 'completed'">✅</template>
            <template v-else-if="tab.value === 'cancelled'">❌</template>
            <template v-else>📋</template>
          </span>
          <span class="tab-count">{{ orderCounts[tab.value] }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>
    </div>

    <div class="order-list">
      <div v-if="displayOrders.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p class="empty-text">暂无预约记录</p>
      </div>
      <div
        v-for="order in displayOrders"
        :key="order.id"
        class="order-item"
        @click="goOrderDetail(order.id)"
      >
        <div class="order-top">
          <span class="doctor-name">{{ order.doctorName }} · {{ order.doctorTitle }}</span>
          <span class="order-status" :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</span>
        </div>
        <div class="order-info">
          <span class="dept">{{ order.departmentName }}</span>
          <span class="divider">|</span>
          <span class="location">{{ order.location }}</span>
        </div>
        <div class="order-time">
          <span class="date">{{ order.date }}</span>
          <span class="slot">{{ order.timeSlot }}</span>
        </div>
        <div class="order-bottom">
          <span class="patient">就诊人：{{ order.patientName }}</span>
          <span class="price">¥{{ order.price }}</span>
        </div>
      </div>
    </div>

    <div class="menu-card">
      <div class="menu-item" @click="goPatients">
        <span class="menu-icon">👥</span>
        <span class="menu-text">就诊人管理</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="goHospital">
        <span class="menu-icon">🏥</span>
        <span class="menu-text">医院导航</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">💳</span>
        <span class="menu-text">就诊卡管理</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">📋</span>
        <span class="menu-text">检查报告</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">💊</span>
        <span class="menu-text">用药提醒</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">⚙️</span>
        <span class="menu-text">设置</span>
        <span class="menu-arrow">›</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-page {
  padding-bottom: 20px;
  background-color: #f5f7fa;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #2c7be5 0%, #4d91eb 100%);
  color: #fff;

  .user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .avatar-text {
      font-size: 28px;
      font-weight: 600;
    }
  }

  .user-info {
    flex: 1;
    margin-left: 14px;

    .user-name {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .user-phone {
      font-size: 13px;
      opacity: 0.9;
    }
  }

  .user-arrow {
    font-size: 24px;
    opacity: 0.7;
  }
}

.order-card {
  margin: -20px 12px 12px;
  background-color: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 2;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .order-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .order-more {
    font-size: 13px;
    color: #9ca3af;
    cursor: pointer;
  }
}

.order-tabs {
  display: flex;
  justify-content: space-around;
}

.order-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  .tab-icon {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .tab-count {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 2px;
  }

  .tab-label {
    font-size: 12px;
    color: #6b7280;
  }

  &.active .tab-count {
    color: #2c7be5;
  }
}

.order-list {
  padding: 0 12px;
}

.order-item {
  background-color: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;

  &:active {
    opacity: 0.9;
  }
}

.order-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .doctor-name {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .order-status {
    font-size: 12px;
    padding: 3px 10px;
    border-radius: 10px;

    &.status-pending {
      color: #2c7be5;
      background-color: #e8f0fe;
    }

    &.status-completed {
      color: #52c41a;
      background-color: #f6ffed;
    }

    &.status-cancelled {
      color: #9ca3af;
      background-color: #f3f4f6;
    }
  }
}

.order-info {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;

  .divider {
    margin: 0 8px;
    color: #d1d5db;
  }
}

.order-time {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 10px;

  .date {
    font-weight: 500;
  }

  .slot {
    margin-left: 10px;
    color: #2c7be5;
  }
}

.order-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;

  .patient {
    font-size: 12px;
    color: #9ca3af;
  }

  .price {
    font-size: 16px;
    font-weight: 600;
    color: #ff4d4f;
  }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
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

.menu-card {
  margin: 12px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #f9fafb;
  }

  .menu-icon {
    font-size: 20px;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .menu-text {
    flex: 1;
    font-size: 15px;
    color: #1f2937;
  }

  .menu-arrow {
    font-size: 18px;
    color: #d1d5db;
  }
}
</style>
