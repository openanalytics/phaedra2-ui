<template>
  <oa-table :columns="curveTableColumns" :rows="curveData" row-key="substance"
            :filter="filter" :filter-method="filterMethod">
    <template v-slot:header="props">
      <q-tr :props="props">
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
      <q-tr :props="props">
        <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
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
        {{
          props.row.curve_info[props.col.featureId][props.col.name]
          ?? FormatUtils.formatToScientificNotation(
              props.row.curve_info[props.col.featureId][props.col.name], 2)
        }}
      </q-td>
    </template>
    <template v-slot:body-cell-curve="props">
      <q-td :props="props"
            @click="uiStore.addDRCure(props.row.curve_info[props.col.featureId].curve, $event)">
        <MiniDRCView :curvedata="props.row.curve_info[props.col.featureId].curve"/>
        <DRCActionMenu
            @showDRCView="handleShowDRCView(props.row.curve_info[props.col.featureId].curve)"/>
      </q-td>
    </template>
  </oa-table>
</template>

<script setup>
import {ref} from "vue";
import MiniDRCView from "@/components/curve/MiniDRCView.vue"
import FormatUtils from "@/lib/FormatUtils";
import ColumnFilter from "@/components/table/ColumnFilter.vue";
import FilterUtils from "@/lib/FilterUtils";
import {useUIStore} from "@/stores/ui";
import DRCActionMenu from "@/components/curve/DRCActionMenu.vue";
import OaTable from "@/components/table/OaTable.vue";

const uiStore = useUIStore()

const props = defineProps(['plate', 'curves', 'protocols'])
const emits = defineEmits(['handleSelection', 'showDRCView'])

const curves = ref(props.curves)
const features = props.protocols.flatMap(protocol => protocol.features)
const fetchFeatureName = (featureId) => {
  return features.find(f => f.id = featureId)?.name
}

const distinctSubstances = [...new Set(curves.value.map(c => c.substanceName))]
const curveData = ref([])
distinctSubstances.forEach(substance => {
  let curve = curves.value.find(c => c.substanceName === substance)
  const result = {
    'plateId': curve?.plateId,
    'plateBarcode': props.plate.barcode,
    'substance': substance,
    'samples': curve?.wells.length,
    'curve_info': {}
  }

  for (const index in features) {
    const feature = features[index]
    curve = curves.value.find(c => c.substanceName === substance && c.featureId === feature.id)
    if (curve) {
      result['curve_info'][curve.featureId] = {
        'ic50': curve.curveProperties.find(cp => cp.name === "pIC50")?.numericValue,
        'slope': curve.curveProperties.find(cp => cp.name === "Slope")?.numericValue,
        'emin': curve.curveProperties.find(cp => cp.name === "eMin")?.numericValue,
        'emin_conc': curve.curveProperties.find(cp => cp.name === "eMin Conc")?.numericValue,
        'emax': curve.curveProperties.find(cp => cp.name === "eMax")?.numericValue,
        'emax_conc': curve.curveProperties.find(cp => cp.name === "eMax Conc")?.numericValue,
        'curve': curve,
        'feature': {id: feature.id, name: feature.name}
      }
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

const featureIds = [...new Set(curves.value?.map(c => c.featureId))]
for (let fId in featureIds) {
  curveTableColumns.value = curveTableColumns.value.concat(curveFeatureCols(featureIds[fId]).value)
}

const filter = FilterUtils.makeFilter(curveTableColumns.value);
const filterMethod = FilterUtils.defaultFilterMethod();

const handleShowDRCView = (curve) => {
  uiStore.addDRCure(curve)
  uiStore.showDRCView = true
}
</script>
