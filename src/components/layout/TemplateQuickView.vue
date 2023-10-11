<template>
  <div class="row justify-between">
    <div class="row text-h6 items-center q-px-sm oa-section-title full-width justify-between">
      <div>
        <q-icon name="border_outer" class="on-left"/>
        {{ plateTemplate.name }}
      </div>

      <q-select class="float-right" label-color="white" color="primary" v-model="label" label="Label:"
                :options="labelOptions"/>

    </div>
  </div>
  <div class="col-9 gridContainer oa-section">
    <QuickViewSlot v-for="well in wells" :key="well.nr"
                   :well="well"
                   :wellLabelFunctions="wellLabelFunctions"/>
  </div>
</template>

<script setup>
import QuickViewSlot from "./QuickViewSlot";
import WellUtils from "../../lib/WellUtils";
import {computed, ref} from "vue";

const props = defineProps({
  plateTemplate: Object
})

const labelOptions = ['None', 'Well type', 'Substance name', 'Substance type', 'Concentration']

const wells = computed(() => {
  return props.plateTemplate.wells.map(obj => ({
    ...obj,
    nr: WellUtils.getWellNr(obj.row, obj.column, props.plateTemplate.columns)
  }))
})

const gridColumnStyle = computed(() => {
  return "repeat(" + props.plateTemplate.columns + ", 1fr)"
})

const label = ref('None')
const wellLabelFunctions = [
  (well) => {
    //Label based on templateTab
    switch (label.value) {
      case 'Well type':
        return well.wellType;
      case 'Substance name':
        return well.substanceName;
      case 'Substance type':
        return well.substanceType;
      case 'Concentration':
        return well.concentration;
      default:
        return "";
    }
  }
]
</script>

<style scoped>

.gridContainer {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
  min-height: 400px;
  overflow: scroll;
}
</style>
