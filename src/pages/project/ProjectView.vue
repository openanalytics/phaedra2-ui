<template>
    <q-breadcrumbs class="breadcrumb" v-if="project">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
        <q-breadcrumbs-el :label="project.name" icon="folder" />
    </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <div class="text-h6 q-px-sm oa-section-title" v-if="!project">
          Loading project...
      </div>
      <div v-else>
        <div class="row text-h6 items-center q-px-sm oa-section-title">
          <q-icon name="folder" class="q-pr-sm"/>{{ project.name }}
        </div>

        <div class="row col-4 q-pa-lg oa-section-body">
            <div class="col col-4">
              <div class="row">
                <div class="col-3 text-weight-bold">ID:</div>
                <div class="col">{{ project.id }}</div>
              </div>
              <div class="row">
                <div class="col-3 text-weight-bold">Team:</div>
                <div class="col">{{ project.team }}</div>
              </div>
              <div class="row">
                <div class="col-3 text-weight-bold">Description:</div>
                <div class="col">{{ project.description }}</div>
              </div>
              <div class="row">
                <div class="col-3 text-weight-bold">Tags:</div>
                <div class="col">
                  <div class="tag-icon flex inline" v-for="tag in project.tags" :key="tag.tag">
                    <Tag :tagInfo="tag"></Tag>
                  </div>
                </div>
              </div>
            </div>

            <div class="col col-4">
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

            <div class="col col-4">
              <div class="row justify-end action-button">
                <q-btn size="sm" rounded color="primary" label="Edit"/>
              </div>
              <div class="row justify-end action-button">
                <q-btn size="sm" rounded color="primary" label="Delete"/>
              </div>
              <div class="row justify-end action-button">
                <q-btn size="sm" rounded color="primary" label="Add Tag" @click="prompt = true"/>
              </div>
            </div>
          </div>
        </div>
      </div>

    <div class="q-pa-md">
      <ExperimentList :projectId="projectId"></ExperimentList>
    </div>

    <q-dialog v-model="prompt" persistent>
      <q-card>
        <q-card-section style="min-width: 350px">
          <div class="text-h6">Tag:</div>
        </q-card-section>

        <q-card-section>
          <q-input dense v-model="projectTag" autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add tag" v-close-popup @click="onClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
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
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'

import ExperimentList from "@/pages/experiment/ExperimentList.vue"
import Tag from "@/components/tag/Tag"

const propertyColumns = [
  {name: 'key', align: 'left', label: 'Name', field: 'key', sortable: true},
  {name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true}
]

export default {
  name: 'Project',
  components: {
    ExperimentList,
    Tag
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const projectId = parseInt(route.params.id);
    const project = computed(() => store.getters['projects/getById'](projectId))
    if (!store.getters['projects/isLoaded'](projectId)) {
      store.dispatch('projects/loadById', projectId)
    }
    store.dispatch('projects/loadProjectsTags', projectId)

    return {
      projectId,
      project,
      propertyColumns
    }
  },
  data() {
    return {
      projectTag: ref(""),
      prompt: ref(false)
    }
  },
  methods: {
    onClick() {
      const tagInfo = {
        objectId: this.project.id,
        objectClass: "PROJECT",
        tag: this.projectTag
      }

      this.$store.dispatch('projects/tagProject', tagInfo)
    }
  }
}
</script>
