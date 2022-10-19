<template>
  <div class="row">
    <div class="col-10">
      <WellGrid :plate="props.plate"
                :wellColorFunction="wellColorFunction"
                :wellLabelFunctions="wellLabelFunctions"
                @wellSelection="handleWellSelection"/>
    </div>
    <div class="col-2 q-pa-sm">
      <WellEditor :wells="selectedWells" :plateId="props.plate.id" :tab="tab"/>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import WellGrid from "@/components/well/WellGrid.vue"
import WellEditor from "@/components/well/WellEditor.vue"
import WellUtils from "@/lib/WellUtils.js"
import {useUIStore} from "@/stores/ui";

const props = defineProps(["plate", "tab"])

const uiStore = useUIStore()

const wellColorFunction = function (well) {
  return WellUtils.getWellTypeColor(well.wellType)
}

const wellLabelFunctions = [];
if (props.tab === 'substance') {
  wellLabelFunctions.push((well) => well.substanceName);
  wellLabelFunctions.push((well) => well.concentration);
}

const selectedWells = ref([])
const handleWellSelection = (wells) => {
  selectedWells.value = wells;
  uiStore.selectedWells = wells
}

</script>
