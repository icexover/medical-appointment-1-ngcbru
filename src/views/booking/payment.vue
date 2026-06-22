<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useBookingStore } from '@/stores/booking'

const router = useRouter()
const bookingStore = useBookingStore()

const paying = ref(false)
const selectedPayment = ref('wechat')

const doctor = computed(() => bookingStore.selectedDoctor)
const timeSlot = computed(() => bookingStore.selectedTimeSlot)
const date = computed(() => bookingStore.selectedDate)
const amount = computed(() => doctor.value?.price || 0)

const paymentMethods = [
  { id: 'wechat', name: '微信支付', icon: '💚' },
  { id: 'alipay', name: '支付宝', icon: '💙' },
  { id: 'unionpay', name: '银行卡支付', icon: '💳' },
]

async function handlePay() {
  paying.value = true

  await new Promise(resolve => setTimeout(resolve, 1500))

  paying.value = false
  router.push('/booking/success')
}
</script>

<template>
  <div class="payment-page">
    <NavBar title="支付挂号费" />

    <div class="content">
      <div class="amount-card">
        <p class="amount-label">支付金额</p>
        <div class="amount-value">¥{{ amount }}</div>
        <p class="amount-desc">挂号费 - {{ doctor?.name }} - {{ date }} {{ timeSlot?.time }}</p>
      </div>

      <div class="methods-card">
        <h3 class="card-title">选择支付方式</h3>
        <div class="method-list">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            class="method-item"
            :class="{ active: selectedPayment === method.id }"
            @click="selectedPayment = method.id"
          >
            <span class="method-icon">{{ method.icon }}</span>
            <span class="method-name">{{ method.name }}</span>
            <span class="method-check">
              <span v-if="selectedPayment === method.id" class="check-icon">✓</span>
            </span>
          </div>
        </div>
      </div>

      <div class="notice-card">
        <p class="notice-text">
          ⚠️ 支付成功后，将收到预约确认通知。请在就诊前15分钟到达医院取号。
        </p>
      </div>
    </div>

    <div class="bottom-bar">
      <button
        class="pay-btn"
        :disabled="paying"
        @click="handlePay"
      >
        {{ paying ? '支付中...' : `立即支付 ¥${amount}` }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.payment-page {
  padding-bottom: 80px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  padding: 12px;
}

.amount-card {
  background: linear-gradient(135deg, #2c7be5 0%, #4d91eb 100%);
  border-radius: 16px;
  padding: 32px 20px;
  text-align: center;
  color: #fff;
  margin-bottom: 16px;

  .amount-label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
  }

  .amount-value {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .amount-desc {
    font-size: 13px;
    opacity: 0.85;
  }
}

.methods-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
  }
}

.method-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background-color: #f9fafb;
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    border-color: #2c7be5;
    background-color: #e8f0fe;
  }

  .method-icon {
    font-size: 24px;
    margin-right: 12px;
  }

  .method-name {
    flex: 1;
    font-size: 15px;
    color: #1f2937;
  }

  .method-check {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;

    .check-icon {
      font-size: 12px;
      color: #2c7be5;
      font-weight: bold;
    }
  }

  &.active .method-check {
    border-color: #2c7be5;
    background-color: #fff;
  }
}

.notice-card {
  padding: 16px;
  background-color: #fffbeb;
  border-radius: 10px;

  .notice-text {
    font-size: 13px;
    color: #92400e;
    line-height: 1.6;
    margin: 0;
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
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  z-index: 99;

  @media (min-width: 768px) {
    max-width: 768px;
  }
}

.pay-btn {
  width: 100%;
  padding: 14px;
  background-color: #2c7be5;
  color: #fff;
  border: none;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;
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
