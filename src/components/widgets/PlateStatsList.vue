<template>
    <q-table
        table-header-class="text-grey"
        :rows="plates"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        :filter="filter"
        :filter-method="filterMethod"
        :loading="loading"
        :key="tableKey"
    >
        <template v-slot:top-right>
            <q-input outlined rounded dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </template>
        <template v-slot:body-cell-barcode="props">
            <q-td :props="props">
                <router-link :to="'/plate/' + props.row.id" class="nav-link">
                    <div class="row items-center cursor-pointer">
                        <q-icon name="view_module" class="icon q-pr-sm" />
                        {{ props.row.barcode }}
                    </div>
                </router-link>
            </q-td>
        </template>
        <template v-slot:no-data>
            <div class="full-width row text-info">
                <span>No plates to show.</span>
            </div>
        </template>
    </q-table>
</template>

<style scoped>
    .tag-icon {
        margin-right: 5px;
    }
    .nav-link {
        color: black;
        text-decoration: none;
    }
</style>

<script>
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'
    
    const filterMethod = function(rows, term) {
        return rows.filter(row => {
            return (row.id == term
                || row.barcode.toLowerCase().includes(term)
                || row.description.toLowerCase().includes(term)
                || (row.tags && row.tags.some(tag => tag.toLowerCase().includes(term))))
        })
    }

    export default {
        props: {
            experiment: Object
        },
        setup(props) {
            const store = useStore()
            const loading = ref(true)

            const plates = computed(() => store.getters['plates/getByExperimentId'](props.experiment.id))
            const measurements = ref([])
            const resultsets = ref([])
            const protocols = ref([])
            const features = ref([])
            const stats = ref([])

            //TODO This chain of API calls must be optimized

            store.dispatch('plates/loadByExperimentId', props.experiment.id).then(() => {
                let measIds = plates.value.flatMap(plate => plate.measurementIds || [] )
                store.dispatch('measurements/loadByIds', measIds).then(() => {
                    measurements.value = store.getters['measurements/getByIds'](measIds)
                })

                let plateIds = plates.value.map(plate => plate.id)
                store.dispatch('resultdata/loadResultSetsByPlateIds', plateIds).then(() => {
                    resultsets.value = store.getters['resultdata/getResultSetsByPlateIds'](plateIds)

                    let protocolIds = resultsets.value.map(rs => rs.protocolId).filter((value, index, self) => self.indexOf(value) === index)
                    store.dispatch('protocols/loadByIds', protocolIds).then(() => {
                        protocols.value = store.getters['protocols/getByIds'](protocolIds)
                    })

                    store.dispatch('features/loadByProtocolIds', protocolIds).then(() => {
                        features.value = store.getters['features/getByProtocolIds'](protocolIds)

                        let resultSetIds = resultsets.value.map(rs => rs.id)
                        let featureIds = features.value.map(f => f.id)

                        store.dispatch('resultdata/loadStatsByResultSetIds', { resultSetIds: resultSetIds, featureIds: featureIds }).then(() => {
                            stats.value = store.getters['resultdata/getStatsByResultSetIds'](resultSetIds, featureIds)
                            updateColumns()
                        })
                    })
                })

            })

            let updateColumns = function() {
                if (features.value.length == 0 || protocols.value.length == 0) return

                features.value.forEach(f => {
                    let protocol = protocols.value.find(pr => pr.id == f.protocolId)
                    columns.push({
                        name: protocol.id + '-' + f.id, 
                        label: protocol.name + ' ' + f.name,
                        format: (val, row) => {
                            let rs = resultsets.value.find(rs => rs.plateId == row.id)
                            if (!rs) return ''
                            let stat = stats.value.find(s => s.resultSetId == rs.id && s.featureId == f.id)
                            let value = stat.plateLevelStats.find(s => s.name == 'zprime').value
                            return Math.round(value * 100) / 100
                        }
                    })
                })

                loading.value = false
                tableKey.value++
            }

            const tableKey = ref(0)
            const columns = [
                { name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true }
            ]

            return {
                columns,
                tableKey,
                filter: ref(''),
                filterMethod,
                loading,
                plates
            }
        }
    }

</script>
