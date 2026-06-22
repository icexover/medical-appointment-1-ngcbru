<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { hospitalInfo, floorMaps } from '@/api/hospital'
import type { FloorMap } from '@/types'

const router = useRouter()
const info = ref(hospitalInfo)
const maps = ref<FloorMap[]>(floorMaps)

const quickLinks = [
  { icon: '🗺️', name: '科室分布', path: '/hospital/map' },
  { icon: '🧭', name: '院内导航', path: '/hospital/navigation' },
  { icon: '🚇', name: '交通指南', action: 'traffic' },
  { icon: '📞', name: '联系我们', action: 'contact' },
]

function goMap() {
  router.push('/hospital/map')
}

function goNavigation() {
  router.push('/hospital/navigation')
}

function handleQuickAction(action: string) {
  if (action === 'traffic') {
    // 显示交通指南
  } else if (action === 'contact') {
    // 显示联系方式
  }
}

onMounted(() => {
  // info.value = hospitalInfo
  // maps.value = floorMaps
})
</script>

<template>
  <div class="hospital-page">
    <NavBar title="医院信息" />

    <div class="hospital-header">
      <div class="hospital-name">{{ info.name }}</div>
      <div class="hospital-level">{{ info.level }}</div>
    </div>

    <div class="info-card">
      <div class="info-stats">
        <div class="stat-item">
          <span class="stat-value">{{ info.departments }}</span>
          <span class="stat-label">科室</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ info.doctors }}</span>
          <span class="stat-label">医生</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ info.beds }}</span>
          <span class="stat-label">床位</span>
        </div>
      </div>
    </div>

    <div class="quick-links">
      <div
        v-for="link in quickLinks"
        :key="link.name"
        class="quick-item"
        @click="link.path ? router.push(link.path) : handleQuickAction(link.action || '')"
      >
        <div class="quick-icon">{{ link.icon }}</div>
        <span class="quick-name">{{ link.name }}</span>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">医院简介</h3>
      <div class="intro-card">
        <p class="intro-text">{{ info.description }}</p>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">就诊指南</h3>
      <div class="guide-list">
        <div class="guide-item">
          <span class="guide-icon">⏰</span>
          <div class="guide-info">
            <span class="guide-title">门诊时间</span>
            <span class="guide-desc">{{ info.workTime }}</span>
          </div>
        </div>
        <div class="guide-item">
          <span class="guide-icon">📍</span>
          <div class="guide-info">
            <span class="guide-title">医院地址</span>
            <span class="guide-desc">{{ info.address }}</span>
          </div>
        </div>
        <div class="guide-item">
          <span class="guide-icon">📞</span>
          <div class="guide-info">
            <span class="guide-title">咨询电话</span>
            <span class="guide-desc">{{ info.phone }}</span>
          </div>
        </div>
        <div class="guide-item">
          <span class="guide-icon">🚑</span>
          <div class="guide-info">
            <span class="guide-title">急诊电话</span>
            <span class="guide-desc emergency">{{ info.emergencyPhone }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h3 class="section-title">科室分布</h3>
        <span class="section-more" @click="goMap">查看楼层分布 →</span>
      </div>
      <div class="floor-tabs">
        <div
          v-for="floor in maps.slice(0, 3)"
          :key="floor.floor"
          class="floor-tab"
          @click="goMap"
        >
          <span class="floor-name">{{ floor.floor }}</span>
          <span class="floor-label">{{ floor.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hospital-page {
  padding-bottom: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.hospital-header {
  background: linear-gradient(135deg, #2c7be5 0%, #4d91eb 100%);
  padding: 30px 20px;
  text-align: center;
  color: #fff;

  .hospital-name {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .hospital-level {
    font-size: 13px;
    opacity: 0.9;
  }
}

.info-card {
  margin: -20px 12px 12px;
  background-color: #fff;
  border-radius: 14px;
  padding: 20px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 2;
}

.info-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #2c7be5;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: #6b7280;
  }
}

.stat-divider {
  width: 1px;
  height: 30px;
  background-color: #e5e7eb;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 0 12px 16px;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  .quick-icon {
    width: 44px;
    height: 44px;
    background-color: #f0f7ff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 6px;
  }

  .quick-name {
    font-size: 12px;
    color: #4b5563;
  }
}

.section {
  margin: 0 12px 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  padding-left: 8px;
  border-left: 3px solid #2c7be5;
}

.section-more {
  font-size: 13px;
  color: #2c7be5;
  cursor: pointer;
}

.intro-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .intro-text {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.8;
    margin: 0;
  }
}

.guide-list {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.guide-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .guide-icon {
    font-size: 24px;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .guide-info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .guide-title {
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .guide-desc {
      font-size: 13px;
      color: #6b7280;

      &.emergency {
        color: #ff4d4f;
        font-weight: 600;
      }
    }
  }
}

.floor-tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.floor-tab {
  flex-shrink: 0;
  padding: 14px 20px;
  background-color: #fff;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .floor-name {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #2c7be5;
    margin-bottom: 2px;
  }

  .floor-label {
    font-size: 12px;
    color: #9ca3af;
  }
}
</style>
