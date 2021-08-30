<template>
    <q-card class="project-header" v-if="!project">
        <q-card-section>
            <div class="text-h6 text-primary">Loading project...</div>
        </q-card-section>
    </q-card>
    <q-card class="project-header" v-else>
        <q-card-section>
            <div class="text-h6 text-primary">{{project.name}}</div>
            <div class="row">
                <div class="col-5">
                <div class="row">
                    <div class="col-2 text-weight-bold">ID:</div>
                    <div class="col">{{project.id}}</div>
                </div>
                <div class="row">
                    <div class="col-2 text-weight-bold">Description:</div>
                    <div class="col">{{project.description}}</div>
                </div>
                <div class="row">
                    <div class="col-2 text-weight-bold">Team:</div>
                    <div class="col">{{project.team}}</div>
                </div>
                <div class="row">
                    <div class="col-2 text-weight-bold">Tags:</div>
                    <div class="col">
                    <q-chip color="orange" text-color="white" label="Experimental" />
                    </div>
                </div>
                </div>
                <div class="col-5">
                <div class="row">
                    <div class="col-2 text-weight-bold">Properties:</div>
                    <div class="col">

                    </div>
                </div>
                </div>
                <div class="col-2">
                <div class="row plate-button"><q-btn size="sm" rounded color="primary" label="Edit" /></div>
                <div class="row plate-button"><q-btn size="sm" rounded color="primary" label="Delete" /></div>
                <div class="row plate-button"><q-btn size="sm" rounded color="primary" icon="more_horiz" /></div>
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<style>
    .project-header {
        margin: 10px;
    }
    .project-body {
        margin: 10px;
    }
</style>

<script>
    import { computed } from 'vue'
    import { useStore } from 'vuex'
    import { useRoute } from 'vue-router'

    export default {
        name: 'Project',
        setup() {
            const store = useStore()
            const route = useRoute()

            const projectId = route.params.id;
            const project = computed(() => store.getters['projects/getById'](projectId))
            if (!store.getters['projects/isLoaded'](projectId)) {
                store.dispatch('projects/loadById', projectId)
            }

            return {
                project
            }
        }
    }
</script>
