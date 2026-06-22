<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import NavBar from '@/components/NavBar.vue'
import { useBookingStore } from '@/stores/booking'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/order'
import { useNotificationStore } from '@/stores/notification'
import { bookAppointment } from '@/api/appointment'
import type { Patient } from '@/types'

const router = useRouter()
const bookingStore = useBookingStore()
const userStore = useUserStore()
const orderStore = useOrderStore()
const notificationStore = useNotificationStore()

const symptom = ref('')
const selectedPatientId = ref('')
const submitting = ref(false)

const doctor = computed(() => bookingStore.selectedDoctor)
const selectedDate = computed(() => bookingStore.selectedDate)
const selectedTimeSlot = computed(() => bookingStore.selectedTimeSlot)

const currentPatient = computed(() =>
  userStore.patients.find((p) => p.id === selectedPatientId.value)
)

const totalPrice = computed(() => doctor.value?.price || 0)

function showPatientPicker() {
  ElMessage.info('请在个人中心管理就诊人')
}

function handleSymptomChange(e: Event) {
  symptom.value = (e.target as HTMLTextAreaElement).value
}

async function handleSubmit() {
  if (!doctor.value || !selectedDate.value || !selectedTimeSlot.value) {
    ElMessage.error('预约信息不完整')
    return
  }

  if (!selectedPatientId.value) {
    ElMessage.warning('请选择就诊人')
    return
  }

  submitting.value = true

  try {
    const doctorPrice = doctor.value.price || 0
    const result = await bookAppointment(
      doctor.value.id,
      selectedDate.value,
      selectedTimeSlot.value,
      selectedPatientId.value,
      symptom.value,
      doctorPrice
    )

    orderStore.addOrder({
      id: result.orderId,
      doctorId: doctor.value.id,
      doctorName: doctor.value.name,
      doctorTitle: doctor.value.title,
      departmentName: doctor.value.departmentName,
      patientName: currentPatient.value?.name || '',
      date: selectedDate.value,
      timeSlot: selectedTimeSlot.value.time,
      location: '门诊楼3层 305诊室',
      price: result.price,
      status: 'pending',
      symptom: symptom.value,
      createTime: new Date().toLocaleString('zh-CN'),
    })

    notificationStore.showInAppNotification({
      type: 'system',
      title: '预约成功',
      content: `您已成功预约 ${doctor.value.name} 医生 ${selectedDate.value} ${selectedTimeSlot.value.time} 的门诊`,
    })

    bookingStore.setSymptom(symptom.value)
    bookingStore.setPendingOrderId(result.orderId)

    router.push('/booking/payment')
  } catch (error) {
    ElMessage.error('预约失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (!doctor.value) {
    ElMessage.warning('请先选择医生和就诊时间')
    router.back()
    return
  }

  if (userStore.defaultPatient) {
    selectedPatientId.value = userStore.defaultPatient.id
  }
})
</script>

<template>
  <div class="booking-confirm-page">
    <NavBar title="预约确认" />

    <div v-if="doctor && selectedTimeSlot" class="content">
      <div class="doctor-card">
        <div class="doctor-info">
          <div class="avatar">
            <span>{{ doctor.name.charAt(0) }}</span>
          </div>
          <div class="info">
            <div class="name-row">
              <span class="name">{{ doctor.name }}</span>
              <span class="title">{{ doctor.title }}</span>
            </div>
            <p class="dept">{{ doctor.departmentName }}</p>
            <p class="specialty">擅长：{{ doctor.specialty }}</p>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">就诊信息</h3>
        <div class="info-row">
          <span class="label">就诊日期</span>
          <span class="value">{{ selectedDate }}</span>
        </div>
        <div class="info-row">
          <span class="label">就诊时段</span>
          <span class="value highlight">{{ selectedTimeSlot.time }}</span>
        </div>
        <div class="info-row">
          <span class="label">剩余号源</span>
          <span class="value success">剩{{ selectedTimeSlot.remaining }}号</span>
        </div>
        <div class="info-row">
          <span class="label">就诊地点</span>
          <span class="value">门诊楼3层 305诊室</span>
        </div>
      </div>

      <div class="info-section">
        <div class="section-header">
          <h3 class="section-title">就诊人</h3>
          <span class="change-btn" @click="showPatientPicker">切换</span>
        </div>
        <div v-if="currentPatient" class="patient-card">
          <div class="patient-name">
            <span class="name">{{ currentPatient.name }}</span>
            <span class="gender">{{ currentPatient.gender }}</span>
            <span class="age">{{ currentPatient.age }}岁</span>
          </div>
          <p class="patient-idcard">身份证：{{ currentPatient.idCard }}</p>
          <p class="patient-phone">手机号：{{ currentPatient.phone }}</p>
        </div>
        <div v-else class="empty-patient" @click="showPatientPicker">
          <span>请添加就诊人</span>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">症状描述</h3>
        <textarea
          class="symptom-input"
          placeholder="请简要描述您的症状（选填）"
          rows="4"
          :value="symptom"
          @input="handleSymptomChange"
        ></textarea>
      </div>

      <div class="notice-section">
        <h3 class="section-title">预约须知</h3>
        <ul class="notice-list">
          <li>请提前15分钟到达医院取号</li>
          <li>就诊前2小时可免费取消预约</li>
          <li>爽约3次将限制预约功能</li>
          <li>如需改期请先取消再重新预约</li>
        </ul>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="price-info">
        <span class="price-label">挂号费</span>
        <span class="price-value">¥{{ totalPrice }}</span>
      </div>
      <button
        class="submit-btn"
        :disabled="submitting"
        @click="handleSubmit"
      >
        {{ submitting ? '提交中...' : '确认预约' }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.booking-confirm-page {
  padding-bottom: 80px;
}

.content {
  padding: 12px;
}

.doctor-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .doctor-info {
    display: flex;

    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2c7be5, #4d91eb);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
      flex-shrink: 0;
    }

    .info {
      flex: 1;
      margin-left: 14px;
      min-width: 0;

      .name-row {
        display: flex;
        align-items: center;
        margin-bottom: 4px;

        .name {
          font-size: 17px;
          font-weight: 600;
          color: #1f2937;
          margin-right: 8px;
        }

        .title {
          font-size: 12px;
          color: #2c7be5;
          background-color: #e8f0fe;
          padding: 2px 8px;
          border-radius: 10px;
        }
      }

      .dept {
        font-size: 13px;
        color: #6b7280;
        margin-bottom: 4px;
      }

      .specialty {
        font-size: 12px;
        color: #9ca3af;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.info-section {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .section-title {
    margin-bottom: 0;
  }

  .change-btn {
    font-size: 13px;
    color: #2c7be5;
    cursor: pointer;
  }
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #2c7be5;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 14px;
    color: #6b7280;
  }

  .value {
    font-size: 14px;
    color: #1f2937;

    &.highlight {
      color: #2c7be5;
      font-weight: 500;
    }

    &.success {
      color: #52c41a;
    }
  }
}

.patient-card {
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;

  .patient-name {
    margin-bottom: 6px;

    .name {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin-right: 8px;
    }

    .gender,
    .age {
      font-size: 12px;
      color: #9ca3af;
      margin-right: 6px;
    }
  }

  .patient-idcard,
  .patient-phone {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.empty-patient {
  padding: 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
  background-color: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
}

.symptom-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  resize: none;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2c7be5;
  }

  &::placeholder {
    color: #d1d5db;
  }
}

.notice-section {
  background-color: #fff7e6;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  .section-title {
    border-left-color: #faad14;
    color: #d48806;
  }
}

.notice-list {
  margin: 0;
  padding-left: 20px;

  li {
    font-size: 13px;
    color: #d48806;
    line-height: 1.8;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 414px;
  background-color: #fff;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  z-index: 99;

  @media (min-width: 768px) {
    max-width: 768px;
  }
}

.price-info {
  .price-label {
    font-size: 13px;
    color: #6b7280;
    margin-right: 6px;
  }

  .price-value {
    font-size: 24px;
    font-weight: 700;
    color: #ff4d4f;
  }
}

.submit-btn {
  padding: 12px 32px;
  background-color: #2c7be5;
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    background-color: #1e5fb8;
  }
}
</style>
