<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { getDoctorDetail } from '@/api/department'
import { getWeekSchedule } from '@/api/appointment'
import { useBookingStore } from '@/stores/booking'
import type { Doctor, DaySchedule, TimeSlot } from '@/types'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

const doctorId = computed(() => route.params.id as string)
const doctor = ref<Doctor | null>(null)
const schedules = ref<DaySchedule[]>([])
const selectedDate = ref('')
const loading = ref(true)

const selectedSchedule = computed(() =>
  schedules.value.find((s) => s.date === selectedDate.value)
)

const morningSlots = computed(() =>
  selectedSchedule.value?.timeSlots.filter((s) => s.period === 'morning') || []
)

const afternoonSlots = computed(() =>
  selectedSchedule.value?.timeSlots.filter((s) => s.period === 'afternoon') || []
)

const nightSlots = computed(() =>
  selectedSchedule.value?.timeSlots.filter((s) => s.period === 'night') || []
)

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return { month, day }
}

function getStatusClass(status: string) {
  return `status-${status}`
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    available: '有号',
    full: '约满',
    closed: '停诊',
  }
  return map[status] || ''
}

function selectDate(date: string, status: string) {
  if (status === 'closed') return
  selectedDate.value = date
}

function selectTimeSlot(slot: TimeSlot) {
  if (slot.status === 'full' || slot.status === 'closed') return
  if (!doctor.value) return

  bookingStore.setDoctor(doctor.value)
  bookingStore.setDate(selectedDate.value)
  bookingStore.setTimeSlot(slot)

  router.push('/booking/confirm')
}

async function loadData() {
  loading.value = true
  try {
    const [doc, scheds] = await Promise.all([
      getDoctorDetail(doctorId.value),
      getWeekSchedule(doctorId.value),
    ])
    doctor.value = doc || null
    schedules.value = scheds

    const firstAvailable = scheds.find((s) => s.status === 'available')
    if (firstAvailable) {
      selectedDate.value = firstAvailable.date
    }
  } catch (error) {
    console.error('医生详情加载失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="doctor-page">
    <NavBar title="医生详情" />

    <div v-if="doctor" class="doctor-header">
      <div class="doctor-avatar">
        <span class="avatar-text">{{ doctor.name.charAt(0) }}</span>
      </div>
      <div class="doctor-info">
        <div class="name-row">
          <h2 class="doctor-name">{{ doctor.name }}</h2>
          <span class="doctor-title">{{ doctor.title }}</span>
        </div>
        <p class="dept-name">{{ doctor.departmentName }}</p>
        <div class="stats-row">
          <span class="rating">⭐ {{ doctor.score }}</span>
          <span class="reviews">{{ doctor.reviewCount }} 条评价</span>
        </div>
      </div>
      <div class="price-box">
        <span class="price-label">挂号费</span>
        <span class="price-value">¥{{ doctor.price }}</span>
      </div>
    </div>

    <div class="specialty-card">
      <h3 class="card-title">擅长领域</h3>
      <p class="specialty-text">{{ doctor?.specialty }}</p>
    </div>

    <div class="bio-card" v-if="doctor">
      <h3 class="card-title">个人简介</h3>
      <p class="bio-text">{{ doctor.bio }}</p>
    </div>

    <div class="schedule-section">
      <h3 class="section-title">
        <span>排班日历</span>
        <span class="subtitle">未来7天</span>
      </h3>

      <div class="calendar-bar">
        <div
          v-for="sched in schedules"
          :key="sched.date"
          class="cal-item"
          :class="[
            getStatusClass(sched.status),
            { selected: selectedDate === sched.date },
          ]"
          @click="selectDate(sched.date, sched.status)"
        >
          <span class="cal-week">{{ sched.dayOfWeek }}</span>
          <span class="cal-date">{{ formatDate(sched.date).month }}/{{ formatDate(sched.date).day }}</span>
          <span class="cal-status">{{ getStatusText(sched.status) }}</span>
        </div>
      </div>
    </div>

    <div v-if="selectedSchedule" class="time-slots-section">
      <h3 class="section-title">选择时段</h3>

      <div v-if="morningSlots.length > 0" class="slot-group">
        <div class="group-title">上午</div>
        <div class="slot-grid">
          <div
            v-for="slot in morningSlots"
            :key="slot.id"
            class="slot-item"
            :class="{
              disabled: slot.status === 'full',
            }"
            @click="selectTimeSlot(slot)"
          >
            <span class="slot-time">{{ slot.time }}</span>
            <span class="slot-remaining">
              <template v-if="slot.status === 'full'">约满</template>
              <template v-else>剩{{ slot.remaining }}号</template>
            </span>
          </div>
        </div>
      </div>

      <div v-if="afternoonSlots.length > 0" class="slot-group">
        <div class="group-title">下午</div>
        <div class="slot-grid">
          <div
            v-for="slot in afternoonSlots"
            :key="slot.id"
            class="slot-item"
            :class="{
              disabled: slot.status === 'full',
            }"
            @click="selectTimeSlot(slot)"
          >
            <span class="slot-time">{{ slot.time }}</span>
            <span class="slot-remaining">
              <template v-if="slot.status === 'full'">约满</template>
              <template v-else>剩{{ slot.remaining }}号</template>
            </span>
          </div>
        </div>
      </div>

      <div v-if="nightSlots.length > 0" class="slot-group">
        <div class="group-title">夜间</div>
        <div class="slot-grid">
          <div
            v-for="slot in nightSlots"
            :key="slot.id"
            class="slot-item"
            :class="{
              disabled: slot.status === 'full',
            }"
            @click="selectTimeSlot(slot)"
          >
            <span class="slot-time">{{ slot.time }}</span>
            <span class="slot-remaining">
              <template v-if="slot.status === 'full'">约满</template>
              <template v-else>剩{{ slot.remaining }}号</template>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.doctor-page {
  padding-bottom: 20px;
}

.doctor-header {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  background: linear-gradient(135deg, #2c7be5 0%, #4d91eb 100%);
  color: #fff;
}

.doctor-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .avatar-text {
    font-size: 32px;
    font-weight: 600;
    color: #fff;
  }
}

.doctor-info {
  flex: 1;
  margin-left: 16px;

  .name-row {
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    .doctor-name {
      font-size: 22px;
      font-weight: 700;
      margin-right: 8px;
    }

    .doctor-title {
      font-size: 12px;
      background-color: rgba(255, 255, 255, 0.25);
      padding: 2px 10px;
      border-radius: 10px;
    }
  }

  .dept-name {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
  }

  .stats-row {
    display: flex;
    gap: 16px;
    font-size: 12px;
    opacity: 0.9;
  }
}

.price-box {
  text-align: right;
  flex-shrink: 0;

  .price-label {
    display: block;
    font-size: 12px;
    opacity: 0.85;
    margin-bottom: 2px;
  }

  .price-value {
    font-size: 22px;
    font-weight: 700;
  }
}

.specialty-card,
.bio-card {
  margin: 12px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
  }
}

.specialty-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

.bio-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.7;
}

.schedule-section,
.time-slots-section {
  margin: 12px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 14px;
  padding-left: 8px;
  border-left: 3px solid #2c7be5;

  .subtitle {
    font-size: 12px;
    font-weight: normal;
    color: #9ca3af;
    border: none;
    padding: 0;
  }
}

.calendar-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.cal-item {
  flex-shrink: 0;
  width: 64px;
  padding: 10px 6px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  background-color: #f9fafb;

  &.status-available {
    .cal-status {
      color: #52c41a;
      background-color: #f6ffed;
    }
  }

  &.status-full {
    .cal-status {
      color: #9ca3af;
      background-color: #f3f4f6;
    }
  }

  &.status-closed {
    opacity: 0.6;
    .cal-status {
      color: #ff4d4f;
      background-color: #fff1f0;
    }
    cursor: not-allowed;
  }

  &.selected {
    border-color: #2c7be5;
    background-color: #e8f0fe;
  }

  .cal-week {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .cal-date {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .cal-status {
    display: inline-block;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 8px;
  }
}

.slot-group {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.group-title {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 10px;
  padding-left: 4px;
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.slot-item {
  padding: 12px 8px;
  text-align: center;
  background-color: #f9fafb;
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:active:not(.disabled) {
    transform: scale(0.95);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(.disabled):hover {
    border-color: #2c7be5;
    background-color: #e8f0fe;
  }

  .slot-time {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .slot-remaining {
    font-size: 11px;
    color: #52c41a;

    &:has(+ .disabled),
    .disabled & {
      color: #9ca3af;
    }
  }
}
</style>
