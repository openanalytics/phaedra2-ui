<template>
  <WellGrid :plate="plate"
            :wells="wells"
            :wellColorFunction="wellColorFunction"
            :wellLabelFunctions="wellLabelFunctions"/>
  <WellTypeLegend :wells=wells />
</template>

<script setup>
import {computed, ref, watchEffect} from 'vue'

import WellGrid from "@/components/well/WellGrid.vue"
import WellTypeLegend from "@/components/well/WellTypeLegend.vue"
import WellUtils from "@/lib/WellUtils.js"

const props = defineProps(['plate', 'wells']);

const plate = computed( () => props.plate)
const wells = computed( () => props.wells)

const wellColorFunction = (well) => WellUtils.getWellTypeColor(well.wellType)

const wellLabelFunctions = [];
wellLabelFunctions.push((well) => well.wellType)
</script>
