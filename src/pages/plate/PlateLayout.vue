<template>
  <WellTypeLegend :wells=plateStore.wells />
  <WellGrid :plate="plateStore.plate"
            :wells="plateStore.wells"
            :wellColorFunction="wellColorFunction"
            :wellLabelFunctions="wellLabelFunctions"
            @wellStatusChanged="() => emits('wellStatusChanged')"
            @wellSelection="handleWellSelection"/>
</template>

<script setup>
import WellGrid from "@/components/well/WellGrid.vue"
import WellTypeLegend from "@/components/well/WellTypeLegend.vue"
import WellUtils from "@/lib/WellUtils.js"
import {usePlateStore} from "@/stores/plate";
import {useUIStore} from "@/stores/ui";

const props = defineProps(['plate', 'wells']);
const emits = defineEmits(['wellStatusChanged'])

const wellColorFunction = (well) => WellUtils.getWellTypeColor(well.wellType)

const wellLabelFunctions = [];
wellLabelFunctions.push((well) => well.wellType)

const plateStore = usePlateStore()
const uiStore = useUIStore()
const handleWellSelection = () => {
  if (uiStore.selectedWells.length > 0) {
    const selectedSubstance = [... new Set(uiStore.selectedWells.map(well => well.wellSubstance?.name))]
    const selectedCurves = plateStore.curves.filter(curve => selectedSubstance.includes(curve.substanceName))
    uiStore.selectedDRCurves = selectedCurves
  }
}
</script>
