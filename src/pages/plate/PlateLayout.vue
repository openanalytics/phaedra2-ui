<template>
  <WellTypeLegend :wells=plateStore.wells />
  <WellGrid :plate="plateStore.plate"
            :wells="plateStore.wells"
            :wellColorFunction="wellColorFunction"
            :wellLabelFunctions="wellLabelFunctions"
            @wellStatusChanged="() => emits('wellStatusChanged')"/>
</template>

<script setup>
import WellGrid from "@/components/well/WellGrid.vue"
import WellTypeLegend from "@/components/well/WellTypeLegend.vue"
import WellUtils from "@/lib/WellUtils.js"
import {usePlateStore} from "@/stores/plate";

const plateStore = usePlateStore()

const props = defineProps(['plate', 'wells']);
const emits = defineEmits(['wellStatusChanged'])

const wellColorFunction = (well) => WellUtils.getWellTypeColor(well.wellType)

const wellLabelFunctions = [];
wellLabelFunctions.push((well) => well.wellType)
</script>
