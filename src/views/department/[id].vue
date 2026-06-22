<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import DoctorCard from '@/components/DoctorCard.vue'
import SkeletonList from '@/components/SkeletonList.vue'
import { getDepartmentDetail, getDoctors } from '@/api/department'
import type { Department, Doctor, DoctorTitle } from '@/types'

const route = useRoute()
const deptId = computed(() => route.params.id as string)

const department = ref<Department | null>(null)
const doctors = ref<Doctor[]>([])
const loading = ref(true)
const titleFilter = ref<DoctorTitle | ''>('')
const periodFilter = ref('')

const titleOptions = [
  { label: '全部', value: '' },
  { label: '主任医师', value: '主任医师' },
  { label: '副主任医师', value: '副主任医师' },
  { label: '主治医师', value: '主治医师' },
]

const periodOptions = [
  { label: '全部时段', value: '' },
  { label: '上午', value: 'morning' },
  { label: '下午', value: 'afternoon' },
  { label: '夜间', value: 'night' },
]

async function loadData() {
  loading.value = true
  try {
    const [dept, docList] = await Promise.all([
      getDepartmentDetail(deptId.value),
      getDoctors(deptId.value, titleFilter.value || undefined, periodFilter.value || undefined),
    ])
    department.value = dept || null
    doctors.value = docList
  } catch (error) {
    console.error('科室数据加载失败:', error)
  } finally {
    loading.value = false
  }
}

function setTitleFilter(value: string) {
  titleFilter.value = value as DoctorTitle | ''
}

function setPeriodFilter(value: string) {
  periodFilter.value = value
}

watch([titleFilter, periodFilter], () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="department-page">
    <NavBar :title="department?.name || '科室详情'" />

    <div class="dept-header" v-if="department">
      <div class="dept-icon">{{ department.icon }}</div>
      <div class="dept-info">
        <h1 class="dept-name">{{ department.name }}</h1>
        <p class="dept-desc">{{ department.description }}</p>
        <div class="dept-stats">
          <span>👨‍⚕️ {{ department.doctorCount }} 位医生</span>
          <span>📍 {{ department.floor }}</span>
        </div>
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-group">
        <span class="filter-label">职称：</span>
        <div class="filter-tags">
          <span
            v-for="opt in titleOptions"
            :key="opt.value"
            class="filter-tag"
            :class="{ active: titleFilter === opt.value }"
            @click="setTitleFilter(opt.value)"
          >
            {{ opt.label }}
          </span>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label">时段：</span>
        <div class="filter-tags">
          <span
            v-for="opt in periodOptions"
            :key="opt.value"
            class="filter-tag"
            :class="{ active: periodFilter === opt.value }"
            @click="setPeriodFilter(opt.value)"
          >
            {{ opt.label }}
          </span>
        </div>
      </div>
    </div>

    <div class="doctor-list">
      <template v-if="loading">
        <SkeletonList :rows="4" />
      </template>
      <template v-else>
        <div v-if="doctors.length === 0" class="empty-state">
          <span class="empty-icon">🔍</span>
          <p class="empty-text">暂无符合条件的医生</p>
        </div>
        <DoctorCard
          v-for="doctor in doctors"
          :key="doctor.id"
          :doctor="doctor"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.department-page {
  padding-bottom: 20px;
}

.dept-header {
  display: flex;
  padding: 16px;
  background: linear-gradient(135deg, #2c7be5 0%, #4d91eb 100%);
  color: #fff;

  .dept-icon {
    width: 64px;
    height: 64px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    flex-shrink: 0;
  }

  .dept-info {
    flex: 1;
    margin-left: 14px;

    .dept-name {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .dept-desc {
      font-size: 13px;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .dept-stats {
      display: flex;
      gap: 16px;
      font-size: 12px;
      opacity: 0.85;
    }
  }
}

.filter-bar {
  background-color: #fff;
  padding: 12px 16px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter-label {
  font-size: 13px;
  color: #6b7280;
  flex-shrink: 0;
  width: 44px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.filter-tag {
  padding: 5px 12px;
  background-color: #f5f7fa;
  border-radius: 16px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background-color: #e8f0fe;
    color: #2c7be5;
    font-weight: 500;
  }
}

.doctor-list {
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;

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
