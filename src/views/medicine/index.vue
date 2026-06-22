<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import NavBar from '@/components/NavBar.vue'

interface Medicine {
  id: string
  name: string
  spec: string
  manufacturer: string
  category: string
  price: number
  isOTC: boolean
  stock: number
  usage: string
}

const keyword = ref('')
const loading = ref(false)
const allMedicines: Medicine[] = [
  { id: 'm001', name: '阿莫西林胶囊', spec: '0.25g*24粒', manufacturer: '华北制药', category: '抗生素', price: 18.5, isOTC: false, stock: 200, usage: '口服，一次0.5g，一日3次' },
  { id: 'm002', name: '布洛芬缓释胶囊', spec: '0.3g*20粒', manufacturer: '中美史克', category: '解热镇痛', price: 22.0, isOTC: true, stock: 500, usage: '口服，一次1粒，一日2次' },
  { id: 'm003', name: '奥美拉唑肠溶胶囊', spec: '20mg*14粒', manufacturer: '阿斯利康', category: '消化系统', price: 45.8, isOTC: true, stock: 320, usage: '口服，一次20mg，一日1次，晨起吞服' },
  { id: 'm004', name: '复方氨酚烷胺片', spec: '12片/盒', manufacturer: '修正药业', category: '感冒用药', price: 12.5, isOTC: true, stock: 800, usage: '口服，一次1片，一日2次' },
  { id: 'm005', name: '硝苯地平控释片', spec: '30mg*7片', manufacturer: '拜耳', category: '心血管', price: 36.9, isOTC: false, stock: 150, usage: '口服，一次30mg，一日1次' },
  { id: 'm006', name: '蒙脱石散', spec: '3g*10袋', manufacturer: '博福-益普生', category: '消化系统', price: 28.0, isOTC: true, stock: 600, usage: '口服，一次1袋，一日3次' },
  { id: 'm007', name: '氯雷他定片', spec: '10mg*6片', manufacturer: '扬子江药业', category: '抗过敏', price: 19.9, isOTC: true, stock: 420, usage: '口服，一次10mg，一日1次' },
  { id: 'm008', name: '维生素C片', spec: '100mg*100片', manufacturer: '东北制药', category: '维生素', price: 5.5, isOTC: true, stock: 1000, usage: '口服，一次1-2片，一日3次' },
]

const medicines = ref<Medicine[]>([...allMedicines])

const filtered = computed(() => {
  if (!keyword.value.trim()) return medicines.value
  const k = keyword.value.trim().toLowerCase()
  return medicines.value.filter(
    (m) => m.name.toLowerCase().includes(k) || m.category.includes(k) || m.manufacturer.includes(k)
  )
})

function onSearch() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success(`找到 ${filtered.value.length} 条相关药品`)
  }, 300)
}

function viewDetail(m: Medicine) {
  ElMessage.info(`查看 ${m.name} 详情 - ${m.usage}`)
}
</script>

<template>
  <div class="page">
    <NavBar title="药品查询" />

    <div class="content">
      <div class="search-bar">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜索药品名称、类别、厂家..."
          class="search-input"
          @keyup.enter="onSearch"
        />
        <button class="search-btn" @click="onSearch">搜索</button>
      </div>

      <div class="stats">
        <div class="stat-item">
          <span class="num">{{ medicines.length }}</span>
          <span class="label">药品总数</span>
        </div>
        <div class="stat-item">
          <span class="num otc">{{ medicines.filter(m => m.isOTC).length }}</span>
          <span class="label">非处方药</span>
        </div>
        <div class="stat-item">
          <span class="num rx">{{ medicines.filter(m => !m.isOTC).length }}</span>
          <span class="label">处方药</span>
        </div>
      </div>

      <div v-loading="loading" class="list">
        <div
          v-for="m in filtered"
          :key="m.id"
          class="card"
          @click="viewDetail(m)"
        >
          <div class="card-head">
            <span class="name">{{ m.name }}</span>
            <span class="tag" :class="m.isOTC ? 'otc' : 'rx'">
              {{ m.isOTC ? 'OTC' : '处方' }}
            </span>
          </div>
          <div class="spec">{{ m.spec }}</div>
          <div class="info-row">
            <span class="info">{{ m.category }}</span>
            <span class="info">{{ m.manufacturer }}</span>
          </div>
          <div class="foot">
            <span class="price">¥{{ m.price.toFixed(2) }}</span>
            <span class="stock" :class="m.stock < 200 ? 'low' : ''">
              库存：{{ m.stock }}盒
            </span>
          </div>
        </div>

        <div v-if="filtered.length === 0 && !loading" class="empty">
          <p>未找到相关药品</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background: #f5f7fa;
  min-height: 100vh;
}
.content {
  padding: 12px;
}
.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  .search-input {
    flex: 1;
    padding: 11px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    background: #fff;
    &:focus {
      border-color: #2c7be5;
    }
  }
  .search-btn {
    padding: 0 18px;
    background: #2c7be5;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
}
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 14px;
  .stat-item {
    background: #fff;
    padding: 14px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    .num {
      display: block;
      font-size: 22px;
      font-weight: 700;
      color: #1f2937;
      &.otc { color: #059669; }
      &.rx { color: #d97706; }
    }
    .label {
      font-size: 12px;
      color: #9ca3af;
    }
  }
}
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .name {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
    .tag {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 8px;
      &.otc { background: #ecfdf5; color: #059669; }
      &.rx { background: #fef3c7; color: #d97706; }
    }
  }
  .spec {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  .info-row {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    .info {
      font-size: 12px;
      padding: 3px 8px;
      background: #f3f4f6;
      color: #4b5563;
      border-radius: 6px;
    }
  }
  .foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px dashed #f3f4f6;
    padding-top: 10px;
    .price {
      font-size: 18px;
      font-weight: 700;
      color: #ef4444;
    }
    .stock {
      font-size: 12px;
      color: #059669;
      &.low { color: #dc2626; }
    }
  }
}
.empty {
  text-align: center;
  padding: 60px 0;
  color: #9ca3af;
}
</style>
