<template>
    <q-breadcrumbs class="breadcrumb" v-if="plate && experiment && project">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
        <q-breadcrumbs-el :label="project.name" icon="folder" :to="{ name: 'project', params: { id: project.id } }" />
        <q-breadcrumbs-el :label="experiment.name" icon="science" :to="{ name: 'experiment', params: { id: experiment.id } }" />
        <q-breadcrumbs-el :label="plate.barcode" icon="view_module" />
    </q-breadcrumbs>
    <q-card class="plate-header" v-if="!plate">
        <q-card-section>
            <div class="text-h6 text-primary">Loading plate...</div>
        </q-card-section>
    </q-card>
    <q-card class="plate-header" v-else>
        <q-card-section>
            <div class="text-h6">{{plate.barcode}}</div>
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
        <q-card-section>
            <WellGrid :plate="plate"></WellGrid>
        </q-card-section>
    </q-card>
</template>

<style scoped>
    .breadcrumb {
        margin: 10px;
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
</style>

<script>
    import { computed } from 'vue'
    import { useStore } from 'vuex'
    import { useRoute } from 'vue-router'

    import WellGrid from "@/components/widgets/WellGrid.vue"
    // import WellUtils from "@/lib/WellUtils.js"

    const propertyColumns = [
        { name: 'key', align: 'left', label: 'Name', field: 'key', sortable: true },
        { name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true }
    ]

    export default {
        name: 'Plate',
        components: {
            WellGrid
        },
        watch: {
            experiment(newValue) {
                console.log(newValue)
            }
        },
        setup() {
            const store = useStore()
            const route = useRoute()

            const plateId = parseInt(route.params.id);
            const plate = computed(() => store.getters['plates/getById'](plateId))
            if (!store.getters['plates/isLoaded'](plateId)) {
                store.dispatch('plates/loadById', plateId)
            }
            //TODO Only works if experiment and project are already cached
            const experiment = computed(() => store.getters['experiments/getById'](plate.value.experimentId))
            const project = computed(() => store.getters['projects/getById'](experiment.value.projectId))

            return {
                plate,
                experiment,
                project,
                propertyColumns
            }
        },
        // created() {
        //     // Demo data
        //     this.plate = {
        //         id: 1,
        //         barcode: "123456",
        //         rows: 16,
        //         columns: 24,
        //         sequence: 1,
        //         wells: []
        //     };
        //     for (var r = 1; r <= this.plate.rows; r++) {
        //         for (var c = 1; c <= this.plate.columns; c++) {
        //             this.plate.wells.push({
        //                 nr: WellUtils.getWellNr(r, c, this.plate.columns),
        //                 row: r,
        //                 column: c,
        //                 wellType: ((c < 3) ? "NC": (c > 22 ? "PC" : "SAMPLE")),
        //                 substance: {}
        //             });
        //         }
        //     }
        // }
    }
</script>