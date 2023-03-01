<template>
  <div class="row q-pa-xs oa-section-title">
    <div style="justify-content: center" class="column"><q-icon class="" :name="icon" /></div>
    <div class="column text-h6">{{title}}</div>
  </div>
</template>

<script setup>

const props = defineProps(['title', 'icon'])

</script>
