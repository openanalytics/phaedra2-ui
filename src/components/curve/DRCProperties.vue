<template>
  <q-table
      table-header-class="text-grey"
      :rows="curvePropertyRows"
      row-key="PropertyName"
      virtual-scoll
      style="max-height: 300px"
      :pagination="pagination"
      :rows-per-page-options="[0]"
      square flat dense
  />
</template>

<script setup>
import {onMounted, ref, watch} from "vue";

const props = defineProps(['curves', 'update'])
const pagination = ref({ rowsPerPage: 0 })

const curvePropertyRows = ref([])
const updateDRCPropertyTable = () => {
  if (props.curves.length > 0) {
    const curvePropertyNames = props.curves[0].curveProperties.map(cProp => cProp.name)
    curvePropertyRows.value = curvePropertyNames.map(cPropName => {
      const result = {Property: cPropName}

      props.curves.forEach(curve => {
        const matchingProp = curve.curveProperties.find(cProp => cProp.name === cPropName);
        result[curve.substanceName] = matchingProp?.numericValue ?? matchingProp?.stringValue;
      })

      return result
    })
  } else {
    curvePropertyRows.value = []
  }
}

onMounted(() => {
  updateDRCPropertyTable()
})

watch(() => props.curves, updateDRCPropertyTable)

</script>

<style scoped>

</style>
