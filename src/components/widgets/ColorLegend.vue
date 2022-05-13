<template>
  <div class="row justify-center">
    <div class="legendBar oa-section"></div>
    <div class="legendLabels column q-ml-sm">
      <div class="text-dark col-2">Max: {{ maxValue }}</div>
      <div class="col-3"></div>
      <div class="text-dark col-2">Mean: {{ meanValue }}</div>
      <div class="col-3"></div>
      <div class="text-dark col-2">Min: {{ minValue }}</div>
    </div>
  </div>
</template>

<style scoped>
.legendBar {
  width: 80px;
  height: 150px;
  background: linear-gradient(0deg, rgba(50, 50, 150, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(150, 50, 50, 1) 100%);
}
</style>

<script setup>
import {ref, watchEffect} from "vue";

const props = defineProps(['rangeValues']);
const minValue = ref(0)
const meanValue = ref(50)
const maxValue = ref(100)

watchEffect(() => {
  if (props?.rangeValues) {
    minValue.value = props.rangeValues.min.toFixed(2)
    meanValue.value = props.rangeValues.mean.toFixed(2)
    maxValue.value = props.rangeValues.max.toFixed(2)
  }
})

</script>
