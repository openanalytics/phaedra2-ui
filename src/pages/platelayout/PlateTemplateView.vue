<template>
  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md" v-if="!editdialog">
      <div class="text-h6 q-px-sm oa-section-title" v-if="!plateTemplate">
        Loading plate...
      </div>
      <div v-else>
        <div class="row text-h6 items-center q-px-sm oa-section-title">
          <q-icon name="border_outer" class="q-mr-sm"/>
          {{ plateTemplate.name }}
        </div>
        <div class="row col-4 q-pa-lg oa-section-body">
          <div class="col col-4">
            <div class="row">
              <div class="col-3 text-weight-bold">ID:</div>
              <div class="col">{{ plateTemplate.id }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Dimensions:</div>
              <div class="col">{{ plateTemplate.rows }} x {{ plateTemplate.columns }} ({{ plateTemplate.rows * plateTemplate.columns }} wells)</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Description:</div>
              <div class="col">{{ plateTemplate.description }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Tags:</div>
              <div class="col">
                <div class="tag-icon flex inline" v-for="tag in plateTemplate.tags" :key="tag.tag">
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
                    :rows="plateTemplate.properties"
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
              <q-btn size="sm" color="primary" icon="edit" class="oa-button-edit" label="Edit"
                     @click="editdialog = true"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete"
                     @click="deletedialog = true"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="sell" class="oa-button-tag" label="Add Tag"
                     @click="prompt = true"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="plateTemplate">
      <well-grid :plate="plateTemplate" :gridType="layout"></well-grid>
    </div>

    <q-dialog v-model="deletedialog" persistent>
      <q-card style="min-width: 30vw">
        <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
          <q-avatar icon="delete" color="primary" text-color="white"/> Delete Template
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-10">
              <span>Are you sure you want to delete the template <b>{{plateTemplate.name}}</b>?</span><br/>
              <span>Type <span style="font-weight: bold">{{plateTemplate.name}}</span> and press the button to confirm:</span><br/>
              <q-input dense v-model="plateTemplateName" autofocus/>
              <br>
              <span class="text-accent">WARNING: The template and associated data will be deleted!</span>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <router-link :to="{ name: 'dashboard'}" class="nav-link">
            <q-btn label="Delete template" color="accent" v-if="plateTemplate.name==plateTemplateName" v-close-popup
                   @click="deletePlateTemplate"/>
          </router-link>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
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
  padding-bottom: 10px;
}
</style>


<script>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'

import Tag from "@/components/tag/Tag";
import WellGrid from "../plate/WellGrid";
import {useRoute} from "vue-router";
const propertyColumns = [
  {name: 'key', align: 'left', label: 'Name', field: 'key', sortable: true},
  {name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true}
]

export default {
  name: 'PlateTemplate',
  components: {
    WellGrid,
    Tag
  },
  methods: {
    deletePlateTemplate() {
      this.$store.dispatch('templates/deletePlateTemplate', this.plateTemplate.id)
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const plateTemplateId = parseInt(route.params.id);

    store.dispatch('templates/loadById', plateTemplateId);

    const plateTemplate = computed(() => store.getters['templates/getCurrentPlateTemplate']());
    //store.dispatch('plates/loadPlateTags', plateTemplateId)

    return {
      plateTemplate,
      propertyColumns,
      activeTab: ref('plate_layout'),
      layout: WellGrid.GRID_TYPE_LAYOUT
    }
  },
  data() {
    return {
      plateTag: ref(""),
      prompt: ref(false),
      plateTemplateName: ref(""),
      deletedialog: ref(false),
      editdialog: false,
    }
  }
}
</script>