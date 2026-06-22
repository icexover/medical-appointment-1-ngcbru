<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElCheckbox } from 'element-plus'
import NavBar from '@/components/NavBar.vue'

interface BillItem {
  id: string
  name: string
  type: string
  date: string
  doctor: string
  dept: string
  amount: number
  status: '未缴' | '已缴'
  items: { desc: string; qty: number; price: number }[]
}

const allBills: BillItem[] = [
  {
    id: 'b001', name: '门诊就诊费', type: '诊疗费', date: '2026-06-22',
    doctor: '王建国', dept: '心血管内科', amount: 156.8, status: '未缴',
    items: [
      { desc: '主任医师挂号费', qty: 1, price: 100 },
      { desc: '门诊诊疗费', qty: 1, price: 30 },
      { desc: '一次性材料费', qty: 2, price: 13.4 },
    ],
  },
  {
    id: 'b002', name: '检验项目', type: '检验费', date: '2026-06-22',
    doctor: '李秀英', dept: '普外科', amount: 288.5, status: '未缴',
    items: [
      { desc: '血常规', qty: 1, price: 35 },
      { desc: '肝功能', qty: 1, price: 120 },
      { desc: '血脂四项', qty: 1, price: 85 },
      { desc: '血糖', qty: 1, price: 48.5 },
    ],
  },
  {
    id: 'b003', name: '检查项目', type: '检查费', date: '2026-06-20',
    doctor: '刘芳', dept: '心血管内科', amount: 380, status: '未缴',
    items: [
      { desc: '胸部CT平扫', qty: 1, price: 380 },
    ],
  },
  {
    id: 'b004', name: '药品处方', type: '药费', date: '2026-06-18',
    doctor: '张伟', dept: '呼吸内科', amount: 145.2, status: '已缴',
    items: [
      { desc: '阿莫西林胶囊', qty: 2, price: 18.5 },
      { desc: '布洛芬缓释胶囊', qty: 1, price: 22 },
      { desc: '复方甘草片', qty: 3, price: 10.9 },
      { desc: '雾化吸入治疗', qty: 3, price: 25 },
    ],
  },
]

const bills = ref<BillItem[]>([...allBills])
const tab = ref<'unpaid' | 'paid'>('unpaid')
const selectedIds = ref<string[]>([])
const paying = ref(false)

const displayBills = computed(() =>
  tab.value === 'unpaid' ? bills.value.filter(b => b.status === '未缴') : bills.value.filter(b => b.status === '已缴')
)

const toggleAll = computed({
  get: () => displayBills.value.length > 0 && displayBills.value.every(b => selectedIds.value.includes(b.id)),
  set: (v: boolean) => {
    if (v) selectedIds.value = displayBills.value.map(b => b.id)
    else selectedIds.value = selectedIds.value.filter(id => !displayBills.value.find(b => b.id === id))
  }
})

const totalAmount = computed(() =>
  displayBills.value
    .filter(b => selectedIds.value.includes(b.id))
    .reduce((sum, b) => sum + b.amount, 0)
    .toFixed(2)
)

const selectedCount = computed(() => selectedIds.value.filter(id => displayBills.value.find(b => b.id === id)).length)

function toggle(id: string) {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

function expand(b: BillItem & { expanded?: boolean }) {
  b.expanded = !b.expanded
}

async function pay() {
  if (selectedCount.value === 0) {
    ElMessage.warning('请先选择需要缴费的项目')
    return
  }
  try {
    paying.value = true
    await new Promise(r => setTimeout(r, 1800))
    bills.value.forEach(b => {
      if (selectedIds.value.includes(b.id)) b.status = '已缴'
    })
    ElMessage.success(`成功缴费 ${selectedCount.value} 笔，共 ¥${totalAmount}`)
    selectedIds.value = []
  } finally {
    paying.value = false
  }
}
</script>

<template>
  <div class="page">
    <NavBar title="门诊缴费" />

    <div class="content">
      <div class="tabs">
        <div
          class="tab-item"
          :class="{ active: tab === 'unpaid' }"
          @click="tab = 'unpaid'"
        >
          待缴费
          <span v-if="bills.filter(b => b.status === '未缴').length" class="badge">
            {{ bills.filter(b => b.status === '未缴').length }}
          </span>
        </div>
        <div
          class="tab-item"
          :class="{ active: tab === 'paid' }"
          @click="tab = 'paid'"
        >
          已缴费
        </div>
      </div>

      <div v-if="tab === 'unpaid'" class="select-bar">
        <el-checkbox v-model="toggleAll">全选本页</el-checkbox>
        <span class="select-info">已选 {{ selectedCount }} 项</span>
      </div>

      <div class="list">
        <div v-for="b in displayBills" :key="b.id" class="bill-card">
          <div v-if="tab === 'unpaid'" class="check-col">
            <el-checkbox
              :model-value="selectedIds.includes(b.id)"
              @change="toggle(b.id)"
            />
          </div>
          <div class="card-main" @click="expand(b as any)">
            <div class="card-head">
              <span class="name">{{ b.name }}</span>
              <span class="tag" :class="b.status === '未缴' ? 'unpaid' : 'paid'">{{ b.status }}</span>
            </div>
            <div class="meta-row">
              <span class="meta">{{ b.dept }}</span>
              <span class="meta">{{ b.doctor }}</span>
              <span class="meta">{{ b.date }}</span>
            </div>
            <div class="card-foot">
              <span class="count">共 {{ b.items.length }} 项明细</span>
              <span class="amount">¥{{ b.amount.toFixed(2) }}</span>
            </div>

            <div v-if="(b as any).expanded" class="details">
              <div class="detail-title">费用明细</div>
              <div class="detail-row head">
                <span>项目</span><span>数量</span><span>单价</span><span>小计</span>
              </div>
              <div v-for="(it, i) in b.items" :key="i" class="detail-row">
                <span>{{ it.desc }}</span>
                <span>x{{ it.qty }}</span>
                <span>¥{{ it.price }}</span>
                <span class="sub">¥{{ (it.qty * it.price).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="displayBills.length === 0" class="empty">
          <el-empty :description="tab === 'unpaid' ? '暂无待缴费项目' : '暂无已缴费记录'" />
        </div>
      </div>
    </div>

    <div v-if="tab === 'unpaid'" class="bottom-bar">
      <div class="total">
        <span class="label">合计</span>
        <span class="amount">¥{{ totalAmount }}</span>
      </div>
      <el-button
        type="primary"
        size="large"
        round
        :loading="paying"
        :disabled="selectedCount === 0"
        class="pay-btn"
        @click="pay"
      >
        {{ paying ? '缴费中...' : `去缴费 (${selectedCount})` }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 100px;
}
.content {
  padding: 12px;
}
.tabs {
  display: flex;
  background: #fff;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  gap: 4px;
  .tab-item {
    flex: 1;
    position: relative;
    padding: 11px;
    text-align: center;
    font-size: 14px;
    color: #6b7280;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    &.active {
      background: #2c7be5;
      color: #fff;
      font-weight: 600;
    }
    .badge {
      position: absolute;
      top: 4px;
      margin-left: 6px;
      background: #ef4444;
      color: #fff;
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 10px;
      font-weight: 500;
    }
  }
}
.select-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  .select-info {
    color: #6b7280;
  }
}
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bill-card {
  display: flex;
  gap: 8px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
  .check-col {
    padding: 16px 0 16px 14px;
    display: flex;
    align-items: flex-start;
  }
  .card-main {
    flex: 1;
    padding: 14px 16px 14px 0;
    cursor: pointer;
  }
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  .name {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }
  .tag {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 10px;
    font-weight: 500;
    &.unpaid { background: #fef3c7; color: #d97706; }
    &.paid { background: #ecfdf5; color: #059669; }
  }
}
.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
  .meta {
    font-size: 12px;
    color: #6b7280;
    padding: 2px 8px;
    background: #f3f4f6;
    border-radius: 6px;
  }
}
.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed #f3f4f6;
  padding-top: 10px;
  .count { font-size: 12px; color: #9ca3af; }
  .amount {
    font-size: 19px;
    font-weight: 700;
    color: #ef4444;
  }
}
.details {
  margin-top: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  .detail-title {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }
  .detail-row {
    display: grid;
    grid-template-columns: 2fr 0.6fr 0.8fr 0.8fr;
    gap: 4px;
    padding: 6px 4px;
    font-size: 12px;
    color: #4b5563;
    border-bottom: 1px solid #eee;
    &.head {
      color: #9ca3af;
      font-weight: 500;
      background: transparent;
    }
    &:last-child { border-bottom: none; }
    .sub { color: #ef4444; font-weight: 500; }
  }
}
.empty {
  padding: 60px 0;
  background: #fff;
  border-radius: 12px;
}
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 414px;
  background: #fff;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.08);
  z-index: 99;
  @media (min-width: 768px) { max-width: 768px; }
  .total {
    display: flex;
    align-items: baseline;
    gap: 6px;
    .label { font-size: 13px; color: #6b7280; }
    .amount {
      font-size: 22px;
      font-weight: 700;
      color: #ef4444;
    }
  }
  .pay-btn {
    min-width: 140px;
    font-weight: 600;
  }
}
</style>
