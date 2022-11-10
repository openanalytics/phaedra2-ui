<template>
  <q-table v-if="curves.length > 0"
           class="my-sticky-column-table"
           table-header-class="text-grey"
           flat square dense bordered
           separator="cell"
           :rows="curveData"
           :columns="curveTableColumns"
           row-key="substance"
           selection="multiple"
           v-model:selected="selected"
           @selection="handleSelection">
    <template v-slot:header="props">
      <q-tr>
        <q-th colspan="1"/>
        <q-th colspan="3"/>
        <q-th v-for="feat in features" :key="feat.id" colspan="7">{{ feat.name }}</q-th>
      </q-tr>
      <q-tr :props="props">
        <q-th></q-th>
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body-selection="props">
      <q-toggle :model-value="props.selected" @click="props.selected = !props.selected"/>
    </template>
    <template v-slot:body-cell-substance="props">
      <q-td :props="props">
        {{props.row.substance}}
      </q-td>
    </template>
    <template v-slot:body-cell-plate="props">
      <q-td :props="props">
        {{props.row.plateBarcode}}
      </q-td>
    </template>
    <template v-slot:body-cell-samples="props">
      <q-td :props="props">
        {{props.row.samples}}
      </q-td>
    </template>
    <template v-slot:body-cell="props">
      <q-td :props="props">
        {{props.row.curve_info[props.col.featureId][props.col.name]}}
      </q-td>
    </template>
    <template v-slot:body-cell-curve="props">
      <q-td :props="props" @click="props.selected = !props.selected" @contextmenu="props.selected = !props.selected">
        <MiniDoseResponseCurve :curvedata="props.row.curve_info[props.col.featureId].curve"></MiniDoseResponseCurve>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import {useCurveDataStore} from "@/stores/curvedata";
import {computed, ref} from "vue";
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

const features = computed(() => store.getters['features/getByIds'](featureIds))

const curveData = ref([])

curves.value.map(curve => {
  let result = curveData.value.filter(cd => cd.substance === curve.substanceName);
  if (result.length > 0) {
    result[0].curve_info[curve.featureId] = {
      'ic50': curve.pic50,
      'slope': curve.slope,
      'emin': curve.emin,
      'emin_conc': curve.eminConc,
      'emax': curve.emax,
      'emax_conc': curve.emaxConc,
      'curve': curve
    }
  } else {
    result = {
      'plateId': curve.plateId,
      'plateBarcode': (store.getters['plates/getById'](curve.plateId) || {}).barcode,
      'substance': curve.substanceName,
      'samples': curve.wells.length,
      'curve_info': {}
    }

    for (let f in featureIds) {
      if (featureIds[f] === curve.featureId) {
        result['curve_info'][curve.featureId] = {
          'ic50': curve.pic50,
          'slope': curve.slope,
          'emin': curve.emin,
          'emin_conc': curve.eminConc,
          'emax': curve.emax,
          'emax_conc': curve.emaxConc,
          'curve': curve
        }
      } else {
        result['curve_info'][featureIds[f]] = {
          'ic50': 'NaN',
          'slope': 'NaN',
          'emin': 'NaN',
          'emin_conc': 'NaN',
          'emax': 'NaN',
          'emax_conc': 'NaN',
          'curve': null
        }
      }
    }
    curveData.value.push(result)
  }
})

const curveTableColumns = ref([
  // {name: 'substanceType', align: 'left', label: 'Substance Type', field: 'substanceType', sortable: true},
  {name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true},
  {name: 'plate', align: 'left', label: 'Plate(s)', field: 'plateBarcode', sortable: true},
  {name: 'samples', align: 'left', label: 'Samples', field: 'samples', sortable: true},
])

const curveFeatureCols = (feature) => {
  const result = ref([
    {name: 'ic50', align: 'left', label: 'IC50', field: 'curve_info.ic50', sortable: true, featureId: feature.id},
    {name: 'slope', align: 'left', label: 'Slope', field: 'curve_info.slope', sortable: true, featureId: feature.id},
    {name: 'emin', align: 'left', label: 'eMin', field: 'curve_info.emin', sortable: true, featureId: feature.id},
    {name: 'emin_conc', align: 'left', label: 'eMin Conc', field: 'curve_info.emin_conc', sortable: true, featureId: feature.id},
    {name: 'emax', align: 'left', label: 'eMax', field: 'curve_info.emax', sortable: true, featureId: feature.id},
    {name: 'emax_conc', align: 'left', label: 'eMax Conc', field: 'curve_info.emax_conc', sortable: true, featureId: feature.id},
    {name: 'curve', align: 'center', label: 'Curve', field: 'curve_info.curve', sortable: false, featureId: feature.id},
  ])
  return result;
}

for (let feature in features.value) {
  curveTableColumns.value = curveTableColumns.value.concat(curveFeatureCols(features.value[feature]).value)
}

const selectedWellSubstances = computed( () => { return store.getters['ui/getSelectedSubstances']() })
const selected = ref([...curveData.value.filter(cd => selectedWellSubstances.value.includes(cd.substance))])
const handleSelection = ({ rows, added, evt }) => {
  if (rows.length === 0)  return

  if (added)
    store.commit('ui/addSelectedSubstances', rows.map(row => {return {"name": row.substance, "plates": row.plateId}}))
  else
    store.commit('ui/removeSelectedSubstances', rows.map(row => {return {"name": row.substance, "plates": row.plateId}}))
}
</script>

<style scoped>
</style>
