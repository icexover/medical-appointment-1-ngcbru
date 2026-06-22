<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElButton } from 'element-plus'
import NavBar from '@/components/NavBar.vue'
import { useBookingStore } from '@/stores/booking'
import { useOrderStore } from '@/stores/order'
import { processPayment } from '@/api/appointment'
import type { PaymentResult } from '@/api/appointment'

const router = useRouter()
const bookingStore = useBookingStore()
const orderStore = useOrderStore()

const paying = ref(false)
const paymentFailed = ref(false)
const failReason = ref('')
const retryCount = ref(0)
const selectedPayment = ref<'wechat' | 'alipay' | 'unionpay'>('wechat')

const doctor = computed(() => bookingStore.selectedDoctor)
const timeSlot = computed(() => bookingStore.selectedTimeSlot)
const date = computed(() => bookingStore.selectedDate)
const pendingOrderId = computed(() => bookingStore.pendingOrderId)
const amount = computed(() => doctor.value?.price || 0)

const order = computed(() => orderStore.getOrderById(pendingOrderId.value))

const paymentMethods: { id: 'wechat' | 'alipay' | 'unionpay'; name: string; icon: string; desc: string }[] = [
  { id: 'wechat', name: '微信支付', icon: '💚', desc: '推荐使用，已接入微信安全支付' },
  { id: 'alipay', name: '支付宝', icon: '💙', desc: '支付宝快捷支付，享优先挂号' },
  { id: 'unionpay', name: '银行卡支付', icon: '💳', desc: '支持银联借记卡/信用卡' },
]

const methodLabel = computed(() => {
  const m = paymentMethods.find((p) => p.id === selectedPayment.value)
  return m?.name || ''
})

function validateOrder(): boolean {
  if (!doctor.value) {
    ElMessage.error('订单医生信息缺失，请重新预约')
    router.replace('/home')
    return false
  }
  if (!selectedDate.value || !timeSlot.value) {
    ElMessage.error('预约时间信息缺失，请重新预约')
    router.replace('/home')
    return false
  }
  if (!pendingOrderId.value || !order.value) {
    ElMessage.error('订单信息不存在，请重新预约')
    router.replace('/home')
    return false
  }
  if (amount.value <= 0) {
    ElMessage.error('挂号费金额异常，请重新预约')
    router.replace('/home')
    return false
  }
  return true
}

async function confirmCancel(): Promise<boolean> {
  try {
    await ElMessageBox.confirm(
      '确定要取消支付吗？您可以稍后在"我的订单"中继续支付，未支付订单将在30分钟后自动取消。',
      '取消支付',
      {
        confirmButtonText: '继续支付',
        cancelButtonText: '确定取消',
        type: 'warning',
      }
    )
    return false
  } catch {
    return true
  }
}

async function handlePay() {
  if (!validateOrder()) return

  if (paying.value) return

  paying.value = true
  paymentFailed.value = false

  try {
    const result: PaymentResult = await processPayment(
      pendingOrderId.value,
      amount.value,
      selectedPayment.value
    )

    if (result.success && result.transactionId) {
      orderStore.updateOrderPaid(pendingOrderId.value, result.transactionId, selectedPayment.value)

      ElMessage.success({
        message: `${methodLabel.value}成功！`,
        duration: 2000,
      })

      setTimeout(() => {
        router.replace('/booking/success')
      }, 1200)
    } else {
      paymentFailed.value = true
      failReason.value = result.errorMsg || '支付失败，请重试'
      retryCount.value += 1

      ElMessage.error({
        message: `支付失败：${failReason.value}`,
        duration: 3500,
      })
    }
  } catch (error) {
    paymentFailed.value = true
    failReason.value = '网络异常，无法完成支付'
    retryCount.value += 1
    ElMessage.error('支付请求失败，请检查网络后重试')
  } finally {
    paying.value = false
  }
}

async function handleBack() {
  if (paying.value) {
    ElMessage.warning('支付进行中，请等待完成')
    return
  }
  const shouldCancel = await confirmCancel()
  if (shouldCancel) {
    router.back()
  }
}

onMounted(() => {
  if (!validateOrder()) return
})
</script>

<template>
  <div class="payment-page">
    <NavBar title="支付挂号费" @back="handleBack" />

    <div class="content">
      <div class="amount-card">
        <p class="amount-label">支付金额</p>
        <div class="amount-value">¥{{ amount }}</div>
        <p class="amount-desc">挂号费 - {{ doctor?.name }} {{ doctor?.title }}</p>
        <p class="amount-sub">{{ date }} {{ timeSlot?.time }}</p>
      </div>

      <div v-if="order" class="order-card">
        <div class="card-row">
          <span class="label">订单编号</span>
          <span class="value order-id">{{ order.id }}</span>
        </div>
        <div class="card-row">
          <span class="label">就诊人</span>
          <span class="value">{{ order.patientName }}</span>
        </div>
        <div class="card-row">
          <span class="label">就诊科室</span>
          <span class="value">{{ order.departmentName }}</span>
        </div>
        <div class="card-row">
          <span class="label">就诊地点</span>
          <span class="value">{{ order.location }}</span>
        </div>
        <div class="card-row total">
          <span class="label">费用明细</span>
          <span class="value price">挂号费 ¥{{ order.price }}</span>
        </div>
      </div>

      <div class="methods-card">
        <h3 class="card-title">选择支付方式</h3>
        <div class="method-list">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            class="method-item"
            :class="{ active: selectedPayment === method.id, disabled: paying }"
            @click="!paying && (selectedPayment = method.id)"
          >
            <span class="method-icon">{{ method.icon }}</span>
            <div class="method-info">
              <span class="method-name">{{ method.name }}</span>
              <span class="method-desc">{{ method.desc }}</span>
            </div>
            <span class="method-check">
              <span v-if="selectedPayment === method.id" class="check-icon">✓</span>
            </span>
          </div>
        </div>
      </div>

      <div v-if="paymentFailed" class="error-card">
        <div class="error-header">
          <span class="error-icon">⚠️</span>
          <span class="error-title">支付失败</span>
        </div>
        <p class="error-desc">{{ failReason }}</p>
        <p class="error-tip">您可以更换支付方式或稍后重试，已尝试 {{ retryCount }} 次</p>
      </div>

      <div class="notice-card">
        <p class="notice-text">
          ⚠️ 支付成功后，将收到预约确认通知。请在就诊前15分钟到达医院取号。
        </p>
        <p class="notice-text">
          💰 就诊前2小时可免费取消，超时取消将收取20%手续费。
        </p>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="bar-left">
        <span class="pay-label">应付金额：</span>
        <span class="pay-amount">¥{{ amount }}</span>
      </div>
      <el-button
        class="pay-btn"
        type="primary"
        size="large"
        round
        :loading="paying"
        :disabled="paying && !paymentFailed"
        @click="handlePay"
      >
        <template v-if="paying">
          <span>{{ methodLabel }}中...</span>
        </template>
        <template v-else-if="paymentFailed">
          <span>重新支付</span>
        </template>
        <template v-else>
          <span>立即支付</span>
        </template>
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.payment-page {
  padding-bottom: 100px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  padding: 12px;
}

.amount-card {
  background: linear-gradient(135deg, #2c7be5 0%, #4d91eb 100%);
  border-radius: 16px;
  padding: 28px 20px;
  text-align: center;
  color: #fff;
  margin-bottom: 16px;
  box-shadow: 0 6px 20px rgba(44, 123, 229, 0.25);

  .amount-label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
  }

  .amount-value {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 12px;
    line-height: 1;
  }

  .amount-desc {
    font-size: 14px;
    opacity: 0.9;
    margin: 0 0 4px;
  }

  .amount-sub {
    font-size: 12px;
    opacity: 0.8;
    margin: 0;
  }
}

.order-card,
.methods-card,
.error-card,
.notice-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.order-card {
  .card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }

    &.total {
      padding-top: 14px;
      margin-top: 4px;
      border-top: 1px dashed #e5e7eb;
      border-bottom: none;
    }

    .label {
      font-size: 14px;
      color: #6b7280;
    }

    .value {
      font-size: 14px;
      color: #1f2937;
      font-weight: 500;

      &.order-id {
        font-family: Menlo, Monaco, monospace;
        font-size: 13px;
      }

      &.price {
        color: #ef4444;
        font-weight: 700;
        font-size: 16px;
      }
    }
  }
}

.methods-card {
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 16px;
  }
}

.method-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
    background-color: #eef4ff;
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .method-icon {
    font-size: 28px;
    margin-right: 12px;
  }

  .method-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .method-name {
    font-size: 15px;
    color: #1f2937;
    font-weight: 500;
  }

  .method-desc {
    font-size: 12px;
    color: #9ca3af;
  }

  .method-check {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

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

.error-card {
  background-color: #fef2f2;
  border: 1px solid #fecaca;

  .error-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    .error-icon {
      font-size: 20px;
    }

    .error-title {
      font-size: 15px;
      font-weight: 600;
      color: #b91c1c;
    }
  }

  .error-desc {
    font-size: 14px;
    color: #7f1d1d;
    margin: 0 0 6px;
  }

  .error-tip {
    font-size: 12px;
    color: #991b1b;
    margin: 0;
    opacity: 0.85;
  }
}

.notice-card {
  background-color: #fffbeb;
  border-radius: 10px;

  .notice-text {
    font-size: 13px;
    color: #92400e;
    line-height: 1.7;
    margin: 0 0 4px;

    &:last-child {
      margin-bottom: 0;
    }
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
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  z-index: 99;

  @media (min-width: 768px) {
    max-width: 768px;
  }

  .bar-left {
    display: flex;
    align-items: baseline;
    gap: 4px;

    .pay-label {
      font-size: 13px;
      color: #6b7280;
    }

    .pay-amount {
      font-size: 22px;
      font-weight: 700;
      color: #ef4444;
    }
  }

  .pay-btn {
    flex-shrink: 0;
    min-width: 140px;
    font-weight: 600;
  }
}
</style>
