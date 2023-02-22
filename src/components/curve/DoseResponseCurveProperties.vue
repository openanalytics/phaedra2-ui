<template>
  <q-table class="my-sticky-column-table"
           table-header-class="text-grey"
           flat square dense bordered
           separator="cell"
           :rows="data"
           :columns="columns">
  </q-table>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {useStore} from "vuex";

const store = useStore()

const columns = ref([
  {name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true},
  {name: 'property', align: 'left', label: 'Property Name', field: 'name', sortable: true},
  {name: 'value', align: 'left', label: 'Property Value', field: 'value', sortable: true}
])

const props = defineProps(['plate'])

const data = ref([])

const selectedWellSubstances = computed(() => store.getters['ui/getSelectedSubstances']())
const updateCurveProperties = () => {
  const drCurves = computed(() => store.getters['curvedata/getCurvesByPlateIdAndSubstances'](props.plate.id, selectedWellSubstances.value))
  if (drCurves.value) {
    data.value = drCurves.value.map(drc => {
      return {'substance': drc.substanceName, 'name': 'IC50', 'value': drc.pic50}
    })
  }
}

watch(selectedWellSubstances, updateCurveProperties);

</script>

<style scoped>

</style>
