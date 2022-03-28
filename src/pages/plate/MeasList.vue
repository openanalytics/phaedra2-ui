<template>
  <q-table
      table-header-class="text-dark"
      flat square
      :rows="plateMeasurements"
      :columns="columns"
      row-key="id"
      no-data-label="No measurements associated with this plate"
  >
    <template v-slot:top-right>
      <q-btn dense color="primary" label="Set measurement" @click="addMeasDialog">
      </q-btn>
    </template>
    <template v-slot:body-cell="props">
      <q-td :props="props" :class="props.row.active ? 'text-dark' : 'text-grey'">
        {{ props.value }}
      </q-td>
    </template>
    <template v-slot:body-cell-dimensions="props">
      <q-td :props="props">
        {{ props.row.rows }} x {{ props.row.columns }}
      </q-td>
    </template>
    <template v-slot:body-cell-active="props">
      <q-td :props="props">
        <q-toggle
            :model-value="props.row.active"
            @update:model-value="val => openConfirmDialog(val, props.row)"/>
      </q-td>
    </template>
  </q-table>

  <q-dialog v-model="openMeasDialog" square persistent class="q-gutter-sm">
    <q-card>
      <q-card-section style="min-width: 350px">
        <div class="text-h6">Select measurements:</div>
      </q-card-section>

      <q-card-section class="row">
        <div class="col col-12">
          <q-select v-model="selectedMeasurement" :options="availableMeasurements"
                    option-label="barcode"
                    option-value="id"/>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" color="primary" flat v-close-popup/>
        <q-btn label="Save" color="primary" v-close-popup @click="addMeasurement"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">Are you sure you want to change the active measurement?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Yes" color="primary" v-close-popup @click="updateActiveState"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {ref} from 'vue'
// import {useStore} from 'vuex'
import FormatUtils from "@/lib/FormatUtils";

const columns = [
  {name: 'active', align: 'left', label: 'Active?', field: 'active', sortable: true},
  {name: 'measurementId', align: 'left', label: 'ID', field: 'measurementId', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'dimensions', align: 'left', label: 'Dimensions', field: 'dimensions', sortable: false},
  {name: 'wellColumns', align: 'left', label: 'Well Columns', field: 'wellColumns', sortable: true, format: val => `${val?.length || 0}` },
  {name: 'subWellColumns', align: 'left', label: 'SubWell Columns', field: 'subWellColumns', sortable: true, format: val => `${val?.length || 0}` },
  {name: 'imageChannels', align: 'left', label: 'Image Channels', field: 'imageChannels', sortable: true, format: val => `${val?.length || 0}` },
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true}
]

export default {
  props: {
    plate: Object
  },
  setup() {
    return {
      columns
    }
  },
  data() {
    return {
      openMeasDialog: ref(false),
      confirm: ref(false),
      selectedMeasurement: ref(),
      newActiveMeas: ref()
    }
  },
  methods: {
    addMeasDialog() {
      this.$store.dispatch("measurements/loadAvailableMeasurements", this.plate);
      this.openMeasDialog = true;
    },
    addMeasurement() {
      const activePlateMeasurement = {
        plateId: this.plate.id,
        measurementId: this.selectedMeasurement.id,
        active: true,
        linkedBy: "sasa.berberovic", //TODO: select logged in username
        linkedOn: new Date(),
        ...this.selectedMeasurement
      };

      this.$store.dispatch('measurements/addMeasurement', activePlateMeasurement);
    },
    openConfirmDialog(active, { plateId, measurementId}) {
      const current = this.$store.getters['measurements/getActivePlateMeasurement'](plateId);
      this.newActiveMeas = {active, plateId, measurementId};
      if (current && active) {
        this.confirm = true;
      } else {
        this.updateActiveState();
      }
    },
    updateActiveState() {
      console.log("Change active state");
      if (this.newActiveMeas)
        this.$store.dispatch('measurements/setActiveMeasurement',  this.newActiveMeas);
    }
  },
  computed: {
    plateMeasurements() {
      return this.$store.getters['measurements/getPlateMeasurements'](this.plate.id);
    },
    availableMeasurements() {
      return this.$store.getters['measurements/getAll']();
    }
  }
}

</script>
