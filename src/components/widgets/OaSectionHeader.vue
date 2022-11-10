<template>
  <div class="row text-h6 items-center q-px-md oa-section-title">
    <div style="justify-content: center; min-width: 56px;" class="column"><q-icon :name="icon" /></div>
    <div class="column">{{title}}</div>
  </div>
</template>

<script setup>

const props = defineProps(['title', 'icon'])

</script>
