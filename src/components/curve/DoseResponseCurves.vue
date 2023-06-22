<template>
  <q-table
      flat square dense bordered
      virtual-scroll
      :rows-per-page-options="[0]"
      separator="cell"
      :rows="curveData"
      :columns="curveTableColumns"
      row-key="substance"
      selection="multiple"
      :selected="selected"
      :pagination="pagination"
      ref="curveTable"
      @selection="handleSelection"
      class="oa-data-table">
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
        {{ FormatUtils.formatToScientificNotation(props.row.curve_info[props.col.featureId][props.col.name], 2) }}
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
import {computed, ref, watch} from "vue";
import {useStore} from "vuex";
import MiniDoseResponseCurve from "@/components/curve/MiniDoseResponseCurve.vue"
import FormatUtils from "@/lib/FormatUtils";
import FeatureSelector from "@/components/widgets/FeatureSelector"

const store = useStore()

const props = defineProps(['plate', 'curves'])
const emit = defineEmits(['handleSelection'])

const curves = ref(props.curves)

const featureIds = [...new Set(curves.value?.map(c => c.featureId))]
const features = computed(() => store.getters['features/getByIds'](featureIds))

const curveData = ref([])
const curveTable = ref(null)

const plateResults = ref([]);
const protocols = ref([]);
const selectedFeature = ref(null);

curves.value?.map(curve => {
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
      'plateBarcode': props.plate.barcode,
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

const curveFeatureCols = (featureId) => {
  return ref([
    {
      name: 'ic50',
      align: 'left',
      label: 'IC50',
      field: 'curve_info.ic50',
      sortable: true,
      featureId: featureId,
      format: (val, row) => FormatUtils.formatToScientificNotation(val, 2)
    },
    {name: 'slope', align: 'left', label: 'Slope', field: 'curve_info.slope', sortable: true, featureId: featureId},
    {name: 'emin', align: 'left', label: 'eMin', field: 'curve_info.emin', sortable: true, featureId: featureId},
    {
      name: 'emin_conc',
      align: 'left',
      label: 'eMin Conc',
      field: 'curve_info.emin_conc',
      sortable: true,
      featureId: featureId
    },
    {name: 'emax', align: 'left', label: 'eMax', field: 'curve_info.emax', sortable: true, featureId: featureId},
    {
      name: 'emax_conc',
      align: 'left',
      label: 'eMax Conc',
      field: 'curve_info.emax_conc',
      sortable: true,
      featureId: featureId
    },
    {name: 'curve', align: 'center', label: 'Curve', field: 'curve_info.curve', sortable: false, featureId: featureId},
  ]);
}

const pagination = ref({rowsPerPage: 0})

for (let fId in featureIds) {
  curveTableColumns.value = curveTableColumns.value.concat(curveFeatureCols(featureIds[fId]).value)
}

const selectedWells = computed( () => store.getters['ui/getSelectedWells']())
const selectedWellSubstances = computed( () => store.getters['ui/getSelectedSubstances']())

const selected = ref([...curveData.value.filter(cd => selectedWellSubstances.value.includes(cd.substance))])
const updateSelected = () => {
  selected.value = [...curveData.value.filter(cd => selectedWellSubstances.value.includes(cd.substance))]
}

watch(selectedWells, updateSelected);
watch(selectedWellSubstances, updateSelected);

const handleSelection = ({rows, added, evt}) => {
  if (rows.length === 0) return

  const selectedWells = computed(() => store.getters['wells/getWellsByPlateIdAndSubstance'](props.plate.id, rows[0].substance))
  if (added) {
    store.commit('ui/addSelectedWells', selectedWells.value)
    store.commit('ui/addSelectedSubstances', rows.map(row => ({"name": row.substance, "plates": row.plateId})))
  } else {
    store.commit('ui/removeSelectedWells', selectedWells.value)
    store.commit('ui/removeSelectedSubstances', rows.map(row => ({"name": row.substance, "plates": row.plateId})))
  }
  emit('handleSelection', curveTable.value.$el.offsetHeight)

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

  if (evt.ctrlKey === true || evt.metaKey === true) {
    operateSelection(row)
    return
  }
}

const handleFeatureSelection = function (feature) {
  selectedFeature.value = feature
}
</script>

<style scoped>
.oa-data-table {
  max-height: 800px;
}
</style>
