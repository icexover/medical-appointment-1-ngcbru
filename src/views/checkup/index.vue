<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElCheckbox } from 'element-plus'
import NavBar from '@/components/NavBar.vue'

interface CheckupPackage {
  id: string
  name: string
  tag?: string
  price: number
  originalPrice: number
  suitFor: string
  duration: string
  items: string[]
  image: string
  hot?: boolean
}

const packages: CheckupPackage[] = [
  {
    id: 'p001', name: '青年基础体检套餐', tag: '热销', price: 399, originalPrice: 580,
    suitFor: '18-35岁青年人群', duration: '约90分钟',
    items: ['一般检查', '血常规', '尿常规', '肝功能', '肾功能', '血脂', '血糖', '心电图', '胸片', '腹部B超'],
    image: '🧑‍⚕️', hot: true,
  },
  {
    id: 'p002', name: '中年精英体检套餐', tag: '推荐', price: 899, originalPrice: 1280,
    suitFor: '35-50岁职场人士', duration: '约150分钟',
    items: ['基础套餐全部项目', '甲状腺功能', '肿瘤标志物(5项)', '心脏彩超', '颈动脉彩超', '骨密度', '经颅多普勒', '胸部CT'],
    image: '👨‍💼', hot: true,
  },
  {
    id: 'p003', name: '中老年全面体检套餐', tag: '关爱', price: 1599, originalPrice: 2280,
    suitFor: '50岁以上中老年人', duration: '约180分钟',
    items: ['精英套餐全部项目', '头部MRI', '冠脉CTA', '全身动脉硬化', '胃肠镜', '肿瘤标志物(12项)', '糖化血红蛋白'],
    image: '👴',
  },
  {
    id: 'p004', name: '女性专属体检套餐', tag: '关爱', price: 699, originalPrice: 980,
    suitFor: '18岁以上女性', duration: '约120分钟',
    items: ['基础套餐全部项目', '妇科常规', 'TCT液基细胞学', 'HPV检测', '乳腺彩超', '子宫附件彩超'],
    image: '👩',
  },
  {
    id: 'p005', name: '入职体检套餐', price: 199, originalPrice: 280,
    suitFor: '入职/入学体检', duration: '约60分钟',
    items: ['一般检查', '内外科', '血常规', '尿常规', '肝功能(2项)', '胸片', '心电图'],
    image: '📋',
  },
  {
    id: 'p006', name: '婚前孕检套餐', price: 499, originalPrice: 720,
    suitFor: '婚前/孕前检查', duration: '约90分钟',
    items: ['基础检查', '生殖系统检查', '传染病筛查', '优生四项', '血型', '染色体风险评估'],
    image: '💑',
  },
]

const selectedId = ref('')
const selectedDate = ref('')
const agree = ref(false)
const booking = ref(false)

const selected = computed(() => packages.find(p => p.id === selectedId.value))

function submit() {
  if (!selected.value) {
    ElMessage.warning('请选择体检套餐')
    return
  }
  if (!selectedDate.value) {
    ElMessage.warning('请选择体检日期')
    return
  }
  if (!agree.value) {
    ElMessage.warning('请阅读并同意体检须知')
    return
  }
  booking.value = true
  setTimeout(() => {
    booking.value = false
    ElMessage.success(`预约成功！${selected.value.name} 将于 ${selectedDate.value} 进行，请空腹前往`)
  }, 1200)
}
</script>

<template>
  <div class="page">
    <NavBar title="体检预约" />

    <div class="content">
      <div class="banner">
        <div class="banner-icon">📑</div>
        <div>
          <div class="banner-title">专业体检 · 守护健康</div>
          <div class="banner-desc">一站式体检预约，报告线上查看，专家解读</div>
        </div>
      </div>

      <div class="section-title">热门套餐</div>

      <div class="pkg-list">
        <div
          v-for="p in packages"
          :key="p.id"
          class="pkg-card"
          :class="{ selected: selectedId === p.id, hot: p.hot }"
          @click="selectedId = p.id"
        >
          <div v-if="p.tag" class="pkg-tag">{{ p.tag }}</div>
          <div class="pkg-icon">{{ p.image }}</div>
          <div class="pkg-name">{{ p.name }}</div>
          <div class="pkg-suit">{{ p.suitFor }}</div>
          <div class="pkg-meta">
            <span>⏱ {{ p.duration }}</span>
            <span>📋 {{ p.items.length }}项</span>
          </div>
          <div class="pkg-items">
            <span v-for="(it, i) in p.items.slice(0, 4)" :key="i" class="item">{{ it }}</span>
            <span v-if="p.items.length > 4" class="item more">+{{ p.items.length - 4 }}项</span>
          </div>
          <div class="pkg-price-row">
            <span class="price">¥{{ p.price }}</span>
            <span class="original">¥{{ p.originalPrice }}</span>
            <span v-if="selectedId === p.id" class="check">✓</span>
          </div>
        </div>
      </div>

      <div v-if="selected" class="form-card">
        <div class="form-title">预约信息</div>
        <div class="form-group">
          <label>体检日期</label>
          <input
            v-model="selectedDate"
            type="date"
            :min="new Date(Date.now() + 86400000).toISOString().slice(0,10)"
            class="input"
          />
        </div>
        <div class="form-group">
          <label>体检地点</label>
          <div class="value">门诊楼5层 体检中心</div>
        </div>
        <div class="form-group">
          <label>到检时间</label>
          <div class="value">07:30 - 09:00（请务必空腹）</div>
        </div>
        <div class="agreement">
          <el-checkbox v-model="agree">
            我已阅读并同意<a class="link">《体检须知》</a>和<a class="link">《隐私协议》</a>
          </el-checkbox>
        </div>

        <el-button
          type="primary"
          size="large"
          block
          round
          :loading="booking"
          class="submit-btn"
          @click="submit"
        >
          {{ booking ? '预约中...' : `立即预约 ¥${selected.price}` }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 30px;
}
.content {
  padding: 12px;
}
.banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: linear-gradient(135deg, #059669, #10b981);
  border-radius: 14px;
  color: #fff;
  margin-bottom: 18px;
  box-shadow: 0 4px 16px rgba(5,150,105,0.25);
  .banner-icon { font-size: 40px; }
  .banner-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
  .banner-desc { font-size: 13px; opacity: 0.9; }
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 4px 10px;
}
.pkg-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
}
.pkg-card {
  position: relative;
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.2s;
  &.selected {
    border-color: #059669;
    background: #ecfdf5;
  }
  .pkg-tag {
    position: absolute;
    top: 0;
    right: 16px;
    background: linear-gradient(135deg, #ef4444, #f97316);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 0 0 8px 8px;
  }
}
.pkg-icon {
  font-size: 34px;
  margin-bottom: 6px;
}
.pkg-name {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}
.pkg-suit {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}
.pkg-meta {
  display: flex;
  gap: 14px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #4b5563;
}
.pkg-items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
  .item {
    font-size: 11px;
    padding: 3px 8px;
    background: #f3f4f6;
    color: #4b5563;
    border-radius: 6px;
    &.more {
      background: #eff6ff;
      color: #2c7be5;
    }
  }
}
.pkg-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px dashed #e5e7eb;
  padding-top: 12px;
  .price {
    font-size: 20px;
    font-weight: 700;
    color: #ef4444;
  }
  .original {
    font-size: 12px;
    color: #9ca3af;
    text-decoration: line-through;
  }
  .check {
    margin-left: auto;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #059669;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: bold;
  }
}
.form-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(5,150,105,0.1);
  border: 1px solid #d1fae5;
  .form-title {
    font-size: 16px;
    font-weight: 600;
    color: #059669;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f3f4f6;
  }
  .form-group {
    margin-bottom: 14px;
    label {
      display: block;
      font-size: 13px;
      color: #374151;
      margin-bottom: 6px;
      font-weight: 500;
    }
    .input {
      width: 100%;
      padding: 11px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      background: #fff;
      &:focus { border-color: #059669; }
    }
    .value {
      padding: 11px 14px;
      background: #f9fafb;
      border-radius: 10px;
      font-size: 13px;
      color: #374151;
    }
  }
  .agreement {
    margin: 14px 0 18px;
    font-size: 12px;
    color: #6b7280;
    .link {
      color: #059669;
      margin: 0 2px;
    }
  }
  .submit-btn { font-weight: 600; background: #059669; border-color: #059669; }
}
</style>
