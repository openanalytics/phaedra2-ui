<template>
  <q-breadcrumbs class="breadcrumb" v-if="plate && experiment && project">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="project.name" icon="folder" :to="'/project/' + project.id"/>
    <q-breadcrumbs-el :label="experiment.name" icon="science" :to="'/experiment/' + experiment.id"/>
    <q-breadcrumbs-el :label="plate.barcode" icon="view_module"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">
      <div class="text-h6 q-px-sm oa-section-title" v-if="!plate">
        Loading plate...
      </div>
      <div v-else>
        <div class="row text-h6 items-center q-px-sm oa-section-title">
          <q-icon name="view_module" class="q-mr-sm"/>
          {{ plate.barcode }}
        </div>
        <div class="row col-4 q-pa-lg oa-section-body">
          <div class="col col-4">
            <div class="row">
              <div class="col-3 text-weight-bold">ID:</div>
              <div class="col">{{ plate.id }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Dimensions:</div>
              <div class="col">{{ plate.rows }} x {{ plate.columns }} ({{ plate.rows * plate.columns }} wells)</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Description:</div>
              <div class="col">{{ plate.description }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Tags:</div>
              <div class="col">
                <div class="tag-icon flex inline" v-for="tag in plate.tags" :key="tag.tag">
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

          <div class="col col-4">
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="edit" class="oa-button-edit" label="Edit" @click="editdialog = true"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete" @click="deletedialog = true"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="sell" class="oa-button-tag" label="Add Tag" @click="prompt = true"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="q-pa-md" v-if="plate">
      <q-tabs
          inline-label dense no-caps
          align="left"
          class="q-px-sm oa-section-title"
      >
        <q-route-tab :to="'/plate/' + plate.id" icon="view_module" label="Layout"/>
        <q-route-tab :to="'/plate/' + plate.id + '/measurements'" icon="text_snippet" label="Measurements"/>
        <q-route-tab :to="'/plate/' + plate.id + '/heatmap'" icon="view_module" label="Heatmap"/>
        <q-route-tab :to="'/plate/' + plate.id + '/wells'" icon="table_rows" label="Well List"/>
      </q-tabs>
      <div class="row oa-section-body">
        <router-view class="router-view" :plate="plate"></router-view>
      </div>
    </div>

    <q-dialog v-model="prompt" persistent>
      <q-card>
        <q-card-section style="min-width: 350px">
          <div class="text-h6">Tag:</div>
        </q-card-section>

        <q-card-section>
          <q-input dense v-model="plateTag" autofocus @keyup.enter="prompt = false"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add tag" v-close-popup @click="onClick"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deletedialog" persistent>
      <q-card style="min-width: 30vw">
        <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
          <q-avatar icon="delete" color="primary" text-color="white"/> Delete Plate
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-10">
              <span>Are you sure you want to delete the plate <b>{{plate.barcode}}</b>?</span><br/>
              <span>Type <span style="font-weight: bold">{{plate.barcode }}</span> and press the button to confirm:</span><br/>
              <q-input dense v-model="plateName" autofocus/>
              <br>
              <span class="text-accent">WARNING: The plate and associated data will be deleted!</span>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <router-link :to="'/experiment/' + experiment.id" class="nav-link">
            <q-btn label="Delete plate" color="accent" v-if="plate.barcode==plateName" v-close-popup
                 @click="deletePlate"/>
          </router-link>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <plateEdit v-model:show="editdialog"></plateEdit>
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
import {computed, watch, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'

import Tag from "@/components/tag/Tag";
import PlateEdit from "./PlateEdit";

const propertyColumns = [
  {name: 'key', align: 'left', label: 'Name', field: 'key', sortable: true},
  {name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true}
]

export default {
  name: 'Plate',
  components: {
    Tag,
    PlateEdit
  },
  methods: {
    onClick() {
      const tagInfo = {
        objectId: this.plate.id,
        objectClass: "PLATE",
        tag: this.plateTag
      }

      this.$store.dispatch('plates/tagPlate', tagInfo)
    },
    addMeasurement() {
      const plateMeasurement = {
        plateId: this.plate,
        measurementId: this.selectedMeas.id,
        linkedBy: 'sberberovic',
        linkedOn: new Date()
      }
      this.$store.dispatch('plates/addMeasurement', plateMeasurement)
    },
    deletePlate() {
      this.$store.dispatch('plates/deletePlate', this.plate)
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const plateId = parseInt(route.params.id);
    store.dispatch('plates/loadById', plateId);

    const plate = computed(() => store.getters['plates/getCurrentPlate']());
    const experiment = computed(() => store.getters['experiments/getById'](plate.value.experimentId));
    const project = computed(() => store.getters['projects/getById'](experiment.value.projectId));

    // Once the plate has loaded, make sure the parent experiment gets loaded too.
    watch(plate, (plate) => {
      if (!store.getters['experiments/isLoaded'](plate.experimentId)) {
        store.dispatch('experiments/loadById', plate.experimentId);
      }
    })

    return {
      plate,
      experiment,
      project,
      propertyColumns,
      activeTab: ref('plate_layout')
    }
  },
  data() {
    return {
      plateTag: ref(""),
      prompt: ref(false),
      plateName: ref(""),
      deletedialog: ref(false),
      editdialog: false,
    }
  }
}
</script>
