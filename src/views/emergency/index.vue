<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import NavBar from '@/components/NavBar.vue'

interface TriageInfo {
  level: '1' | '2' | '3' | '4'
  name: string
  color: string
  desc: string
  waitTime: string
}

const triageLevels: TriageInfo[] = [
  { level: '1', name: '濒危', color: '#dc2626', desc: '心跳骤停、严重创伤等生命体征不稳定', waitTime: '立即抢救' },
  { level: '2', name: '危重', color: '#ea580c', desc: '急性心梗、脑卒中、严重呼吸困难', waitTime: '< 10分钟' },
  { level: '3', name: '急症', color: '#d97706', desc: '高热、剧烈腹痛、急性出血', waitTime: '< 30分钟' },
  { level: '4', name: '非急症', color: '#059669', desc: '轻症、慢性疾病急性发作', waitTime: '< 2小时' },
]

const selectedLevel = ref<string>('')
const symptom = ref('')
const contactPhone = ref('')
const submitting = ref(false)

function selectLevel(l: string) {
  selectedLevel.value = l
}

async function submitEmergency() {
  if (!selectedLevel.value) {
    ElMessage.warning('请选择病情分级')
    return
  }
  if (!symptom.value.trim()) {
    ElMessage.warning('请简要描述症状')
    return
  }
  if (!/^1\d{10}$/.test(contactPhone.value)) {
    ElMessage.warning('请填写正确的联系电话')
    return
  }

  try {
    await ElMessageBox.confirm(
      `您选择的是 ${triageLevels.find(t => t.level === selectedLevel.value)?.name} 患者通道，将优先安排就诊。是否确认？`,
      '急诊登记确认',
      { type: 'warning', confirmButtonText: '确认登记', cancelButtonText: '取消' }
    )
  } catch {
    return
  }

  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    ElMessage.success({
      message: '急诊登记成功！请立即前往医院急诊楼1层分诊台，号源已预留',
      duration: 4500,
    })
    setTimeout(() => {
      selectedLevel.value = ''
      symptom.value = ''
      contactPhone.value = ''
    }, 2000)
  }, 1200)
}
</script>

<template>
  <div class="page">
    <NavBar title="急诊就医" />

    <div class="content">
      <div class="alert-banner">
        <span class="alert-icon">🚨</span>
        <div>
          <div class="alert-title">紧急情况请立即拨打 120</div>
          <div class="alert-desc">本平台仅做急诊预检登记，危急重症请直接到院或拨打急救电话</div>
        </div>
      </div>

      <div class="card info-card">
        <div class="info-title">🏥 急诊服务信息</div>
        <div class="info-row">
          <span class="info-label">急诊位置</span>
          <span class="info-value">医院急诊楼1层（北门）</span>
        </div>
        <div class="info-row">
          <span class="info-label">服务时间</span>
          <span class="info-value">7×24小时 全年无休</span>
        </div>
        <div class="info-row">
          <span class="info-label">急诊电话</span>
          <span class="info-value tel">010-XXXXXXXX-8100</span>
        </div>
        <div class="info-row">
          <span class="info-label">当前等候</span>
          <span class="info-value wait">约 45 分钟（非急症）</span>
        </div>
      </div>

      <div class="section-title">病情分级（请选择）</div>
      <div class="triage-grid">
        <div
          v-for="t in triageLevels"
          :key="t.level"
          class="triage-card"
          :class="{ selected: selectedLevel === t.level }"
          :style="{ borderColor: selectedLevel === t.level ? t.color : 'transparent' }"
          @click="selectLevel(t.level)"
        >
          <div class="level-badge" :style="{ background: t.color }">{{ t.level }}级</div>
          <div class="level-name" :style="{ color: t.color }">{{ t.name }}</div>
          <div class="level-desc">{{ t.desc }}</div>
          <div class="level-wait">⏱ {{ t.waitTime }}</div>
        </div>
      </div>

      <div class="card form-card">
        <div class="form-title">急诊预检登记</div>

        <div class="form-group">
          <label>症状描述 <span class="required">*</span></label>
          <textarea
            v-model="symptom"
            rows="4"
            placeholder="请简要描述您的主要症状、持续时间、有无基础疾病等..."
            class="textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label>联系电话 <span class="required">*</span></label>
          <input
            v-model="contactPhone"
            type="tel"
            placeholder="请输入11位手机号"
            maxlength="11"
            class="input"
          />
        </div>

        <el-button
          type="danger"
          size="large"
          block
          round
          :loading="submitting"
          class="submit-btn"
          @click="submitEmergency"
        >
          {{ submitting ? '提交中...' : '提交急诊预检登记' }}
        </el-button>

        <p class="tips">
          ⚠️ 提交后系统将为您预留急诊号源，请在 30 分钟内到达医院急诊分诊台
        </p>
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
.alert-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  border-radius: 12px;
  margin-bottom: 14px;
  .alert-icon {
    font-size: 32px;
    flex-shrink: 0;
  }
  .alert-title {
    font-size: 16px;
    font-weight: 700;
    color: #b91c1c;
    margin-bottom: 4px;
  }
  .alert-desc {
    font-size: 12px;
    color: #7f1d1d;
    line-height: 1.5;
  }
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 14px;
}
.info-card {
  .info-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f3f4f6;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 13px;
    .info-label { color: #6b7280; }
    .info-value { color: #1f2937; font-weight: 500; }
    .tel { color: #2c7be5; }
    .wait { color: #d97706; }
  }
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 6px 4px 10px;
}
.triage-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}
.triage-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px 12px;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.2s;
  &.selected {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.1);
  }
  .level-badge {
    display: inline-block;
    padding: 2px 10px;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  .level-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .level-desc {
    font-size: 11px;
    color: #6b7280;
    line-height: 1.4;
    margin-bottom: 8px;
    min-height: 44px;
  }
  .level-wait {
    font-size: 11px;
    color: #374151;
    font-weight: 500;
  }
}
.form-card {
  .form-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
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
      .required { color: #ef4444; }
    }
    .input, .textarea {
      width: 100%;
      padding: 11px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      font-family: inherit;
      resize: vertical;
      background: #fff;
      &:focus { border-color: #2c7be5; }
    }
  }
  .submit-btn { font-weight: 600; }
  .tips {
    margin-top: 12px;
    font-size: 11px;
    color: #b45309;
    background: #fffbeb;
    padding: 10px 12px;
    border-radius: 8px;
    line-height: 1.5;
  }
}
</style>
