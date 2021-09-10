<template>
    <q-breadcrumbs class="breadcrumb" v-if="plate && experiment && project">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
        <q-breadcrumbs-el :label="project.name" icon="folder" :to="{ name: 'project', params: { id: project.id } }" />
        <q-breadcrumbs-el :label="experiment.name" icon="science" :to="{ name: 'experiment', params: { id: experiment.id } }" />
        <q-breadcrumbs-el :label="plate.barcode" icon="view_module" />
    </q-breadcrumbs>
    <q-separator />
    <q-card class="plate-header" v-if="!plate">
        <q-card-section>
            <div class="text-h6 text-primary">Loading plate...</div>
        </q-card-section>
    </q-card>
    <q-card class="plate-header" v-else>
        <q-card-section class="bg-primary text-white q-pa-sm">
            <div class="text-h6 row items-center"><q-icon name="view_module" size="28px" class="q-mr-sm" /> {{plate.barcode}}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
            <div class="row">
                <div class="col-4">
                    <div class="row">
                        <div class="col-3 text-weight-bold">ID:</div>
                        <div class="col">{{plate.id}}</div>
                    </div>
                    <div class="row">
                        <div class="col-3 text-weight-bold">Dimensions:</div>
                        <div class="col">{{plate.rows}} x {{plate.columns}} ({{plate.rows * plate.columns}} wells)</div>
                    </div>
                    <div class="row">
                        <div class="col-3 text-weight-bold">Description:</div>
                        <div class="col">{{plate.description}}</div>
                    </div>
                    <div class="row">
                        <div class="col-3 text-weight-bold">Tags:</div>
                        <div class="col">
                            <div class="tag-icon flex inline" v-for="tag in plate.tags" :key="tag.value">
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
                            :rows="plate.properties"
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
    <q-card class="plate-body" v-if="plate">
        <q-tabs
            inline-label dense no-caps
            align="left"
            class="bg-primary text-white shadow-2"
        >
            <q-route-tab :to="'/plate/' + plate.id" icon="view_module" label="Layout" />
            <q-route-tab :to="'/plate/' + plate.id + '/measurements'" icon="text_snippet" label="Measurements" />
            <q-route-tab :to="'/plate/' + plate.id + '/heatmap'" icon="view_module" label="Heatmap" />
            <q-route-tab :to="'/plate/' + plate.id + '/wells'" icon="table_rows" label="Well List" />
        </q-tabs>
        <router-view class="router-view" :plate="plate"></router-view>
    </q-card>
</template>

<style scoped>
    .breadcrumb {
        margin: 12px;
        margin-bottom: 13px;
    }
    .plate-header {
        margin: 10px;
    }
    .plate-body {
        margin: 10px;
    }
    .action-button {
        margin: 3px;
    }
    .tag-icon {
        margin-right: 5px;
    }
    .router-view {
        margin: 10px;
    }
</style>

<script>
    import { computed, watch, ref } from 'vue'
    import { useStore } from 'vuex'
    import { useRoute } from 'vue-router'

    const propertyColumns = [
        { name: 'key', align: 'left', label: 'Name', field: 'key', sortable: true },
        { name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true }
    ]

    export default {
        name: 'Plate',
        setup() {
            const store = useStore()
            const route = useRoute()

            const plateId = parseInt(route.params.id);

            const plate = computed(() => store.getters['plates/getById'](plateId))
            const experiment = computed(() => store.getters['experiments/getById'](plate.value.experimentId))
            const project = computed(() => store.getters['projects/getById'](experiment.value.projectId))

            // Once the plate has loaded, make sure the parent experiment gets loaded too.
            watch(plate, (plate) => {
                if (!store.getters['experiments/isLoaded'](plate.experimentId)) {
                    store.dispatch('experiments/loadById', plate.experimentId)
                }
            })
            if (!store.getters['plates/isLoaded'](plateId)) {
                store.dispatch('plates/loadById', plateId)
            }

            return {
                plate,
                experiment,
                project,
                propertyColumns,
                activeTab: ref('plate_layout')
            }
        }
    }
</script>