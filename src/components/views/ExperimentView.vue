<template>
    <q-card class="experiment-header" v-if="!experiment">
        <q-card-section>
            <div class="text-h6 text-primary">Loading experiment...</div>
        </q-card-section>
    </q-card>
    <q-card class="experiment-header" v-else>
        <q-card-section>
            <div class="text-h6">{{experiment.name}}</div>
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
                    <div class="row plate-button"><q-btn size="sm" rounded color="primary" label="Edit" /></div>
                    <div class="row plate-button"><q-btn size="sm" rounded color="primary" label="Delete" /></div>
                    <div class="row plate-button"><q-btn size="sm" rounded color="primary" icon="more_horiz" /></div>
                </div>
            </div>
        </q-card-section>
    </q-card>
    <q-card class="project-body">
        <PlateList :experimentId="experimentId"></PlateList>
    </q-card>
</template>

<style>
    .experiment-header {
        margin: 10px;
    }
    .experiment-body {
        margin: 10px;
    }
    .tag-icon {
        margin-right: 5px;
    }
</style>

<script>
    import { computed } from 'vue'
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

            return {
                experimentId,
                experiment,
                propertyColumns
            }
        }
    }
</script>
