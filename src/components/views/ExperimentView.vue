<template>
    <q-breadcrumbs class="breadcrumb" v-if="experiment && project">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
        <q-breadcrumbs-el :label="project.name" icon="folder" :to="{ name: 'project', params: { id: experiment.projectId } }" />
        <q-breadcrumbs-el :label="experiment.name" icon="science" />
    </q-breadcrumbs>
    <q-separator />
    <q-card class="experiment-header" v-if="!experiment">
        <q-card-section>
            <div class="text-h6 text-primary">Loading experiment...</div>
        </q-card-section>
    </q-card>
    <q-card class="experiment-header" v-else>
        <q-card-section>
            <div class="text-h6 row items-center"><q-icon name="science" size="28px" class="q-mr-sm" /> {{experiment.name}}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
            <div class="row">
                <div class="col-4">
                    <div class="row">
                        <div class="col-3 text-weight-bold">ID:</div>
                        <div class="col">{{experiment.id}}</div>
                    </div>
                    <div class="row">
                        <div class="col-3 text-weight-bold">Description:</div>
                        <div class="col">{{experiment.description}}</div>
                    </div>
                    <div class="row">
                        <div class="col-3 text-weight-bold">Tags:</div>
                        <div class="col">
                            <div class="tag-icon flex inline" v-for="tag in experiment.tags" :key="tag.value">
                                <q-badge color="green">
                                    {{ tag }}
                                </q-badge>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-4">
                <div class="row">
                    <div class="col-2 text-weight-bold">Properties:</div>
                    <div class="col">
                        <q-table
                            dense
                            :rows="experiment.properties"
                            :columns="propertyColumns"
                            table-header-class="text-grey"
                            row-key="key"
                            hide-pagination
                        >
                            <template v-slot:no-data>
                                <div class="full-width row text-info">
                                    <span>No properties</span>
                                </div>
                            </template>
                        </q-table>
                    </div>
                </div>
                </div>
                <div class="col-2">
                </div>
                <div class="col-2">
                    <div class="row action-button"><q-btn size="sm" rounded color="primary" label="Edit" /></div>
                    <div class="row action-button"><q-btn size="sm" rounded color="primary" label="Delete" /></div>
                    <div class="row action-button"><q-btn size="sm" rounded color="primary" icon="more_horiz" /></div>
                </div>
            </div>
        </q-card-section>
    </q-card>
    <q-card class="experiment-body">
        <q-tabs
            v-model="activeTab"
            inline-label dense no-caps
            align="left"
            class="bg-primary text-white shadow-2"
        >
            <q-tab name="plate_overview" icon="table_rows" label="Plate Overview" />
            <q-tab name="plate_statistics" icon="functions" label="Plate Statistics" />
            <q-tab name="plate_heatmaps" icon="view_module" label="Plate Heatmaps" />
        </q-tabs>
        <PlateList :experimentId="experimentId"></PlateList>
    </q-card>
</template>

<style scoped>
    .breadcrumb {
        margin: 12px;
        margin-bottom: 13px;
    }
    .experiment-header {
        margin: 10px;
    }
    .experiment-body {
        margin: 10px;
    }
    .action-button {
        margin: 3px;
    }
    .tag-icon {
        margin-right: 5px;
    }
</style>

<script>
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'
    import { useRoute } from 'vue-router'

    import PlateList from "@/components/widgets/PlateList.vue"

    const propertyColumns = [
        { name: 'key', align: 'left', label: 'Name', field: 'key', sortable: true },
        { name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true }
    ]

    export default {
        name: 'Experiment',
        components: {
            PlateList
        },
        setup() {
            const store = useStore()
            const route = useRoute()

            const experimentId = parseInt(route.params.id);
            const experiment = computed(() => store.getters['experiments/getById'](experimentId))
            if (!store.getters['experiments/isLoaded'](experimentId)) {
                store.dispatch('experiments/loadById', experimentId)
            }

            const project = computed(() => store.getters['projects/getById'](experiment.value.projectId))

            return {
                experimentId,
                experiment,
                project,
                propertyColumns,
                activeTab: ref('plate_overview')
            }
        }
    }
</script>
