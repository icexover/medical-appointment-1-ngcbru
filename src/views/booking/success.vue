<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useBookingStore } from '@/stores/booking'
import { useOrderStore } from '@/stores/order'

const router = useRouter()
const bookingStore = useBookingStore()
const orderStore = useOrderStore()

const doctor = computed(() => bookingStore.selectedDoctor)
const timeSlot = computed(() => bookingStore.selectedTimeSlot)
const date = computed(() => bookingStore.selectedDate)

const latestOrder = computed(() => orderStore.allOrders[0])

function goHome() {
  bookingStore.reset()
  router.push('/home')
}

function goOrder() {
  if (latestOrder.value) {
    router.push(`/order/${latestOrder.value.id}`)
  } else {
    router.push('/profile')
  }
}
</script>

<template>
  <div class="success-page">
    <NavBar title="预约成功" :show-back="false" />

    <div class="content">
      <div class="success-icon">
        <span class="check">✓</span>
      </div>
      <h2 class="success-title">预约成功</h2>
      <p class="success-desc">您的挂号预约已成功提交</p>

      <div class="order-card">
        <div class="order-row">
          <span class="label">就诊医生</span>
          <span class="value">{{ doctor?.name }} - {{ doctor?.title }}</span>
        </div>
        <div class="order-row">
          <span class="label">所属科室</span>
          <span class="value">{{ doctor?.departmentName }}</span>
        </div>
        <div class="order-row">
          <span class="label">就诊日期</span>
          <span class="value highlight">{{ date }}</span>
        </div>
        <div class="order-row">
          <span class="label">就诊时段</span>
          <span class="value highlight">{{ timeSlot?.time }}</span>
        </div>
        <div class="order-row">
          <span class="label">就诊地点</span>
          <span class="value">门诊楼3层 305诊室</span>
        </div>
        <div class="order-row last">
          <span class="label">挂号费用</span>
          <span class="value price">¥{{ doctor?.price }}</span>
        </div>
      </div>

      <div class="tips-card">
        <h3 class="tips-title">温馨提示</h3>
        <ul class="tips-list">
          <li>请提前15分钟到达医院自助机或人工窗口取号</li>
          <li>就诊当日请携带有效身份证件</li>
          <li>如需取消预约，请在就诊前2小时操作</li>
          <li>您将在就诊前收到系统提醒通知</li>
        </ul>
      </div>
    </div>

    <div class="bottom-bar">
      <button class="btn-secondary" @click="goOrder">查看预约</button>
      <button class="btn-primary" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.success-page {
  padding-bottom: 100px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  padding: 30px 16px 20px;
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 6px 20px rgba(82, 196, 26, 0.3);

  .check {
    font-size: 42px;
    color: #fff;
    font-weight: bold;
  }
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.success-desc {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
}

.order-card {
  background-color: #fff;
  border-radius: 14px;
  padding: 20px;
  text-align: left;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;

  &.last {
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

    &.price {
      color: #ff4d4f;
      font-size: 18px;
      font-weight: 700;
    }
  }
}

.tips-card {
  background-color: #fffbeb;
  border-radius: 12px;
  padding: 16px;
  text-align: left;

  .tips-title {
    font-size: 15px;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 10px;
  }
}

.tips-list {
  margin: 0;
  padding-left: 20px;

  li {
    font-size: 13px;
    color: #a16207;
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
  gap: 12px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  z-index: 99;

  @media (min-width: 768px) {
    max-width: 768px;
  }
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 13px;
  border: none;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background-color: #f5f7fa;
  color: #6b7280;

  &:active {
    background-color: #e5e7eb;
  }
}

.btn-primary {
  background-color: #2c7be5;
  color: #fff;

  &:active {
    background-color: #1e5fb8;
  }
}
</style>
