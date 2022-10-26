<template>
  <div class="q-pa-sm oa-section-body row">
      <WellTypeLegendItem v-for="wellType in wellTypes" :key="wellType" :wellType="wellType"/>
  </div>
</template>

<script setup>
import WellUtils from "@/lib/WellUtils.js"
import WellTypeLegendItem from "@/components/well/WellTypeLegendItem"
import {computed} from "vue";

const props = defineProps(['wells'])

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

const wellTypes = computed(() => {
  return props.wells?.map(w => w.wellType).filter(onlyUnique).map(wt => ({
    code: wt,
    color: WellUtils.getWellTypeColor(wt),
    count: props.wells?.filter(w => w.wellType === wt).length
  }))
})
</script>
