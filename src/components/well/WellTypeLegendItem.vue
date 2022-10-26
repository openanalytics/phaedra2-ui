<template>
  <div class="row q-pa-xs legendRow">
    <div class="col-2" :style="{ width: '20px', background: props.wellType.color}"></div>
    <div class="col q-pl-sm">{{ props.wellType.code }} ( {{ props.wellType.count }} )</div>
  </div>
</template>

<script setup>

const props = defineProps(['wellType', 'orientation']);

</script>

<style scoped>
.legendRow {
  width: 200px;
}
</style>
