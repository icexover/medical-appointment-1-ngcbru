<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import DoctorCard from '@/components/DoctorCard.vue'
import SkeletonList from '@/components/SkeletonList.vue'
import { getDepartments, getRecommendDoctors } from '@/api/department'
import type { Department, Doctor } from '@/types'

const router = useRouter()
const departments = ref<Department[]>([])
const recommendDoctors = ref<Doctor[]>([])
const loading = ref(true)

const quickActions = [
  { icon: '🏥', name: '医院导航', path: '/hospital' },
  { icon: '📋', name: '报告查询', path: '/reports' },
  { icon: '💊', name: '药品查询', path: '/medicine' },
  { icon: '🩻', name: '检查预约', path: '/exam' },
  { icon: '🚑', name: '急诊就医', path: '/emergency' },
  { icon: '💳', name: '门诊缴费', path: '/payment' },
  { icon: '📑', name: '体检预约', path: '/checkup' },
  { icon: '📞', name: '在线客服', path: '/service' },
]

function goDepartment(id: string) {
  router.push(`/department/${id}`)
}

function goAppointment() {
  router.push('/appointment')
}

function goQuickAction(path: string) {
  if (path === '/hospital') {
    router.push(path)
  }
}

onMounted(async () => {
  loading.value = true
  const [deps, docs] = await Promise.all([
    getDepartments(),
    getRecommendDoctors(),
  ])
  departments.value = deps
  recommendDoctors.value = docs
  loading.value = false
})
</script>

<template>
  <div class="home-page">
    <NavBar :show-back="false" show-search>
      <template #title></template>
    </NavBar>

    <div class="banner">
      <div class="banner-content">
        <h2 class="banner-title">智慧医院 · 便捷就医</h2>
        <p class="banner-subtitle">在线预约挂号，省时省心</p>
      </div>
    </div>

    <div class="quick-section">
      <div class="quick-grid">
        <div
          v-for="action in quickActions"
          :key="action.name"
          class="quick-item"
          @click="goQuickAction(action.path)"
        >
          <div class="quick-icon">{{ action.icon }}</div>
          <span class="quick-name">{{ action.name }}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h3 class="section-title">热门科室</h3>
        <span class="section-more" @click="goAppointment">全部 →</span>
      </div>
      <div class="dept-grid">
        <div
          v-for="dept in departments.slice(0, 8)"
          :key="dept.id"
          class="dept-item"
          @click="goDepartment(dept.id)"
        >
          <div class="dept-icon">{{ dept.icon }}</div>
          <span class="dept-name">{{ dept.name }}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h3 class="section-title">推荐医生</h3>
        <span class="section-more" @click="goAppointment">更多 →</span>
      </div>
      <template v-if="loading">
        <SkeletonList :rows="3" />
      </template>
      <template v-else>
        <div class="doctor-list">
          <DoctorCard
            v-for="doctor in recommendDoctors"
            :key="doctor.id"
            :doctor="doctor"
            show-department
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 20px;
}

.banner {
  margin: 12px;
  padding: 24px 20px;
  background: linear-gradient(135deg, #2c7be5 0%, #4d91eb 100%);
  border-radius: 16px;
  color: #fff;

  .banner-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .banner-subtitle {
    font-size: 13px;
    opacity: 0.9;
  }
}

.quick-section {
  margin: 16px 12px;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px 0;
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
    color: #6b7280;
  }
}

.section {
  margin: 0 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  padding-left: 8px;
  border-left: 3px solid #2c7be5;
}

.section-more {
  font-size: 13px;
  color: #9ca3af;
  cursor: pointer;
}

.dept-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.dept-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  .dept-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #e8f0fe 0%, #d0e2fd 100%);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 6px;
  }

  .dept-name {
    font-size: 12px;
    color: #4b5563;
    text-align: center;
  }
}

.doctor-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
