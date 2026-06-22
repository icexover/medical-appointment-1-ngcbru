<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import NavBar from '@/components/NavBar.vue'
import { useUserStore } from '@/stores/user'
import type { Patient } from '@/types'

const router = useRouter()
const userStore = useUserStore()

const showForm = ref(false)
const editingPatient = ref<Partial<Patient> | null>(null)

const formData = ref({
  name: '',
  idCard: '',
  phone: '',
  gender: '男' as '男' | '女',
  age: 30,
  isDefault: false,
})

function handleAdd() {
  editingPatient.value = null
  formData.value = {
    name: '',
    idCard: '',
    phone: '',
    gender: '男',
    age: 30,
    isDefault: false,
  }
  showForm.value = true
}

function handleEdit(patient: Patient) {
  editingPatient.value = patient
  formData.value = { ...patient }
  showForm.value = true
}

function handleSetDefault(id: string) {
  userStore.setDefaultPatient(id)
  ElMessage.success('已设为默认就诊人')
}

async function handleDelete(id: string) {
  try {
    await ElMessageBox.confirm('确定删除该就诊人吗？', '提示', {
      type: 'warning',
    })
    userStore.removePatient(id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

function handleSave() {
  if (!formData.value.name.trim()) {
    ElMessage.warning('请输入姓名')
    return
  }
  if (!formData.value.idCard.trim()) {
    ElMessage.warning('请输入身份证号')
    return
  }
  if (!formData.value.phone.trim()) {
    ElMessage.warning('请输入手机号')
    return
  }

  if (editingPatient.value?.id) {
    userStore.updatePatient(editingPatient.value.id, formData.value)
    ElMessage.success('修改成功')
  } else {
    userStore.addPatient(formData.value as Omit<Patient, 'id'>)
    ElMessage.success('添加成功')
  }

  showForm.value = false
}

function handleCancel() {
  showForm.value = false
}
</script>

<template>
  <div class="patients-page">
    <NavBar title="就诊人管理">
      <template #right>
        <span class="add-btn" @click="handleAdd">+ 添加</span>
      </template>
    </NavBar>

    <div class="patient-list">
      <div
        v-for="patient in userStore.patients"
        :key="patient.id"
        class="patient-card"
      >
        <div class="patient-header">
          <div class="patient-info">
            <span class="patient-name">{{ patient.name }}</span>
            <span class="patient-gender">{{ patient.gender }}</span>
            <span class="patient-age">{{ patient.age }}岁</span>
            <span v-if="patient.isDefault" class="default-tag">默认</span>
          </div>
          <div class="patient-actions">
            <span class="action-btn edit" @click="handleEdit(patient)">编辑</span>
            <span class="action-btn delete" @click="handleDelete(patient.id)">删除</span>
          </div>
        </div>
        <div class="patient-detail">
          <p class="detail-row">
            <span class="label">身份证：</span>
            <span class="value">{{ patient.idCard }}</span>
          </p>
          <p class="detail-row">
            <span class="label">手机号：</span>
            <span class="value">{{ patient.phone }}</span>
          </p>
        </div>
        <div class="patient-footer" v-if="!patient.isDefault">
          <span class="set-default" @click="handleSetDefault(patient.id)">设为默认</span>
        </div>
      </div>

      <div v-if="userStore.patients.length === 0" class="empty-state">
        <span class="empty-icon">👥</span>
        <p class="empty-text">暂无就诊人信息</p>
        <button class="add-patient-btn" @click="handleAdd">+ 添加就诊人</button>
      </div>
    </div>

    <div v-if="showForm" class="form-modal">
      <div class="form-container">
        <div class="form-header">
          <h3>{{ editingPatient ? '编辑就诊人' : '添加就诊人' }}</h3>
          <span class="close-btn" @click="handleCancel">✕</span>
        </div>
        <div class="form-body">
          <div class="form-item">
            <label class="form-label">姓名 <span class="required">*</span></label>
            <input
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="请输入姓名"
            />
          </div>
          <div class="form-item">
            <label class="form-label">性别</label>
            <div class="gender-options">
              <span
                class="gender-option"
                :class="{ active: formData.gender === '男' }"
                @click="formData.gender = '男'"
              >
                男
              </span>
              <span
                class="gender-option"
                :class="{ active: formData.gender === '女' }"
                @click="formData.gender = '女'"
              >
                女
              </span>
            </div>
          </div>
          <div class="form-item">
            <label class="form-label">年龄</label>
            <input
              v-model.number="formData.age"
              type="number"
              class="form-input"
              placeholder="请输入年龄"
            />
          </div>
          <div class="form-item">
            <label class="form-label">身份证号 <span class="required">*</span></label>
            <input
              v-model="formData.idCard"
              type="text"
              class="form-input"
              placeholder="请输入身份证号"
            />
          </div>
          <div class="form-item">
            <label class="form-label">手机号 <span class="required">*</span></label>
            <input
              v-model="formData.phone"
              type="tel"
              class="form-input"
              placeholder="请输入手机号"
            />
          </div>
        </div>
        <div class="form-footer">
          <button class="btn-cancel" @click="handleCancel">取消</button>
          <button class="btn-confirm" @click="handleSave">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patients-page {
  padding-bottom: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.add-btn {
  font-size: 14px;
  color: #2c7be5;
  cursor: pointer;
}

.patient-list {
  padding: 12px;
}

.patient-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.patient-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.patient-info {
  display: flex;
  align-items: center;

  .patient-name {
    font-size: 17px;
    font-weight: 600;
    color: #1f2937;
    margin-right: 8px;
  }

  .patient-gender,
  .patient-age {
    font-size: 12px;
    color: #6b7280;
    margin-right: 6px;
  }

  .default-tag {
    font-size: 11px;
    color: #2c7be5;
    background-color: #e8f0fe;
    padding: 2px 8px;
    border-radius: 8px;
  }
}

.patient-actions {
  display: flex;
  gap: 12px;

  .action-btn {
    font-size: 13px;
    cursor: pointer;

    &.edit {
      color: #2c7be5;
    }

    &.delete {
      color: #ff4d4f;
    }
  }
}

.patient-detail {
  padding: 10px 0;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;

  .detail-row {
    font-size: 13px;
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      color: #9ca3af;
    }

    .value {
      color: #4b5563;
    }
  }
}

.patient-footer {
  padding-top: 10px;
  text-align: right;

  .set-default {
    font-size: 13px;
    color: #2c7be5;
    cursor: pointer;
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background-color: #fff;
  border-radius: 12px;

  .empty-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 14px;
    color: #9ca3af;
    margin-bottom: 20px;
  }

  .add-patient-btn {
    padding: 10px 24px;
    background-color: #2c7be5;
    color: #fff;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
  }
}

.form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.form-container {
  width: 100%;
  max-width: 360px;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;

  h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: #1f2937;
  }

  .close-btn {
    font-size: 18px;
    color: #9ca3af;
    cursor: pointer;
  }
}

.form-body {
  padding: 20px;
}

.form-item {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;

  .required {
    color: #ff4d4f;
  }
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2c7be5;
  }
}

.gender-options {
  display: flex;
  gap: 10px;
}

.gender-option {
  flex: 1;
  text-align: center;
  padding: 10px;
  background-color: #f9fafb;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;

  &.active {
    border-color: #2c7be5;
    background-color: #e8f0fe;
    color: #2c7be5;
  }
}

.form-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #f5f5f5;

  button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 24px;
    font-size: 15px;
    cursor: pointer;
  }

  .btn-cancel {
    background-color: #f5f7fa;
    color: #6b7280;
  }

  .btn-confirm {
    background-color: #2c7be5;
    color: #fff;
  }
}
</style>
