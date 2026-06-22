<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = withDefaults(defineProps<{
  title?: string
  showBack?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
}>(), {
  title: '',
  showBack: true,
  showSearch: false,
  searchPlaceholder: '搜索科室、医生、疾病',
})

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'searchClick'): void
}>

const router = useRouter()

function handleBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/home')
  }
}

function handleSearchClick() {
  emit('searchClick')
  router.push('/search')
}
</script>

<template>
  <div class="nav-bar">
    <div class="nav-left">
      <div v-if="showBack" class="nav-back" @click="handleBack">
        <span class="back-icon">←</span>
      </div>
    </div>
    <div class="nav-title">
      <slot name="title">
        <span v-if="title">{{ title }}</span>
        <div v-else-if="showSearch" class="search-bar" @click="handleSearchClick">
          <span class="search-icon">🔍</span>
          <span class="search-placeholder">{{ searchPlaceholder }}</span>
        </div>
      </slot>
    </div>
    <div class="nav-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 99;
  height: 44px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.nav-left,
.nav-right {
  width: 50px;
  flex-shrink: 0;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-back {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .back-icon {
    font-size: 20px;
    color: #333;
  }
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #f5f7fa;
  border-radius: 20px;
  cursor: pointer;

  .search-icon {
    font-size: 14px;
    margin-right: 6px;
  }

  .search-placeholder {
    font-size: 13px;
    color: #9ca3af;
    font-weight: normal;
  }
}

.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
