<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElEmpty } from 'element-plus'
import NavBar from '@/components/NavBar.vue'
import SkeletonList from '@/components/SkeletonList.vue'

interface Report {
  id: string
  name: string
  type: '检验' | '检查' | '影像'
  date: string
  doctor: string
  status: '已出' | '待出'
  department: string
}

const loading = ref(true)
const reports = ref<Report[]>([])
const activeTab = ref<'all' | 'lab' | 'exam' | 'image'>('all')

const mockReports: Report[] = [
  { id: 'r-001', name: '血常规', type: '检验', date: '2026-06-18', doctor: '王建国', status: '已出', department: '心血管内科' },
  { id: 'r-002', name: '肝功能', type: '检验', date: '2026-06-18', doctor: '李秀英', status: '已出', department: '普外科' },
  { id: 'r-003', name: '胸部 CT', type: '影像', date: '2026-06-19', doctor: '张伟', status: '已出', department: '呼吸内科' },
  { id: 'r-004', name: '心电图', type: '检查', date: '2026-06-20', doctor: '刘芳', status: '已出', department: '心血管内科' },
  { id: 'r-005', name: '心脏彩超', type: '检查', date: '2026-06-22', doctor: '王建国', status: '待出', department: '心血管内科' },
  { id: 'r-006', name: '尿常规', type: '检验', date: '2026-06-22', doctor: '张明华', status: '待出', department: '儿科' },
]

const filteredReports = ref<Report[]>([])

function filterReports() {
  if (activeTab.value === 'all') {
    filteredReports.value = reports.value
  } else if (activeTab.value === 'lab') {
    filteredReports.value = reports.value.filter((r) => r.type === '检验')
  } else if (activeTab.value === 'exam') {
    filteredReports.value = reports.value.filter((r) => r.type === '检查')
  } else {
    filteredReports.value = reports.value.filter((r) => r.type === '影像')
  }
}

function viewReport(r: Report) {
  if (r.status === '待出') {
    ElMessage.info('报告尚未出具，请耐心等待')
    return
  }
  ElMessage.success(`正在查看 ${r.name} 报告...`)
}

setTimeout(() => {
  reports.value = mockReports
  filterReports()
  loading.value = false
}, 600)
</script>

<template>
  <div class="page">
    <NavBar title="报告查询" />

    <div class="content">
      <div class="tabs">
        <div
          v-for="t in [
            { key: 'all', label: '全部' },
            { key: 'lab', label: '检验报告' },
            { key: 'exam', label: '检查报告' },
            { key: 'image', label: '影像报告' },
          ]"
          :key="t.key"
          class="tab-item"
          :class="{ active: activeTab === t.key }"
          @click="activeTab = t.key as any; filterReports()"
        >
          {{ t.label }}
        </div>
      </div>

      <SkeletonList v-if="loading" :count="5" />

      <div v-else-if="filteredReports.length === 0" class="empty-wrap">
        <el-empty description="暂无报告记录" />
      </div>

      <div v-else class="list">
        <div
          v-for="r in filteredReports"
          :key="r.id"
          class="card"
          @click="viewReport(r)"
        >
          <div class="card-header">
            <span class="name">{{ r.name }}</span>
            <span class="tag" :class="r.status === '已出' ? 'ready' : 'pending'">
              {{ r.status }}
            </span>
          </div>
          <div class="card-body">
            <div class="row">
              <span class="label">类型</span>
              <span class="value">{{ r.type }}</span>
            </div>
            <div class="row">
              <span class="label">科室</span>
              <span class="value">{{ r.department }}</span>
            </div>
            <div class="row">
              <span class="label">申请医生</span>
              <span class="value">{{ r.doctor }}</span>
            </div>
            <div class="row">
              <span class="label">检查日期</span>
              <span class="value">{{ r.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background: #f5f7fa;
  min-height: 100vh;
}
.content {
  padding: 12px;
}
.tabs {
  display: flex;
  background: #fff;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  gap: 4px;
  overflow-x: auto;
}
.tab-item {
  flex: 1;
  min-width: 72px;
  padding: 10px 8px;
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &.active {
    background: #2c7be5;
    color: #fff;
    font-weight: 600;
  }
}
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: transform 0.15s;
  &:active {
    transform: scale(0.98);
  }
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f3f4f6;
  .name {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }
  .tag {
    font-size: 12px;
    padding: 3px 10px;
    border-radius: 10px;
    &.ready {
      background: #ecfdf5;
      color: #059669;
    }
    &.pending {
      background: #fef3c7;
      color: #d97706;
    }
  }
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  .label {
    color: #9ca3af;
  }
  .value {
    color: #374151;
  }
}
.empty-wrap {
  padding: 60px 0;
}
</style>
