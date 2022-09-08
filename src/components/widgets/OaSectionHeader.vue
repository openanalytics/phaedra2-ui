<template>
  <div class="row text-h6 items-center q-px-md oa-section-title">
    <q-icon :name="icon" class="on-left"/>
    {{title}}
  </div>
</template>

<script setup>

const props = defineProps(['title', 'icon'])

</script>
