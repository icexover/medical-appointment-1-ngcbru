<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Doctor } from '@/types'

const props = defineProps<{
  doctor: Doctor
  showDepartment?: boolean
}>()

const router = useRouter()

function goDetail() {
  router.push(`/doctor/${props.doctor.id}`)
}
</script>

<template>
  <div class="doctor-card" @click="goDetail">
    <div class="doctor-avatar">
      <span class="avatar-placeholder">
        {{ doctor.name.charAt(0) }}
      </span>
    </div>
    <div class="doctor-info">
      <div class="doctor-header">
        <span class="doctor-name">{{ doctor.name }}</span>
        <span class="doctor-title">{{ doctor.title }}</span>
      </div>
      <div v-if="showDepartment" class="doctor-dept">
        {{ doctor.departmentName }}
      </div>
      <div class="doctor-specialty">
        <span class="label">擅长：</span>
        <span class="value">{{ doctor.specialty }}</span>
      </div>
      <div class="doctor-footer">
        <div class="rating">
          <span class="star">⭐</span>
          <span class="score">{{ doctor.score }}</span>
          <span class="review-count">({{ doctor.reviewCount }}条评价)</span>
        </div>
        <div class="price">
          <span class="price-label">挂号费</span>
          <span class="price-value">¥{{ doctor.price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.doctor-card {
  display: flex;
  padding: 14px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }
}

.doctor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c7be5, #4d91eb);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .avatar-placeholder {
    font-size: 24px;
    font-weight: 600;
    color: #fff;
  }
}

.doctor-info {
  flex: 1;
  margin-left: 14px;
  min-width: 0;
}

.doctor-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;

  .doctor-name {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-right: 8px;
  }

  .doctor-title {
    font-size: 12px;
    color: #2c7be5;
    background-color: #e8f0fe;
    padding: 2px 8px;
    border-radius: 10px;
  }
}

.doctor-dept {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}

.doctor-specialty {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .label {
    color: #9ca3af;
  }

  .value {
    color: #6b7280;
  }
}

.doctor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .rating {
    display: flex;
    align-items: center;
    font-size: 12px;

    .star {
      margin-right: 4px;
    }

    .score {
      color: #faad14;
      font-weight: 600;
      margin-right: 4px;
    }

    .review-count {
      color: #9ca3af;
    }
  }

  .price {
    .price-label {
      font-size: 12px;
      color: #9ca3af;
      margin-right: 4px;
    }

    .price-value {
      font-size: 16px;
      font-weight: 600;
      color: #ff4d4f;
    }
  }
}
</style>
