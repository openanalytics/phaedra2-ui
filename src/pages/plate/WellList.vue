<script setup>
    import {ref, computed, watch} from 'vue'
    import WellUtils from "@/lib/WellUtils.js"
    import {usePlateStore} from "@/stores/plate"
    import resultDataGraphQlAPI from "@/api/graphql/resultdata"
    import ColorUtils from "@/lib/ColorUtils"
    // import TableConfig from "@/components/table/TableConfig"

    const props = defineProps(['plate', 'wells'])

    const loading = ref(true)

    const plateStore = usePlateStore()
    const features = ref([])
    const resultSet = plateStore.activeResultSet
    features.value = plateStore.featuresByProtocolId(resultSet?.protocolId)

    const resultData = ref([])
    const {onResult, onError} = resultDataGraphQlAPI.resultDataByResultSetId(resultSet?.id)
    onResult(({data}) => resultData.value = data.resultData)

    const columns = ref([
      { name: 'coordinate', align: 'left', label: 'Coordinate', field: 'coordinate', sortable: true },
      { name: 'number', align: 'left', label: 'Number', field: 'number', sortable: true },
      { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
      { name: 'wellType', align: 'left', label: 'Well Type', field: 'wellType', sortable: true},
      { name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true },
      { name: 'concentration', align: 'left', label: 'Concentration', field: 'concentration', sortable: true },
    ])

    const rows = ref(props.wells.map(well => {
      return {
        coordinate: WellUtils.getWellCoordinate(well?.row, well?.column) ?? "",
        number: WellUtils.getWellNr(well?.row, well?.column, props.plate.columns) ?? "",
        status: well.status,
        wellType: well.wellType,
        substance: well.wellSubstance?.name ?? "",
        concentration: well.wellSubstance?.concentration?.toExponential(3) ?? ""
      }
    }))

    const filteredRows = ref([])
    const columnFilters = ref({})

    const showConfigDialog = ref(false);
    const visibleColumns = ref([])
    const filter = ref('');

    const updateVisibleColumns = (columns) => {
      visibleColumns.value = [...columns]
    }

    const handleColumnFilter = (columnName) => {
      filteredRows.value = rows.value.filter(row => String(row[columnName]).includes(columnFilters.value[columnName]))
    }

    watch([features, resultData], () => {
      if (features.value !== undefined && resultData.value !== undefined) {
        const featureCols = computed(() => (features.value ?? []).map(f => {
          return {name: f.name, align: 'left', label: f.name, field: f.name, sortable: true, 'featureId': f.id, isFeature: true, lut: null}
        }))
        columns.value = [...columns.value, ...featureCols.value]
        featureCols.value.forEach(fCol => {
          const featValues = resultData.value.filter(rd => rd.featureId === fCol.featureId)[0]?.values ?? []
          fCol.lut = ColorUtils.createLUT(featValues, ColorUtils.defaultHeatmapGradients)
          rows.value.forEach((row, index) => {
            row[fCol.field] = featValues[index]
          })
        })
      }
      visibleColumns.value = [...columns.value.map(a => a.name)];
      filteredRows.value = [...rows.value.map(r => r)]
      loading.value = false

      columns.value.forEach(col => {
        columnFilters.value[col.name] = ref(null)
      })
    })
</script>

<template>
  <q-table
      table-header-class="text-grey"
      :rows="filteredRows"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="id"
      column-key="name"
      :loading="loading"
      virtual-scoll
      style="max-height: 600px"
      separator="cell"
      flat square dense
  >
    <!--    <template v-slot:top-right>-->
    <!--      <div class="row">-->
    <!--        <q-btn size="sm" label="Settings" icon="settings" @click="showConfigDialog=true" class="oa-action-button"/>-->
    <!--      </div>-->
    <!--    </template>-->
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{col.label}}
        </q-th>
      </q-tr>
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name">
          <q-input v-if="col.name != 'menu'" v-model="columnFilters[col.name]"
                   @update:model-value="handleColumnFilter(col.name)"
                   dense class="filterColumn">
            <template v-slot:append>
              <q-icon size="xs" name="search"/>
            </template>
          </q-input>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body-cell="props">
      <q-td v-if="props.col.isFeature" :props="props" :style="'background-color:' + props.col.lut.getColor(props.value)">
        <div v-if="props.col.isFeature">{{props.value}}</div>
      </q-td>
      <q-td v-else :props="props">
        {{props.value}}
      </q-td>
    </template>
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <q-icon v-if="props.row.status === 'ACCEPTED_DEFAULT'" name="check_circle" color="positive"/>
        <q-icon v-else name="cancel" color="negative"/>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No wells to show.</span>
      </div>
    </template>
  </q-table>

  <!--  <TableConfig v-model:show="showConfigDialog" :columns="columns" @update:visibleColumns="updateVisibleColumns"/>-->
</template>

<style scoped>
:deep(.filterColumn .q-field__control),
:deep(.filterColumn .q-field__append) {
  font-size: 12px;
  height: 25px;
}
</style>
