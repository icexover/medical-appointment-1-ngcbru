<script setup lang="ts">
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { floorMaps } from '@/api/hospital'
import type { FloorMap } from '@/types'

const maps = ref<FloorMap[]>(floorMaps)
const activeFloor = ref('1F')
const selectedDept = ref('')

const currentMap = computed(() =>
  maps.value.find((m) => m.floor === activeFloor.value)
)

function selectFloor(floor: string) {
  activeFloor.value = floor
  selectedDept.value = ''
}

function selectDept(deptName: string) {
  selectedDept.value = deptName
}
</script>

<template>
  <div class="hospital-map-page">
    <NavBar title="科室分布图" />

    <div class="floor-selector">
      <div
        v-for="floor in maps"
        :key="floor.floor"
        class="floor-btn"
        :class="{ active: activeFloor === floor.floor }"
        @click="selectFloor(floor.floor)"
      >
        {{ floor.floor }}
      </div>
    </div>

    <div v-if="currentMap" class="map-container">
      <div class="map-title">{{ currentMap.name }}楼层分布</div>
      <div class="map-canvas">
        <div
          v-for="(dept, index) in currentMap.departments"
          :key="dept.name"
          class="dept-block"
          :class="{ selected: selectedDept === dept.name }"
          :style="{
            left: dept.x + '%',
            top: dept.y + '%',
            width: dept.width + '%',
            height: dept.height + '%',
          }"
          @click="selectDept(dept.name)"
        >
          <span class="dept-name">{{ dept.name }}</span>
        </div>
      </div>

      <div class="legend">
        <span class="legend-item">
          <span class="legend-color available"></span>
          门诊科室
        </span>
        <span class="legend-item">
          <span class="legend-color selected"></span>
          选中科室
        </span>
      </div>
    </div>

    <div class="dept-list">
      <h3 class="list-title">本层科室</h3>
      <div class="dept-grid">
        <div
          v-for="dept in currentMap?.departments"
          :key="dept.name"
          class="dept-item"
          :class="{ selected: selectedDept === dept.name }"
          @click="selectDept(dept.name)"
        >
          {{ dept.name }}
        </div>
      </div>
    </div>

    <div v-if="selectedDept" class="dept-detail-card">
      <h4 class="detail-title">{{ selectedDept }}</h4>
      <p class="detail-info">📍 位于 {{ activeFloor }} 层</p>
      <p class="detail-tip">点击下方按钮开始导航</p>
      <button class="nav-btn">开始导航</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hospital-map-page {
  padding-bottom: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.floor-selector {
  display: flex;
  padding: 12px;
  background-color: #fff;
  gap: 8px;
  overflow-x: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.floor-btn {
  flex-shrink: 0;
  padding: 8px 18px;
  background-color: #f5f7fa;
  border-radius: 20px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background-color: #2c7be5;
    color: #fff;
  }
}

.map-container {
  margin: 12px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.map-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.map-canvas {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
}

.dept-block {
  position: absolute;
  background-color: #e8f0fe;
  border: 2px solid #2c7be5;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  .dept-name {
    font-size: 11px;
    color: #1e5fb8;
    font-weight: 500;
    padding: 0 4px;
    text-align: center;
  }

  &.selected {
    background-color: #2c7be5;

    .dept-name {
      color: #fff;
    }
  }
}

.legend {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #6b7280;

  .legend-color {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    margin-right: 6px;

    &.available {
      background-color: #e8f0fe;
      border: 2px solid #2c7be5;
    }

    &.selected {
      background-color: #2c7be5;
    }
  }
}

.dept-list {
  margin: 12px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.list-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.dept-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.dept-item {
  padding: 10px 8px;
  background-color: #f9fafb;
  border: 2px solid transparent;
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;

  &.selected {
    background-color: #e8f0fe;
    border-color: #2c7be5;
    color: #2c7be5;
    font-weight: 500;
  }
}

.dept-detail-card {
  margin: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #2c7be5 0%, #4d91eb 100%);
  border-radius: 12px;
  color: #fff;

  .detail-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  .detail-info {
    font-size: 13px;
    opacity: 0.9;
    margin: 0 0 4px 0;
  }

  .detail-tip {
    font-size: 12px;
    opacity: 0.8;
    margin: 0 0 12px 0;
  }

  .nav-btn {
    width: 100%;
    padding: 10px;
    background-color: #fff;
    color: #2c7be5;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
}
</style>
