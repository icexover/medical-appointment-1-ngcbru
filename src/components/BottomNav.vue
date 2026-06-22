<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const tabs = [
  { path: '/home', name: '首页', icon: '🏠' },
  { path: '/appointment', name: '预约', icon: '📅' },
  { path: '/messages', name: '消息', icon: '🔔' },
  { path: '/profile', name: '我的', icon: '👤' },
]

const showTabBar = computed(() => {
  return route.meta.showTabBar !== false
})

function handleClick(path: string) {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<template>
  <div v-if="showTabBar" class="tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      class="tab-item"
      :class="{ active: route.path === tab.path }"
      @click="handleClick(tab.path)"
    >
      <div class="tab-icon">
        <span class="icon-text">{{ tab.icon }}</span>
        <span v-if="tab.path === '/messages' && notificationStore.unreadCount > 0" class="badge">
          {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
        </span>
      </div>
      <span class="tab-label">{{ tab.name }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 414px;
  height: 56px;
  background-color: #fff;
  display: flex;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  z-index: 100;
  border-top: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    max-width: 768px;
  }
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  .tab-icon {
    position: relative;
    font-size: 22px;
    line-height: 1;
    margin-bottom: 2px;

    .icon-text {
      font-size: 20px;
    }
  }

  .badge {
    position: absolute;
    top: -4px;
    right: -8px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    background-color: #ff4d4f;
    color: #fff;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
    border-radius: 8px;
  }

  .tab-label {
    font-size: 11px;
    color: #999;
    transition: color 0.2s;
  }

  &.active {
    .tab-label {
      color: #2c7be5;
      font-weight: 500;
    }
  }
}
</style>
