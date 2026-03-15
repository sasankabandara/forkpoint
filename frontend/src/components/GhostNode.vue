<script setup lang="ts">
</script>

<template>
  <div class="ghost-node ghost-pulse">
    <div class="ghost-bar short"></div>
    <div class="ghost-bar long"></div>
    <div class="ghost-bar medium"></div>
    <div class="ghost-text">Exploring alternate timeline…</div>
  </div>
</template>

<style scoped>
.ghost-node {
  width: 220px;
  padding: 20px;
  background: var(--color-bg-elevated);
  border: 1px dashed var(--color-border);
  border-radius: 10px;
}
.ghost-bar {
  height: 10px;
  background: var(--color-border);
  border-radius: 5px;
  margin-bottom: 10px;
}
.ghost-bar.short  { width: 40%; }
.ghost-bar.long   { width: 90%; }
.ghost-bar.medium { width: 65%; }
.ghost-text {
  font-size: 11px;
  color: var(--color-text-dim);
  font-style: italic;
  margin-top: 6px;
}
</style>
