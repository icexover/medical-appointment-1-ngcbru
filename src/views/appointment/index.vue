<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import SkeletonList from '@/components/SkeletonList.vue'
import { getDepartments } from '@/api/department'
import type { Department } from '@/types'

const router = useRouter()
const departments = ref<Department[]>([])
const loading = ref(true)

function goDepartment(id: string) {
  router.push(`/department/${id}`)
}

onMounted(async () => {
  loading.value = true
  departments.value = await getDepartments()
  loading.value = false
})
</script>

<template>
  <div class="appointment-page">
    <NavBar :show-back="false" title="预约挂号" />

    <div class="search-hint">
      <span class="hint-icon">💡</span>
      <span class="hint-text">选择科室，查看医生排班进行预约</span>
    </div>

    <div class="dept-list">
      <template v-if="loading">
        <SkeletonList :rows="5" />
      </template>
      <template v-else>
        <div
          v-for="dept in departments"
          :key="dept.id"
          class="dept-card"
          @click="goDepartment(dept.id)"
        >
          <div class="dept-icon">{{ dept.icon }}</div>
          <div class="dept-info">
            <h3 class="dept-name">{{ dept.name }}</h3>
            <p class="dept-desc">{{ dept.description }}</p>
            <div class="dept-meta">
              <span class="meta-item">👨‍⚕️ {{ dept.doctorCount }}位医生</span>
              <span class="meta-item">📍 {{ dept.floor }}</span>
            </div>
          </div>
          <div class="dept-arrow">→</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.appointment-page {
  padding-bottom: 20px;
}

.search-hint {
  display: flex;
  align-items: center;
  margin: 12px;
  padding: 12px 16px;
  background-color: #fff7e6;
  border-radius: 10px;
  font-size: 13px;
  color: #d48806;

  .hint-icon {
    margin-right: 8px;
  }
}

.dept-list {
  padding: 0 12px;
}

.dept-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:active {
    transform: scale(0.98);
  }

  .dept-icon {
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, #e8f0fe 0%, #d0e2fd 100%);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    flex-shrink: 0;
  }

  .dept-info {
    flex: 1;
    margin: 0 12px;
    min-width: 0;

    .dept-name {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .dept-desc {
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dept-meta {
      display: flex;
      gap: 12px;

      .meta-item {
        font-size: 11px;
        color: #6b7280;
      }
    }
  }

  .dept-arrow {
    font-size: 18px;
    color: #d1d5db;
    flex-shrink: 0;
  }
}
</style>
