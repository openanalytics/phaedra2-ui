<template>
  <q-table v-if="curves.length > 0"
           table-header-class="text-grey"
           flat square dense
           :rows="curveData"
           :columns="curveTableColumns"
          :row-key="name">
    <template v-slot:body-cell-curve="props">
      <q-td :props="props">
        <MiniDoseResponseCurve :curvedata="props.value"></MiniDoseResponseCurve>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import {useCurveDataStore} from "@/stores/curvedata";
import {computed, ref} from "vue";
import FormatUtils from "@/lib/FormatUtils";
import {useStore} from "vuex";
import MiniDoseResponseCurve from "@/components/curve/MiniDoseResponseCurve"

const store = useStore()
const curvedataStore = useCurveDataStore()

const props = defineProps(['plate'])

const curves = computed(() => {
  return curvedataStore.getCurvesByPlateId(props.plate.id)
})

const featureIds = [...new Set(curves.value?.map(c => c.featureId))]
store.dispatch('features/loadByIds', featureIds)

const curveData = curves.value.map(curve => {
  return {
    'id': curve.id,
    'plateBarcode': (store.getters['plates/getById'](curve.plateId) || {}).barcode,
    'substanceType': curve.substanceName,
    'substance': curve.substanceName,
    'samples': curve.wells.length,
    'featureId': (store.getters['features/getById'](curve.featureId) || {}).name,
    'curve': curve
}})



const curveTableColumns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'plate', align: 'left', label: 'Plate(s)', field: 'plateBarcode', sortable: true},
  {name: 'substanceType', align: 'left', label: 'Substance Type', field: 'substanceType', sortable: true},
  {name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true},
  {name: 'samples', align: 'left', label: 'Samples', field: 'samples', sortable: true},
  {name: 'featureId', align: 'left', label: 'Feature', field: 'featureId', sortable: true},
  {name: 'curve', align: 'left', label: 'Curve', field: 'curve', sortable: false},
])

</script>

<style scoped>

</style>
