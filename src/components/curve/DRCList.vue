<template>
  <q-table
      flat square dense bordered
      separator="cell"
      :rows="curveData"
      :columns="curveTableColumns"
      row-key="substance"
      ref="curveTable"
      class="oa-data-table">
    <template v-slot:header="props">
      <q-tr>
        <q-th colspan="3"/>
        <q-th v-for="fid in featureIds" :key="fid" colspan="7">
          {{ fetchFeatureName(fid) }}
        </q-th>
      </q-tr>
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body-cell-substance="props">
      <q-td :props="props">
        {{ props.row.substance }}
      </q-td>
    </template>
    <template v-slot:body-cell-plate="props">
      <q-td :props="props">
        {{ props.row.plateBarcode }}
      </q-td>
    </template>
    <template v-slot:body-cell-samples="props">
      <q-td :props="props">
        {{ props.row.samples }}
      </q-td>
    </template>
    <template v-slot:body-cell="props">
      <q-td :props="props">
        {{ props.row.curve_info[props.col.featureId][props.col.name] ?? FormatUtils.formatToScientificNotation(props.row.curve_info[props.col.featureId][props.col.name], 2) }}
      </q-td>
    </template>
    <template v-slot:body-cell-curve="props">
      <q-td :props="props" @click="setSelectedCurve(props.row.curve_info[props.col.featureId].curve, $event)">
        <MiniDRCView :curvedata="props.row.curve_info[props.col.featureId].curve"/>

        <q-menu touch-position context-menu>
          <q-list dense>
            <q-item clickable v-close-popup>
              <q-item-section @click="setSelectedCurve(props.row.curve_info[props.col.featureId].curve)">Show dose-response view</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import {ref} from "vue";
import {useStore} from "vuex";
import MiniDRCView from "@/components/curve/MiniDRCView.vue"
import FormatUtils from "@/lib/FormatUtils";
import {usePlateStore} from "@/stores/plate";

const store = useStore()
const plateStore = usePlateStore()

const props = defineProps(['plate', 'curves'])
const emits = defineEmits(['handleSelection', 'showDRCView'])

const curves = ref(props.curves)
const distinctSubstances = [...new Set(curves.value.map(c => c.substanceName))]
console.log("distinctSubstances: " + JSON.stringify(distinctSubstances))

const featureIds = [...new Set(curves.value?.map(c => c.featureId))]

const curveData = ref([])
const curveTable = ref(null)

const plateResults = ref([]);
const protocols = ref([]);
const selectedFeature = ref(null);

distinctSubstances.forEach(substance => {
    let curve = curves.value.find(c => c.substanceName === substance)
    const result = {
      'plateId': curve?.plateId,
      'plateBarcode': props.plate.barcode,
      'substance': substance,
      'samples': curve?.wells.length,
      'curve_info': {}
    }

    for (let f in featureIds) {
        curve = curves.value.find(c => c.substanceName === substance && c.featureId === featureIds[f])
          result['curve_info'][curve.featureId] = {
            'ic50': curve.curveProperties.find(cp => cp.name === "pIC50")?.numericValue,
            'slope': curve.curveProperties.find(cp => cp.name === "Slope")?.numericValue,
            'emin': curve.curveProperties.find(cp => cp.name === "eMin")?.numericValue,
            'emin_conc': curve.curveProperties.find(cp => cp.name === "eMin Conc")?.numericValue,
            'emax': curve.curveProperties.find(cp => cp.name === "eMax")?.numericValue,
            'emax_conc': curve.curveProperties.find(cp => cp.name === "eMax Conc")?.numericValue,
            'curve': curve,
            'featureId': featureIds[f]
          }
        }
    curveData.value.push(result)
})

const curveTableColumns = ref([
  {name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true},
  {name: 'plate', align: 'left', label: 'Plate(s)', field: 'plateBarcode', sortable: true},
  {name: 'samples', align: 'left', label: 'Samples', field: 'samples', sortable: true},
])

const curveFeatureCols = (featureId) => {
  return ref([
    {name: 'ic50', align: 'left', label: 'IC50', field: 'curve_info.ic50', sortable: true, featureId: featureId, format: (val, row) => FormatUtils.formatToScientificNotation(val, 2)},
    {name: 'slope', align: 'left', label: 'Slope', field: 'curve_info.slope', sortable: true, featureId: featureId},
    {name: 'emin', align: 'left', label: 'eMin', field: 'curve_info.emin', sortable: true, featureId: featureId},
    {name: 'emin_conc', align: 'left', label: 'eMin Conc', field: 'curve_info.emin_conc', sortable: true, featureId: featureId},
    {name: 'emax', align: 'left', label: 'eMax', field: 'curve_info.emax', sortable: true, featureId: featureId},
    {name: 'emax_conc', align: 'left', label: 'eMax Conc', field: 'curve_info.emax_conc', sortable: true, featureId: featureId},
    {name: 'curve', align: 'center', label: 'Curve', field: 'curve_info.curve', sortable: false, featureId: featureId},
  ]);
}

for (let fId in featureIds) {
  curveTableColumns.value = curveTableColumns.value.concat(curveFeatureCols(featureIds[fId]).value)
}

console.log("curveTableColumns: " + JSON.stringify(curveTableColumns.value))

// const selectedWells = computed( () => store.getters['ui/getSelectedWells']())
// const selectedWellSubstances = computed( () => store.getters['ui/getSelectedSubstances']())

// const selected = ref([...curveData.value.filter(cd => selectedWellSubstances.value.includes(cd.substance))])
// const updateSelected = () => {
//   selected.value = [...curveData.value.filter(cd => selectedWellSubstances.value.includes(cd.substance))]
// }

const selectedCurves = ref([])

// watch(selectedWells, updateSelected);
// watch(selectedWellSubstances, updateSelected);

const handleSelection = ({rows, added, evt}) => {
  const {ctrlKey, shiftKey, metaKey} = evt ?? {ctrlKey: false, shiftKey: false, metaKey: false}

  if (rows.length === 0) return

  const row = rows[ 0 ]
  if (evt !== Object(evt) || (evt.ctrlKey !== true && evt.metaKey !== true)) {
    if ((selected.value.length === 1 || selected.value.length === rows.length) && added !== true)
      selected.value = []
    else
      selected.value = [...rows]
    return
  }

  const operateSelection = added === true
      ? selRow => {
        const selectedIndex = selected.value.findIndex(obj => obj['substance'] === selRow.substance)
        if (selectedIndex === -1) {
          selected.value = selected.value.concat(selRow)
        }
      }
      : selRow => {
        const selectedIndex = selected.value.findIndex(obj => obj['substance'] === selRow.substance)
        if (selectedIndex > -1) {
          selected.value.splice(selectedIndex, 1)
        }
      }

  if (ctrlKey || metaKey) {
    operateSelection(row)
    return
  }
}

const setSelectedCurve = (selectedCurve, event) => {
  console.log("selectedCurve: " + JSON.stringify(selectedCurve))
  selectedCurve['featureName'] = fetchFeatureName(selectedCurve.featureId)
  if (event.ctrlKey || event.metaKey) {
    const index = selectedCurves.value.findIndex(c => c.id === selectedCurve.id)
    index < 0 ? selectedCurves.value.push(selectedCurve) : selectedCurves.value.splice(index, 1)
  } else
    selectedCurves.value = [selectedCurve]

  emits('showDRCView', selectedCurves.value)
}

// const handleFeatureSelection = function (feature) {
//   selectedFeature.value = feature
// }

// const handleShowDRCView = () => {
//   // console.log("handleShowDRCView: " + JSON.stringify(data))
//   console.log("handleShowDRCView: " + JSON.stringify(selected))
//   emits('showDRCView', selected)
// }

const fetchFeatureName = (featureId) => {
  return plateStore.featureById.flat().find(f => f.id === featureId)?.name
}

</script>

<style scoped>
.oa-data-table {
  max-height: 800px;
}
</style>
