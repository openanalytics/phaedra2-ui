<template>
    <q-table
        title="Plates"
        :rows="plates"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        :filter="filter"
        :filter-method="filterMethod"
        :loading="loading"
    >
        <template v-slot:top-right>
            <q-input outlined rounded dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </template>
        <template v-slot:body-cell-name="props">
            <q-td :props="props">
                <router-link :to="{ name: 'plate', params: { id: props.row.id } }" class="nav-link">
                    <div class="row items-center cursor-pointer">
                        <q-icon name="folder" class="icon q-pr-sm" />
                        {{ props.row.name }}
                    </div>
                </router-link>
            </q-td>
        </template>    
        <template v-slot:body-cell-tags="props">
            <q-td :props="props">
                <div class="tag-icon flex inline" v-for="tag in props.row.tags" :key="tag.value">
                    <q-badge color="green">
                        {{ tag }}
                    </q-badge>
                </div>
            </q-td>
        </template>
        <template v-slot:no-data>
            <div class="full-width row text-info">
                <span>No plates to show.</span>
            </div>
        </template>
    </q-table>
</template>

<script>
    import { ref, computed, onUnmounted } from 'vue'
    import { useStore } from 'vuex'
    
    const columns = [
        { name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true },
        { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true },
        { name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: val => `${val.toLocaleString()}` },
        { name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true }
    ]

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
            experimentId: Number
        },
        setup(props) {
            const store = useStore()
            const loading = ref(true)
            
            const plates = computed(() => store.getters['plates/getByExperimentId'](props.experimentId))
            store.dispatch('plates/loadByExperimentId', props.experimentId)
            
            const unsubscribe = store.subscribe((mutation) => {
                if (mutation.type == "plates/cachePlates") {
                    loading.value = false
                }
            })
            onUnmounted(() => {
                unsubscribe()
            })
            
            return {
                columns,
                filter: ref(''),
                filterMethod,
                loading,
                plates
            }
        }
    }

</script>
