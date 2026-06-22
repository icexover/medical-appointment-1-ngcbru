<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import NavBar from '@/components/NavBar.vue'
import { useOrderStore } from '@/stores/order'
import type { OrderStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const orderId = computed(() => route.params.id as string)
const order = computed(() => orderStore.getOrderById(orderId.value))

const showRecord = ref(false)

function getStatusText(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    pending: '待就诊',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status]
}

function getStatusClass(status: OrderStatus) {
  return `status-${status}`
}

async function handleCancel() {
  if (!order.value) return

  try {
    await ElMessageBox.confirm(
      '确定要取消该预约吗？就诊前2小时可免费取消。',
      '取消预约',
      {
        type: 'warning',
        confirmButtonText: '确定取消',
        cancelButtonText: '再想想',
      }
    )
    orderStore.cancelOrder(orderId.value)
    ElMessage.success('预约已取消')
  } catch {
    // 用户取消
  }
}

function toggleRecord() {
  showRecord.value = !showRecord.value
}
</script>

<template>
  <div class="order-detail-page">
    <NavBar title="订单详情" />

    <div v-if="order" class="content">
      <div class="status-card" :class="getStatusClass(order.status)">
        <div class="status-icon">
          <template v-if="order.status === 'pending'">📅</template>
          <template v-else-if="order.status === 'completed'">✅</template>
          <template v-else>❌</template>
        </div>
        <div class="status-info">
          <h2 class="status-title">{{ getStatusText(order.status) }}</h2>
          <p class="status-desc">
            <template v-if="order.status === 'pending'">
              请于 {{ order.date }} {{ order.timeSlot }} 准时就诊
            </template>
            <template v-else-if="order.status === 'completed'">
              就诊已完成，感谢您的信任
            </template>
            <template v-else>
              该预约已取消
            </template>
          </p>
        </div>
      </div>

      <div class="doctor-card">
        <div class="doctor-avatar">
          <span>{{ order.doctorName.charAt(0) }}</span>
        </div>
        <div class="doctor-info">
          <div class="doctor-name">
            <span class="name">{{ order.doctorName }}</span>
            <span class="title">{{ order.doctorTitle }}</span>
          </div>
          <p class="dept">{{ order.departmentName }}</p>
          <p class="location">📍 {{ order.location }}</p>
        </div>
      </div>

      <div class="info-card">
        <h3 class="card-title">预约信息</h3>
        <div class="info-row">
          <span class="label">就诊日期</span>
          <span class="value">{{ order.date }}</span>
        </div>
        <div class="info-row">
          <span class="label">就诊时段</span>
          <span class="value highlight">{{ order.timeSlot }}</span>
        </div>
        <div class="info-row">
          <span class="label">就诊人</span>
          <span class="value">{{ order.patientName }}</span>
        </div>
        <div class="info-row">
          <span class="label">挂号费用</span>
          <span class="value price">¥{{ order.price }}</span>
        </div>
        <div class="info-row">
          <span class="label">订单编号</span>
          <span class="value">{{ order.id }}</span>
        </div>
        <div class="info-row last">
          <span class="label">下单时间</span>
          <span class="value">{{ order.createTime }}</span>
        </div>
      </div>

      <div v-if="order.symptom" class="info-card">
        <h3 class="card-title">症状描述</h3>
        <p class="symptom-text">{{ order.symptom }}</p>
      </div>

      <div v-if="order.status === 'completed' && order.medicalRecord" class="info-card">
        <div class="record-header" @click="toggleRecord">
          <h3 class="card-title">就诊记录</h3>
          <span class="toggle-icon">{{ showRecord ? '收起' : '展开' }}</span>
        </div>
        <div v-show="showRecord" class="record-content">
          <div class="record-item">
            <span class="record-label">诊断结果</span>
            <span class="record-value">{{ order.medicalRecord.diagnosis }}</span>
          </div>
          <div class="record-item">
            <span class="record-label">处方用药</span>
            <span class="record-value">{{ order.medicalRecord.prescription }}</span>
          </div>
          <div class="record-item last">
            <span class="record-label">医生建议</span>
            <span class="record-value">{{ order.medicalRecord.advice }}</span>
          </div>
        </div>
      </div>

      <div class="actions" v-if="order.status === 'pending'">
        <button class="btn-cancel" @click="handleCancel">取消预约</button>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">📋</span>
      <p class="empty-text">订单不存在</p>
      <button class="back-btn" @click="router.back()">返回</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-detail-page {
  padding-bottom: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  padding: 12px;
}

.status-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 14px;
  margin-bottom: 12px;
  color: #fff;

  &.status-pending {
    background: linear-gradient(135deg, #2c7be5 0%, #4d91eb 100%);
  }

  &.status-completed {
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  }

  &.status-cancelled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  }

  .status-icon {
    font-size: 40px;
    margin-right: 16px;
  }

  .status-info {
    flex: 1;

    .status-title {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 4px 0;
    }

    .status-desc {
      font-size: 13px;
      opacity: 0.9;
      margin: 0;
    }
  }
}

.doctor-card {
  display: flex;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .doctor-avatar {
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

  .doctor-info {
    flex: 1;
    margin-left: 14px;

    .doctor-name {
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
      margin: 6px 0;
    }

    .location {
      font-size: 13px;
      color: #9ca3af;
      margin: 0;
    }
  }
}

.info-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  padding-left: 8px;
  border-left: 3px solid #2c7be5;
}

.info-row {
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
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.symptom-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  .card-title {
    margin-bottom: 0;
  }

  .toggle-icon {
    font-size: 13px;
    color: #2c7be5;
  }
}

.record-content {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.record-item {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #fafafa;

  &.last {
    border-bottom: none;
  }

  .record-label {
    width: 70px;
    font-size: 13px;
    color: #9ca3af;
    flex-shrink: 0;
  }

  .record-value {
    flex: 1;
    font-size: 13px;
    color: #4b5563;
    line-height: 1.6;
  }
}

.actions {
  padding: 20px 0;
}

.btn-cancel {
  width: 100%;
  padding: 14px;
  background-color: #fff;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  border-radius: 26px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    background-color: #fff1f0;
  }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;

  .empty-icon {
    font-size: 64px;
    display: block;
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 16px;
    color: #9ca3af;
    margin-bottom: 24px;
  }

  .back-btn {
    padding: 10px 32px;
    background-color: #2c7be5;
    color: #fff;
    border: none;
    border-radius: 22px;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
