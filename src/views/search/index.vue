<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { searchAll } from '@/api/department'
import type { SearchResult } from '@/types'

const router = useRouter()
const keyword = ref('')
const results = ref<SearchResult[]>([])
const searching = ref(false)
const hasSearched = ref(false)

const hotKeywords = ['高血压', '糖尿病', '感冒', '心脏病', '皮肤病', '儿科']
const historyKeywords = ref<string[]>(['感冒发烧', '心血管内科'])

const showHistory = computed(() => !hasSearched.value && historyKeywords.value.length > 0)

async function handleSearch() {
  if (!keyword.value.trim()) return

  hasSearched.value = true
  searching.value = true

  try {
    results.value = await searchAll(keyword.value)

    if (keyword.value && !historyKeywords.value.includes(keyword.value)) {
      historyKeywords.value.unshift(keyword.value)
      if (historyKeywords.value.length > 10) {
        historyKeywords.value.pop()
      }
    }
  } finally {
    searching.value = false
  }
}

function clearHistory() {
  historyKeywords.value = []
}

function selectKeyword(kw: string) {
  keyword.value = kw
  handleSearch()
}

function handleResultClick(item: SearchResult) {
  if (item.type === 'department') {
    router.push(`/department/${item.id}`)
  } else if (item.type === 'doctor') {
    router.push(`/doctor/${item.id}`)
  } else {
    // 疾病搜索，跳转到对应科室
    router.push('/appointment')
  }
}

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    department: '科室',
    doctor: '医生',
    disease: '疾病',
  }
  return map[type] || ''
}

function getTypeColor(type: string) {
  const map: Record<string, string> = {
    department: '#2c7be5',
    doctor: '#52c41a',
    disease: '#faad14',
  }
  return map[type] || '#9ca3af'
}
</script>

<template>
  <div class="search-page">
    <NavBar title="搜索">
      <template #title>
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input
            v-model="keyword"
            type="text"
            class="search-input"
            placeholder="搜索科室、医生、疾病"
            autofocus
            @keyup.enter="handleSearch"
          />
          <span v-if="keyword" class="clear-btn" @click="keyword = ''">✕</span>
        </div>
      </template>
      <template #right>
        <span class="search-btn" @click="handleSearch">搜索</span>
      </template>
    </NavBar>

    <div v-if="showHistory" class="history-section">
      <div class="section-header">
        <span class="section-title">搜索历史</span>
        <span class="clear-btn" @click="clearHistory">清空</span>
      </div>
      <div class="tag-list">
        <span
          v-for="kw in historyKeywords"
          :key="kw"
          class="tag-item"
          @click="selectKeyword(kw)"
        >
          {{ kw }}
        </span>
      </div>
    </div>

    <div v-if="!hasSearched" class="hot-section">
      <div class="section-header">
        <span class="section-title">🔥 热门搜索</span>
      </div>
      <div class="tag-list">
        <span
          v-for="kw in hotKeywords"
          :key="kw"
          class="tag-item hot"
          @click="selectKeyword(kw)"
        >
          {{ kw }}
        </span>
      </div>
    </div>

    <div v-if="hasSearched" class="result-section">
      <div v-if="searching" class="loading-state">
        <span class="loading-icon">⏳</span>
        <p class="loading-text">搜索中...</p>
      </div>

      <template v-else>
        <div v-if="results.length === 0" class="empty-state">
          <span class="empty-icon">🔍</span>
          <p class="empty-text">未找到相关结果</p>
          <p class="empty-hint">试试其他关键词吧</p>
        </div>

        <div v-else class="result-list">
          <p class="result-count">共找到 {{ results.length }} 个结果</p>
          <div
            v-for="item in results"
            :key="item.id + item.type"
            class="result-item"
            @click="handleResultClick(item)"
          >
            <span
              class="result-type"
              :style="{ backgroundColor: getTypeColor(item.type) + '20', color: getTypeColor(item.type) }"
            >
              {{ getTypeLabel(item.type) }}
            </span>
            <div class="result-info">
              <span class="result-name">{{ item.name }}</span>
              <span class="result-desc">{{ item.description }}</span>
            </div>
            <span class="result-arrow">›</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-page {
  padding-bottom: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #f5f7fa;
  border-radius: 20px;
  width: 100%;

  .search-icon {
    font-size: 14px;
    margin-right: 6px;
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 14px;
    color: #1f2937;
    outline: none;
    width: 100%;

    &::placeholder {
      color: #9ca3af;
    }
  }

  .clear-btn {
    font-size: 14px;
    color: #9ca3af;
    cursor: pointer;
    flex-shrink: 0;
    margin-left: 6px;
  }
}

.search-btn {
  font-size: 14px;
  color: #2c7be5;
  cursor: pointer;
}

.history-section,
.hot-section {
  padding: 16px;
  background-color: #fff;
  margin-bottom: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
  }

  .clear-btn {
    font-size: 13px;
    color: #9ca3af;
    cursor: pointer;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  padding: 6px 14px;
  background-color: #f5f7fa;
  border-radius: 16px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;

  &.hot {
    background-color: #fff7e6;
    color: #d48806;
  }
}

.result-section {
  padding: 0 12px;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  background-color: #fff;
  border-radius: 12px;

  .loading-icon {
    font-size: 36px;
    display: block;
    margin-bottom: 12px;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
    font-size: 16px;
    color: #6b7280;
    margin: 0 0 6px 0;
  }

  .empty-hint {
    font-size: 13px;
    color: #9ca3af;
    margin: 0;
  }
}

.result-count {
  font-size: 13px;
  color: #9ca3af;
  margin: 12px 4px;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;

  &:active {
    background-color: #f9fafb;
  }
}

.result-type {
  flex-shrink: 0;
  padding: 3px 10px;
  font-size: 11px;
  border-radius: 10px;
  margin-right: 12px;
}

.result-info {
  flex: 1;
  min-width: 0;

  .result-name {
    display: block;
    font-size: 15px;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 3px;
  }

  .result-desc {
    display: block;
    font-size: 12px;
    color: #9ca3af;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.result-arrow {
  font-size: 20px;
  color: #d1d5db;
  flex-shrink: 0;
  margin-left: 8px;
}
</style>
