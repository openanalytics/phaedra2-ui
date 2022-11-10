<template>
  <div class="col justify-center gridContainer">
    <div class="legendBar"/>
    <div v-if="minValue !== null" class="text-dark col-2 minLabelStyle">Min: {{ minValue }}</div>
    <div v-if="minValue === null" class="text-dark col-2 minLabelStyle">Min</div>

    <div v-if="meanValue !== null" class="text-dark col-2 meanLabelStyle">Mean {{ meanValue }}</div>
    <div v-if="meanValue === null" class="text-dark col-2 meanLabelStyle">Mean</div>

    <div v-if="maxValue !== null" class="text-dark col-2 maxLabelStyle">Max: {{ maxValue }}</div>
    <div v-if="maxValue === null" class="text-dark col-2 maxLabelStyle">Max</div>
  </div>
</template>

<style scoped>
.gridContainer {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
}

.legendBar {
  height: 20px;
  background: linear-gradient(90deg, rgba(50, 50, 150, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(150, 50, 50, 1) 100%);
  grid-column: v-bind(legendStartColumn) / v-bind(legendEndColumn + 1)
}

.minLabelStyle {
  font-size: 0.58vw;
  text-align: start;
  grid-column: v-bind(legendStartColumn)
}

.meanLabelStyle {
  font-size: 0.58vw;
  text-align: center;
  grid-column: v-bind(legendCenterColumn)
}

.maxLabelStyle {
  font-size: 0.58vw;
  text-align: end;
  grid-column: v-bind(legendEndColumn)
}
</style>

<script setup>
import {computed, ref, watchEffect} from "vue";

const props = defineProps(['rangeValues', 'plate']);
const minValue = ref(null)
const meanValue = ref(null)
const maxValue = ref(null)

watchEffect(() => {
  if (props?.rangeValues) {
    minValue.value = props.rangeValues.min.toFixed(2)
    meanValue.value = props.rangeValues.mean.toFixed(2)
    maxValue.value = props.rangeValues.max.toFixed(2)
  }
})

const gridColumnStyle = computed(() => { return "repeat(" + (props.plate.columns + 1) + ", 1fr)" });
const legendStartColumn = ref(2);
const legendCenterColumn = ref(Math.ceil((props.plate.columns + 1) / 2))
const legendEndColumn = ref(props.plate.columns + 1)
console.log(gridColumnStyle.value)

</script>
