<template>
    <q-table
    class="oa-data-table"
    flat square dense
    virtual-scroll
    :rows-per-page-options="[0]"
    :rows="rows"
    :columns="columns"
    row-key="id"
    column-key="name"
    :filter="filter"
    :filter-method="filterMethod"
    :visible-columns = visibleColumns
    :loading="loading"
    >
        <template v-slot:top-right>
            <div class="row">
                <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search"/>
                    </template>
                </q-input>
                <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="showConfigDialog=true"/>
            </div>
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
.oa-data-table {
    max-height: 400px;
}
</style>

<script setup>
    import {ref, computed, watch} from 'vue'
    import {useStore} from "vuex"
    import WellUtils from "@/lib/WellUtils.js"
    import FilterUtils from "@/lib/FilterUtils"
    import TableConfig from "@/components/table/TableConfig"
    import {usePlateStore} from "@/stores/plate"
    import protocolsGraphQlAPI from "@/api/graphql/protocols"
    import resultDataGraphQlAPI from "@/api/graphql/resultdata"

    const store = useStore();
    const plateStore = usePlateStore()
    const props = defineProps(['plate', 'wells']);

    const loading = ref(true);

    const activeMeasurement = plateStore.measurements.filter(m => m.active === true)[0]
    const resultSet = plateStore.resultSets.find(rs => (Number.parseInt(rs.measId) === activeMeasurement.measurementId))
    const features = protocolsGraphQlAPI.featuresByProtocolId(resultSet?.protocolId)
    const resultData = resultDataGraphQlAPI.resultDataByResultSetId(resultSet?.id)

    const columns = ref([
    {
        name: 'coordinate', align: 'left', label: 'Coordinate', field: 'coordinate', sortable: true,
        format: (val, well) => (WellUtils.getWellCoordinate(well?.row, well?.column) ?? "")
    },
    {
        name: 'number', align: 'left', label: 'Number', field: 'number', sortable: true,
        format: (val, well) => (WellUtils.getWellNr(well?.row, well?.column, props.plate.columns) ?? "")
    },
    {name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true},
    {name: 'wellType', align: 'left', label: 'Well Type', field: 'wellType', sortable: true},
    {
        name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true,
        format: (val, well) => (well.wellSubstance?.name ?? "")
    },
    {
        name: 'concentration', align: 'left', label: 'Concentration', field: 'concentration', sortable: true,
        format: (val, well) => (well.wellSubstance?.concentration?.toExponential(3) ??  "")
    },
    ]);
    const rows = computed(() => props.wells.map(w => { return {...w} }))

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
      loading.value = false
    })

    const updateVisibleColumns = (columns) => {
      visibleColumns.value = [...columns]
    }
</script>

