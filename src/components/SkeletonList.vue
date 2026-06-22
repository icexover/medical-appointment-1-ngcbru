<script setup lang="ts">
defineProps<{
  rows?: number
}>()
</script>

<template>
  <div class="skeleton-list">
    <div v-for="i in (rows || 3)" :key="i" class="skeleton-item">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-content">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line long"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skeleton-list {
  padding: 12px;
}

.skeleton-item {
  display: flex;
  padding: 14px;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
}

.skeleton-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  margin-left: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.skeleton-line {
  height: 12px;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;

  &:last-child {
    margin-bottom: 0;
  }
}

.short {
  width: 30%;
}

.medium {
  width: 50%;
}

.long {
  width: 80%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
