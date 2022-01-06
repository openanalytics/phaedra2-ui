<template>
  <q-breadcrumbs class="breadcrumb" v-if="experiment && project">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="project.name" icon="folder"
                      :to="{ name: 'project', params: { id: experiment.projectId } }"/>
    <q-breadcrumbs-el :label="experiment.name" icon="science"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md" v-if="!editdialog">

      <div class="text-h6 q-px-sm oa-section-title" v-if="!experiment">
        Loading experiment...
      </div>

      <div v-else>
        <div class="row text-h6 items-center q-px-sm oa-section-title">
          <q-icon name="science" class="on-left"/>{{ experiment.name }}
        </div>

        <div class="row q-pa-md oa-section-body">

          <div class="col-4 q-gutter-xs">
            <div class="row">
              <div class="col-3 text-weight-bold">ID:</div>
              <div class="col">{{ experiment.id }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Description:</div>
              <div class="col">{{ experiment.description }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Tags:</div>
              <div class="col">
                <div class="tag-icon flex inline" v-for="tag in experiment.tags" :key="tag">
                  <Tag :tagInfo="tag" :objectInfo="experiment" :objectClass="'EXPERIMENT'"/>
                </div>
              </div>
            </div>
          </div>

          <div class="col-4">
            <PropertyTable :objectInfo="experiment" :objectClass="'EXPERIMENT'"/>
          </div>

          <div class="col-4">
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

    <edit-experiment v-model:show="editdialog" v-model:experiment="experiment"></edit-experiment>

    <div class="q-pa-md" v-if="experiment">
      <q-tabs
          v-model="activeTab"
          inline-label dense no-caps
          align="left"
          class="q-px-sm oa-section-title"
      >
        <q-tab name="overview" icon="table_rows" label="Overview"/>
        <q-tab name="statistics" icon="functions" label="Statistics"/>
        <q-tab name="heatmaps" icon="view_module" label="Heatmaps"/>
      </q-tabs>
      <div class="row oa-section-body">
<!--        <router-view class="router-view" :experiment="experiment" @message="newPlateTab=true"></router-view>-->
        <!--        <router-view v-model:experiment="experiment" v-model:newPlateTab="newPlateTab"></router-view>-->
        <q-tab-panels v-model="activeTab" animated style="width: 100%">
          <q-tab-panel name="overview">
            <PlateList :experiment="experiment" v-model:newPlateTab="newPlateTab"/>
          </q-tab-panel>
          <q-tab-panel name="statistics">
            <PlateStatsList :experiment="experiment"/>
          </q-tab-panel>
          <q-tab-panel name="heatmaps">
            <PlateGrid :experiment="experiment"/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <div class="q-pa-md" v-if="newPlateTab">
      <div class="row text-h6 items-center q-px-md oa-section-title">
        <q-icon name="add" class="q-pr-sm"/>
        New Plate
      </div>
      <div class="row col-12 q-pa-md oa-section-body">
        <div class="row" style="min-width: 90vw">
          <div class="col col-5">
            <q-input v-model="newPlate.barcode" square autofocus label="Barcode"></q-input>
            <q-input v-model="newPlate.description" square label="Description"></q-input><br>
            <q-btn flat label="Cancel" color="primary" @click="newPlateTab = false"/>

          </div>
          <div class="col col-1">

          </div>
          <div class="col col-4">
            <q-input v-model="newPlate.rows" square label="Rows"></q-input>
            <q-input v-model="newPlate.columns" square label="Columns"></q-input><br>
            <q-btn align="right" label="Add plate" v-close-popup color="primary" @click="createNewPlate"/>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="prompt" persistent>
      <q-card>
        <q-card-section style="min-width: 350px">
          <div class="text-h6">Tag:</div>
        </q-card-section>

        <q-card-section>
          <q-input dense v-model="experimentTag" autofocus @keyup.enter="prompt = false"/>
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
          <q-avatar icon="delete" color="primary" text-color="white"/> Delete Experiment
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-10">
              <span>Are you sure you want to delete the experiment <b>{{experiment.name}}</b>?</span><br/>
              <span>Type <span
                  style="font-weight: bold">{{ experiment.name }}</span> and press the button to confirm:</span><br/>
              <q-input dense v-model="experimentName" autofocus/><br>
              <span class="text-accent">WARNING: The experiment, plates and associated data will be deleted!</span>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn label="Delete experiment" color="accent" v-if="experiment.name==experimentName" v-close-popup
                 @click="deleteExperiment"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style lang="scss">

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
import {ref, computed} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'

import Tag from "@/components/tag/Tag";
import EditExperiment from "./EditExperiment";
import PropertyTable from "@/components/property/PropertyTable";
import PlateList from "@/pages/experiment/PlateList";
import PlateStatsList from "@/pages/experiment/PlateStatsList";
import PlateGrid from "@/pages/experiment/PlateGrid";

export default {
  name: 'Experiment',
  components: {
    Tag,
    EditExperiment,
    PropertyTable,
    PlateList,
    PlateStatsList,
    PlateGrid
  },
  methods: {
    onClick() {
      const tagInfo = {
        objectId: this.experiment.id,
        objectClass: "EXPERIMENT",
        tag: this.experimentTag
      }

      this.$store.dispatch('experiments/tagExperiment', tagInfo)
    },
    createNewPlate(){
      this.newPlate.sequence = "1"
      this.newPlate.experimentId = this.experimentId
      this.$store.dispatch('plates/createNewPlate',this.newPlate)
      this.newPlateTab = false
    },
    deleteExperiment() {
      const id = this.project.id
      //disable experiment to stop page from loading experiment data and causing undefined errors
      this.experiment = false
      this.$store.dispatch('experiments/deleteExperiment', this.experimentId).then(() => {
        this.$router.push({name: 'project', params: {id: id}})
      })
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const experimentId = parseInt(route.params.id);
    const experiment = computed(() => store.getters['experiments/getCurrentExperiment']())
    // if (!experiment.value || experiment.value.id !== experimentId) {
      store.dispatch('experiments/loadById', experimentId);
    // }
    const project = computed(() => store.getters['projects/getById'](experiment.value.projectId))

    return {
      experimentId,
      experiment,
      project,
      activeTab: ref('overview')
    }
  },
  data() {
    return {
      experimentTag: ref(""),
      prompt: ref(false),
      newPlateTab: ref(false),
      newPlate: {
        barcode: null,
        description: null,
        rows: null,
        columns: null,
        sequence: null,
        experimentId: null,
        calculationStatus: "CALCULATION_NEEDED",
        validationStatus: "VALIDATION_NOT_SET",
        approvalStatus: "APPROVAL_NOT_SET",
      },
      experimentName: ref(""),
      deletedialog: ref(false),
      editdialog:ref(false)
    }
  }
}
</script>
