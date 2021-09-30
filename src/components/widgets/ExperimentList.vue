<template>
    <q-table
        title="Experiments"
        table-header-class="text-grey"
        :rows="experiments"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        :filter="filter"
        :filter-method="filterMethod"
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
                <router-link :to="{ name: 'experiment', params: { id: props.row.id } }" class="nav-link">
                    <div class="row items-center cursor-pointer">
                        <q-icon name="science" class="icon q-pr-sm" />
                        {{ props.row.name }}
                        <ExperimentContextMenu></ExperimentContextMenu>
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
                <span>No experiments to show.</span>
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

    import ExperimentContextMenu from "@/components/widgets/ExperimentContextMenu.vue"

    const columns = [
        { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
        { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true },
        { name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: val => `${val.toLocaleString()}` },
        { name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true }
    ]

    const filterMethod = function(rows, term) {
        return rows.filter(row => {
            return (row.id === term
                || row.name.toLowerCase().includes(term)
                || row.description.toLowerCase().includes(term)
                || (row.tags && row.tags.some(tag => tag.toLowerCase().includes(term))))
        })
    }

    export default {
        props: {
            projectId: Number
        },
        components: {
            ExperimentContextMenu
        },
        setup(props) {
            const store = useStore()
            // const loading = ref(true)

            const experiments = computed(() => store.getters['experiments/getByProjectId'](props.projectId))
            store.dispatch('experiments/loadByProjectId', props.projectId)

            // const unsubscribe = store.subscribe((mutation) => {
            //     if (mutation.type == "experiments/cacheExperiments") {
            //         loading.value = false
            //     }
            // })
            // onUnmounted(() => {
            //     unsubscribe()
            // })

            return {
                columns,
                filter: ref(''),
                filterMethod,
                // loading,
                experiments
            }
        }
    }

</script>
