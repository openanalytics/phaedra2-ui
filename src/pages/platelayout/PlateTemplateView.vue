<template>
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
    <div v-if="plate">
      <well-grid :plate="plate" :gridType="layout"></well-grid>
    </div>

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

import Tag from "@/components/tag/Tag";
import WellGrid from "../plate/WellGrid";
const propertyColumns = [
  {name: 'key', align: 'left', label: 'Name', field: 'key', sortable: true},
  {name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true}
]

export default {
  name: 'Plate',
  components: {
    WellGrid,
    Tag
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

    const plateId = 1;
    store.dispatch('plates/loadById', plateId);

    const plate = computed(() => store.getters['plates/getCurrentPlate']());
    store.dispatch('plates/loadPlateTags', plateId)
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
      activeTab: ref('plate_layout'),
      layout: WellGrid.GRID_TYPE_LAYOUT
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