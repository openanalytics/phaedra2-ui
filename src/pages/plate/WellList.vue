<template>
  <q-table
      class="full-width"
      table-header-class="text-grey"
      virtual-scroll
      :pagination="{ rowsPerPage: plate.columns, sortBy: 'number' }"
      :rows="filteredRows"
      :columns="columns"
      :visible-columns="visibleColumns"
      :filter="filter"
      :filter-method="filterMethod"
      row-key="id"
      column-key="name"
      separator="cell"
      :loading="loading"
      flat square dense
  >
    <template v-slot:top-right>
      <div class="row">
        <q-btn size="sm" flat round color="primary" icon="settings" style="border-radius: 50%;" @click="showConfigDialog=true"/>
      </div>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{col.label}}
        </q-th>
      </q-tr>
      <q-tr :props="props">
        <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
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
  <table-config v-model:show="showConfigDialog" :columns="columns" @update:visibleColumns="updateVisibleColumns"/>
</template>

<style scoped>
</style>

<script setup>
    import {ref, computed, watch} from 'vue'
    import WellUtils from "@/lib/WellUtils.js"
    import FilterUtils from "@/lib/FilterUtils"
    import ColumnFilter from "@/components/table/ColumnFilter";
    import TableConfig from "@/components/table/TableConfig"
    import {usePlateStore} from "@/stores/plate"
    import resultDataGraphQlAPI from "@/api/graphql/resultdata"
    import ColorUtils from "@/lib/ColorUtils";

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

    const filter = FilterUtils.makeFilter(columns.value);
    const filterMethod = FilterUtils.defaultFilterMethod();

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

    const updateVisibleColumns = (columns) => {
      visibleColumns.value = [...columns]
    }

    const handleColumnFilter = (columnName) => {
      filteredRows.value = rows.value.filter(row => String(row[columnName]).includes(columnFilters.value[columnName]))
    }
</script>

