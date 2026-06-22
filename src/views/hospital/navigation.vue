<script setup lang="ts">
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { navigationPoints } from '@/api/hospital'
import type { NavigationPoint } from '@/types'

const startPoint = ref<string>('entry')
const endPoint = ref<string>('cardiology')
const showPath = ref(false)

const points = navigationPoints

const startPoints = computed(() => points.filter(p => p.floor === '1F'))
const endPoints = computed(() => points)

const currentFloor = ref('1F')

function handleNavigate() {
  showPath.value = true
}

function getFloorPoints(floor: string) {
  return points.filter(p => p.floor === floor)
}

const floors = ['1F', '2F', '3F', '4F', '5F']
</script>

<template>
  <div class="navigation-page">
    <NavBar title="院内导航" />

    <div class="selector-card">
      <div class="selector-row">
        <span class="selector-label">起点</span>
        <select
          v-model="startPoint"
          class="selector-select"
        >
          <option v-for="p in startPoints" :key="p.id" :value="p.id">
            {{ p.name }} ({{ p.floor }})
          </option>
        </select>
      </div>
      <div class="selector-row">
        <span class="selector-label">终点</span>
        <select
          v-model="endPoint"
          class="selector-select"
        >
          <option v-for="p in endPoints" :key="p.id" :value="p.id">
            {{ p.name }} ({{ p.floor }})
          </option>
        </select>
      </div>
      <button class="navigate-btn" @click="handleNavigate">
        🧭 开始导航
      </button>
    </div>

    <div v-if="showPath" class="nav-result">
      <div class="result-header">
        <h3 class="result-title">导航路线</h3>
        <span class="result-hint">预计步行约 3 分钟</span>
      </div>

      <div class="floor-nav">
        <div
          v-for="floor in floors"
          :key="floor"
          class="floor-tab"
          :class="{ active: currentFloor === floor }"
          @click="currentFloor = floor"
        >
          {{ floor }}
        </div>
      </div>

      <div class="nav-map">
        <div class="map-canvas">
          <div
            v-for="pt in getFloorPoints(currentFloor)"
            :key="pt.id"
            class="nav-point"
            :class="{
              start: pt.id === startPoint,
              end: pt.id === endPoint,
              onpath: pt.id === startPoint || pt.id === endPoint,
            }"
            :style="{ left: pt.x + '%', top: pt.y + '%' }"
          >
            <span class="point-name">{{ pt.name }}</span>
          </div>
        </div>
      </div>

      <div class="nav-steps">
        <h4 class="steps-title">导航步骤</h4>
        <div class="steps-list">
          <div class="step-item">
            <span class="step-num">1</span>
            <span class="step-text">从医院大门进入，直行至门诊大厅</span>
          </div>
          <div class="step-item">
            <span class="step-num">2</span>
            <span class="step-text">门诊大厅右转，乘坐电梯上3楼</span>
          </div>
          <div class="step-item">
            <span class="step-num">3</span>
            <span class="step-text">出电梯后左转，直行约50米到达心血管内科</span>
          </div>
        </div>
      </div>
    </div>

    <div class="search-section">
      <h3 class="section-title">热门目的地</h3>
      <div class="dest-grid">
        <div
          v-for="p in points.filter(p => !['entry', 'elevator', 'elevator-2', 'elevator-3', 'elevator-4', 'lobby'].includes(p.id))"
          :key="p.id"
          class="dest-item"
          @click="endPoint = p.id; showPath = false"
        >
          <span class="dest-icon">🏥</span>
          <span class="dest-name">{{ p.name }}</span>
          <span class="dest-floor">{{ p.floor }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navigation-page {
  padding-bottom: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.selector-card {
  margin: 12px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.selector-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  &:last-of-type {
    margin-bottom: 16px;
  }
}

.selector-label {
  width: 40px;
  font-size: 14px;
  color: #6b7280;
  flex-shrink: 0;
}

.selector-select {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background-color: #f9fafb;

  &:focus {
    outline: none;
    border-color: #2c7be5;
  }
}

.navigate-btn {
  width: 100%;
  padding: 12px;
  background-color: #2c7be5;
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:active {
    background-color: #1e5fb8;
  }
}

.nav-result {
  margin: 12px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;

  .result-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .result-hint {
    font-size: 12px;
    color: #52c41a;
  }
}

.floor-nav {
  display: flex;
  gap: 6px;
  padding: 10px 16px;
  background-color: #f9fafb;
  overflow-x: auto;
}

.floor-tab {
  flex-shrink: 0;
  padding: 6px 14px;
  background-color: #fff;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;

  &.active {
    border-color: #2c7be5;
    color: #2c7be5;
    background-color: #e8f0fe;
  }
}

.nav-map {
  padding: 16px;
}

.map-canvas {
  position: relative;
  width: 100%;
  height: 180px;
  background-color: #f5f7fa;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
}

.nav-point {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;

  .point-name {
    display: block;
    font-size: 11px;
    color: #6b7280;
    background-color: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
  }

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background-color: #9ca3af;
    border-radius: 50%;
  }

  &.start::before {
    width: 12px;
    height: 12px;
    background-color: #52c41a;
    top: -8px;
  }

  &.end::before {
    width: 12px;
    height: 12px;
    background-color: #ff4d4f;
    top: -8px;
  }

  &.onpath .point-name {
    font-weight: 600;
    color: #2c7be5;
  }
}

.nav-steps {
  padding: 16px;
  border-top: 1px solid #f5f5f5;

  .steps-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 12px 0;
  }
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-item {
  display: flex;
  align-items: flex-start;

  .step-num {
    width: 22px;
    height: 22px;
    background-color: #2c7be5;
    color: #fff;
    border-radius: 50%;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-right: 10px;
    margin-top: 1px;
  }

  .step-text {
    flex: 1;
    font-size: 14px;
    color: #4b5563;
    line-height: 1.5;
  }
}

.search-section {
  margin: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  padding-left: 8px;
  border-left: 3px solid #2c7be5;
}

.dest-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.dest-item {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background-color: #fff;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .dest-icon {
    font-size: 20px;
    margin-right: 8px;
  }

  .dest-name {
    flex: 1;
    font-size: 13px;
    color: #1f2937;
  }

  .dest-floor {
    font-size: 11px;
    color: #9ca3af;
    background-color: #f5f7fa;
    padding: 2px 8px;
    border-radius: 8px;
  }
}
</style>
