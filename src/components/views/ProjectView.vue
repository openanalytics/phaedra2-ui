<template>
    <q-breadcrumbs class="breadcrumb" v-if="project">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
        <q-breadcrumbs-el :label="project.name" icon="folder" />
    </q-breadcrumbs>
    <q-separator />
    <q-card class="project-header" v-if="!project">
        <q-card-section>
            <div class="text-h6 text-primary">Loading project...</div>
        </q-card-section>
    </q-card>
    <q-card class="project-header" v-else>
        <q-card-section class="bg-primary text-white q-pa-sm">
            <div class="text-h6 row items-center"><q-icon name="folder" size="28px" class="q-mr-sm" /> {{project.name}}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
            <div class="row">
                <div class="col-4">
                    <div class="row">
                        <div class="col-3 text-weight-bold">ID:</div>
                        <div class="col">{{project.id}}</div>
                    </div>
                    <div class="row">
                        <div class="col-3 text-weight-bold">Team:</div>
                        <div class="col">{{project.team}}</div>
                    </div>
                    <div class="row">
                        <div class="col-3 text-weight-bold">Description:</div>
                        <div class="col">{{project.description}}</div>
                    </div>
                    <div class="row">
                        <div class="col-3 text-weight-bold">Tags:</div>
                        <div class="col">
                            <div class="tag-icon flex inline" v-for="tag in project.tags" :key="tag.value">
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
                            :rows="project.properties"
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
    <q-card class="project-body">
        <ExperimentList :projectId="projectId" ></ExperimentList>
    </q-card>
</template>

<style scoped lang="sass">
    @import "src/css/quasar.variables"

    .breadcrumb
        margin: 12px
        margin-bottom: 13px
    .project-header
        margin: 10px
    .project-body
        margin: 10px
    .action-button
        margin: 3px
</style>

<script>
    import { computed } from 'vue'
    import { useStore } from 'vuex'
    import { useRoute } from 'vue-router'

    import ExperimentList from "@/components/widgets/ExperimentList.vue"

    const propertyColumns = [
        { name: 'key', align: 'left', label: 'Name', field: 'key', sortable: true },
        { name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true }
    ]

    export default {
        name: 'Project',
        components: {
            ExperimentList
        },
        setup() {
            const store = useStore()
            const route = useRoute()

            const projectId = parseInt(route.params.id);
            const project = computed(() => store.getters['projects/getById'](projectId))
            if (!store.getters['projects/isLoaded'](projectId)) {
                store.dispatch('projects/loadById', projectId)
            }

            return {
                projectId,
                project,
                propertyColumns
            }
        }
    }
</script>
