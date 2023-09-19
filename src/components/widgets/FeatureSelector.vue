<template>
  <div class="col justify-center">
<!--    <div class="featureSelector row">-->
    <div class="row">
      <q-select class="col-5"
                v-model="selectedProtocol"
                :options="protocols"
                option-value="id"
                option-label="name"
                label="Protocol"
                @update:model-value="onProtocolSelected"
                dense>
      </q-select>
      <div class="col-1"/>
      <q-select class="col-6"
                v-model="selectedFeature"
                :options="selectedProtocol?.features"
                input-debounce="0"
                option-value="id"
                option-label="name"
                label="Feature"
                @update:model-value="onFeatureSelected"
                dense>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useRoute} from "vue-router";

const route = useRoute();
const props = defineProps(['protocols'])
const protocols = computed(() => props.protocols)

// const plate = computed(() => props.plate)
//
// const gridColumnStyle = computed(() => { return plate.value ? ("repeat(" + (plate.value.columns + 1) + ", 1fr)") : "repeat(3, 1fr)" });
// const featureSelectorStartColumn = ref(plate.value ? 2 : 1);
// const featureSelectorEndColumn = ref(plate.value ? (plate.value.columns + 1) : 3)

const emits = defineEmits(['featureSelection'])

const selectedProtocol = computed(() => protocols.value[0] ?? null)
const selectedFeature = ref(null)

watch(selectedProtocol, () => {
  onProtocolSelected()
})

// Protocol selection
const onProtocolSelected = () => {
  if (selectedProtocol.value) {
    selectedFeature.value = selectedProtocol.value.features[0]
    onFeatureSelected(selectedFeature.value)
  }
}

// Feature selection
const onFeatureSelected = (selectedFeature) => {
  emits('featureSelection', selectedProtocol.value, selectedFeature)
}
</script>

<style scoped>
.gridContainer {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
}
.featureSelector {
  grid-column: v-bind(featureSelectorStartColumn) / v-bind(featureSelectorEndColumn + 1);
}
</style>
