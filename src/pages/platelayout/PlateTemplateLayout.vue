<template>
  <div class="col-auto">
    <WellEditor :plateId="props.plate.id" :tab="tab" :update="update"/>
    <WellGrid :plate="props.plate"
              :wellColorFunction="wellColorFunction"
              :wellLabelFunctions="wellLabelFunctions"
              @wellSelection="handleWellSelection"/>
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
const update = ref(Date.now())

const wellColorFunction = function (well) {
  return WellUtils.getWellTypeColor(well.wellType)
}

const wellLabelFunctions = [];
if (props.tab === 'substance') {
  wellLabelFunctions.push((well) => well.substanceName);
}
if (props.tab === 'concentration') {
  wellLabelFunctions.push((well) => well.concentration);
}
if (props.tab === 'well-type') {
  wellLabelFunctions.push((well) => well.wellType);
}

const handleWellSelection = (wells) => {
  uiStore.selectedWells = wells
  update.value = Date.now()
}

</script>
