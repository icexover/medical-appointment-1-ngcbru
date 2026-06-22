<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElDatePicker } from 'element-plus'
import NavBar from '@/components/NavBar.vue'

interface ExamItem {
  id: string
  name: string
  desc: string
  price: number
  duration: string
  prepare: string
  dept: string
  image: string
}

const examList: ExamItem[] = [
  { id: 'e001', name: '常规体检套餐A', desc: '血常规+胸片+心电图+B超', price: 298, duration: '约60分钟', prepare: '需空腹8小时', dept: '体检中心', image: '🩺' },
  { id: 'e002', name: '胸部CT平扫', desc: '肺部及纵隔检查', price: 380, duration: '约15分钟', prepare: '去除金属物品', dept: '影像科', image: '🫁' },
  { id: 'e003', name: '腹部B超', desc: '肝、胆、胰、脾、肾', price: 180, duration: '约20分钟', prepare: '需空腹', dept: '超声科', image: '🔬' },
  { id: 'e004', name: '心电图检查', desc: '常规12导联心电图', price: 60, duration: '约10分钟', prepare: '无特殊准备', dept: '心电图室', image: '❤️' },
  { id: 'e005', name: '脑部MRI', desc: '颅脑磁共振成像', price: 680, duration: '约30分钟', prepare: '去除金属，禁带手机', dept: '影像科', image: '🧠' },
  { id: 'e006', name: '心脏彩超', desc: '心脏结构与功能', price: 320, duration: '约25分钟', prepare: '无需特殊准备', dept: '超声科', image: '💓' },
  { id: 'e007', name: '骨密度检测', desc: '骨质疏松筛查', price: 150, duration: '约10分钟', prepare: '无需特殊准备', dept: '放射科', image: '🦴' },
  { id: 'e008', name: '胃肠镜检查', desc: '无痛胃镜+肠镜', price: 1280, duration: '约90分钟', prepare: '需提前预约并清肠', dept: '消化内科', image: '🩻' },
]

const selectedExam = ref<ExamItem | null>(null)
const selectedDate = ref('')
const booking = ref(false)

function selectExam(e: ExamItem) {
  selectedExam.value = e
}

function submitBooking() {
  if (!selectedExam.value) {
    ElMessage.warning('请先选择检查项目')
    return
  }
  if (!selectedDate.value) {
    ElMessage.warning('请选择检查日期')
    return
  }
  booking.value = true
  setTimeout(() => {
    booking.value = false
    ElMessage.success(`${selectedExam.value.name} 预约成功！请按通知时间前往${selectedExam.value.dept}检查`)
    selectedExam.value = null
    selectedDate.value = ''
  }, 1200)
}

function formatDate(d: Date | string) {
  return typeof d === 'string' ? d : d.toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="page">
    <NavBar title="检查预约" />

    <div class="content">
      <div class="banner">
        <div class="banner-icon">🩻</div>
        <div>
          <div class="banner-title">医学检查预约</div>
          <div class="banner-desc">在线预约，减少排队，报告可线上查看</div>
        </div>
      </div>

      <div class="section-title">可预约检查项目</div>

      <div class="list">
        <div
          v-for="e in examList"
          :key="e.id"
          class="card"
          :class="{ selected: selectedExam?.id === e.id }"
          @click="selectExam(e)"
        >
          <div class="card-icon">{{ e.image }}</div>
          <div class="card-body">
            <div class="name">{{ e.name }}</div>
            <div class="desc">{{ e.desc }}</div>
            <div class="meta">
              <span class="meta-item">{{ e.dept }}</span>
              <span class="meta-item">{{ e.duration }}</span>
            </div>
            <div class="prepare">📌 {{ e.prepare }}</div>
          </div>
          <div class="card-right">
            <div class="price">¥{{ e.price }}</div>
            <div v-if="selectedExam?.id === e.id" class="check">✓</div>
          </div>
        </div>
      </div>

      <div v-if="selectedExam" class="booking-card">
        <div class="booking-title">预约信息</div>
        <div class="booking-exam">
          <span class="label">检查项目</span>
          <span class="value">{{ selectedExam.name }}</span>
        </div>
        <div class="booking-exam">
          <span class="label">检查科室</span>
          <span class="value">{{ selectedExam.dept }}</span>
        </div>
        <div class="booking-exam date-row">
          <span class="label">预约日期</span>
          <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            :disabled-date="(d: Date) => d.getTime() < Date.now() - 86400000"
            class="date-picker"
          />
        </div>
        <el-button
          type="primary"
          block
          size="large"
          round
          :loading="booking"
          class="submit-btn"
          @click="submitBooking"
        >
          {{ booking ? '提交中...' : `确认预约 ¥${selectedExam.price}` }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 20px;
}
.content {
  padding: 12px;
}
.banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: linear-gradient(135deg, #2c7be5, #4d91eb);
  border-radius: 14px;
  color: #fff;
  margin-bottom: 18px;
  box-shadow: 0 4px 16px rgba(44,123,229,0.25);
  .banner-icon {
    font-size: 40px;
  }
  .banner-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .banner-desc {
    font-size: 13px;
    opacity: 0.9;
  }
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 10px;
  padding: 0 4px;
}
.list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 16px;
}
.card {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: #fff;
  border-radius: 12px;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.2s;
  &.selected {
    border-color: #2c7be5;
    background: #f0f6ff;
  }
}
.card-icon {
  font-size: 34px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 10px;
  flex-shrink: 0;
}
.card-body {
  flex: 1;
  min-width: 0;
  .name {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
  }
  .desc {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
  }
  .meta {
    display: flex;
    gap: 8px;
    margin-bottom: 6px;
    .meta-item {
      font-size: 11px;
      padding: 2px 8px;
      background: #eff6ff;
      color: #2c7be5;
      border-radius: 6px;
    }
  }
  .prepare {
    font-size: 11px;
    color: #92400e;
    background: #fffbeb;
    padding: 4px 8px;
    border-radius: 6px;
    display: inline-block;
  }
}
.card-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  .price {
    font-size: 17px;
    font-weight: 700;
    color: #ef4444;
  }
  .check {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #2c7be5;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: bold;
  }
}
.booking-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(44,123,229,0.1);
  border: 1px solid #e0eaff;
  margin-top: 16px;
  .booking-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c7be5;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f3f4f6;
  }
  .booking-exam {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    font-size: 14px;
    .label {
      color: #6b7280;
    }
    .value {
      color: #1f2937;
      font-weight: 500;
    }
    &.date-row {
      margin-bottom: 10px;
    }
  }
  .date-picker {
    width: 180px;
  }
  .submit-btn {
    margin-top: 16px;
    font-weight: 600;
  }
}
</style>
