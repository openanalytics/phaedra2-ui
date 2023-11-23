<template>
  <q-table
      table-header-class="text-grey"
      virtual-scroll
      :pagination="{ rowsPerPage: 10, sortBy: 'number', descending: false }"
      :rows="filteredRows"
      :columns="columns"
      row-key="id"
      column-key="name"
      :visible-columns=visibleColumns
      :loading="loading"
      flat square dense
  >
    <template v-slot:top-right>
      <div class="row">
        <q-btn size="sm" label="Settings" icon="settings" @click="showConfigDialog=true" class="oa-action-button"/>
      </div>
    </template>
    <template v-slot:header-cell="props">
      <q-td :props="props" class="row-cols-1">
        <div>{{ props.col.label }}</div>
        <div>
          <q-input v-model="columnFilters[props.col.name]"
                   @update:model-value="handleColumnFilter(props.col.name)"
                   dense>
            <template v-slot:append>
              <q-icon size="xs" name="search"/>
            </template>
          </q-input>
        </div>
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
  <table-config v-model:show="showConfigDialog" :columns="columns" @update:visibleColumns="updateVisibleColumns"/>
</template>

<style scoped>
</style>

<script setup>
    import {ref, computed, watch} from 'vue'
    import WellUtils from "@/lib/WellUtils.js"
    import FilterUtils from "@/lib/FilterUtils"
    import TableConfig from "@/components/table/TableConfig"
    import {usePlateStore} from "@/stores/plate"
    import resultDataGraphQlAPI from "@/api/graphql/resultdata"

    const props = defineProps(['plate', 'wells']);

    const plateStore = usePlateStore()

    const loading = ref(true);
    const features = ref([])
    const resultData = ref([])

    const resultSet = plateStore.activeResultSet
    features.value = plateStore.featuresByProtocolId(resultSet?.protocolId)

    const {onResult, onError} = resultDataGraphQlAPI.resultDataByResultSetId(resultSet?.id)
    onResult(({data}) => resultData.value = data.resultData)

    const columns = ref([
      { name: 'coordinate', align: 'left', label: 'Coordinate', field: 'coordinate', sortable: true },
      { name: 'number', align: 'left', label: 'Number', field: 'number', sortable: true },
      { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
      { name: 'wellType', align: 'left', label: 'Well Type', field: 'wellType', sortable: true},
      { name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true },
      { name: 'concentration', align: 'left', label: 'Concentration', field: 'concentration', sortable: true },
    ]);
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
    const filterMethod = FilterUtils.defaultTableFilter();


    watch([features, resultData], () => {
      if (features.value !== undefined && resultData.value !== undefined) {
        const featureCols = computed(() => (features.value ?? []).map(f => {
          return {name: f.name, align: 'left', label: f.name, field: f.name, sortable: true, 'featureId': f.id}
        }))
        columns.value = [...columns.value, ...featureCols.value]
        featureCols.value.forEach(fCol => {
          const featValues = resultData.value.filter(rd => rd.featureId === fCol.featureId)[0]?.values ?? []
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

    const updateVisibleColumns = (columns) => {
      visibleColumns.value = [...columns]
    }

    const handleColumnFilter = (columnName) => {
      console.log("Value of column filter " + columnName + " changed: " + columnFilters.value[columnName])
      filteredRows.value = rows.value.filter(row => String(row[columnName]).startsWith(columnFilters.value[columnName]))
    }
</script>

