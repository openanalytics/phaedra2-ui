<template>
  <WellGrid :plate="plate"
            :wellColorFunction="wellColorFunction"
            :wellLabelFunctions="wellLabelFunctions"
            @wellSelection="handleWellSelection"/>
  <WellTypeLegend :wells=wells></WellTypeLegend>
</template>

<script setup>
import {ref, computed, watchEffect} from 'vue'
import {useStore} from 'vuex'

import WellGrid from "@/components/well/WellGrid.vue"
import WellTypeLegend from "@/components/well/WellTypeLegend.vue"
import WellUtils from "@/lib/WellUtils.js"

const props = defineProps(['plate'])
const store = useStore();

const wells = computed(() => store.getters['wells/getWells'](props.plate.id) || []);

const wellColorFunction = (well) => {
  return WellUtils.getWellTypeColor(well.wellType)
}

const wellLabelFunctions = ref([]);
watchEffect(() => {
  if (props.plate.columns <= 24) wellLabelFunctions.value.push(well => well.wellType);
});

const selectedWells = ref([])
const handleWellSelection = (wells) => {
  selectedWells.value = wells;
}

</script>
