<template>
  <q-breadcrumbs class="breadcrumb" v-if="plate && experiment && project">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="project.name" icon="folder" :to="'/project/' + project.id"/>
    <q-breadcrumbs-el :label="experiment.name" icon="science" :to="'/experiment/' + experiment.id"/>
    <q-breadcrumbs-el :label="plate.barcode" icon="view_module"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md" v-if="!editdialog">
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
                  <Tag :tagInfo="tag" :objectInfo="plate" :objectClass="'PLATE'"></Tag>
                </div>
              </div>
            </div>
          </div>

          <div class="col col-4">
            <PropertyTable :objectInfo="plate" :objectClass="'PLATE'"/>
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

    <edit-plate v-model:show="editdialog" v-model:plate="plate"></edit-plate>

    <div class="q-pa-md" v-if="plate">
      <q-tabs
          inline-label dense no-caps
          align="left"
          class="q-px-sm oa-section-title"
          v-model="activeTab"
      >
        <q-tab name="layout" icon="view_module" label="Layout"/>
        <q-tab name="measurements" icon="text_snippet" label="Measurements"/>
        <q-tab name="heatmap" icon="view_module" label="Heatmap"/>
        <q-tab name="wells" icon="table_rows" label="Well List"/>
      </q-tabs>
      <div class="row oa-section-body">
        <q-tab-panels v-model="activeTab" animated style="width: 100%">
          <q-tab-panel name="layout" icon="view_module" label="Layout">
            <WellGrid :plate="plate" grid-type="layout"/>
          </q-tab-panel>
          <q-tab-panel name="measurements" icon="view_module" label="Layout">
            <MeasList :plate="plate" />
          </q-tab-panel>
          <q-tab-panel name="heatmap" icon="view_module" label="Layout">
            <WellGrid :plate="plate" grid-type="heatmap"/>
          </q-tab-panel>
          <q-tab-panel name="wells" icon="view_module" label="Layout">
            <WellList :plate="plate" />
          </q-tab-panel>
        </q-tab-panels>
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
import {computed, ref, watch} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'

import Tag from "@/components/tag/Tag";
import EditPlate from "./EditPlate";
import PropertyTable from "@/components/property/PropertyTable";
import WellGrid from "@/pages/plate/WellGrid";
import MeasList from "@/pages/plate/MeasList";
import WellList from "@/pages/plate/WellList";

export default {
  name: 'Plate',
  components: {
    WellList,
    MeasList,
    WellGrid,
    Tag,
    EditPlate,
    PropertyTable
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
    const plate = computed(() => store.getters['plates/getCurrentPlate']());
    const experiment = computed(() => store.getters['experiments/getCurrentExperiment']());
    const project = computed(() => store.getters['projects/getCurrentProject']());
    store.dispatch('plates/loadById', plateId);

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
      activeTab: ref('layout')
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