<template>
  <q-table
      table-header-class="text-dark"
      flat square
      :rows="measurements"
      :columns="columns"
      row-key="id"
      no-data-label="No measurements associated with this plate"
  >
    <template v-slot:top-right>
      <q-btn dense color="primary" label="Set measurement" @click="openMeasDialog = true">
      </q-btn>
    </template>
    <template v-slot:body-cell="props">
      <q-td :props="props" :class="props.row.active ? 'text-dark' : 'text-grey'">
        {{ props.value }}
      </q-td>
    </template>
    <template v-slot:body-cell-active="props">
      <q-td :props="props">
        <q-icon name="link" v-show="props.row.active"/>
        <q-toggle
            :model-value="props.row.active"
            @input="() => updateActiveState()"/>
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
                    option-label="name"
                    option-value="id"/>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Save" color="primary" v-close-popup @click="addMeasurement"/>
        <q-btn label="Cancel" color="primary" flat v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import {ref} from 'vue'
// import {useStore} from 'vuex'

const columns = [
  {name: 'active', align: 'left', label: 'Active?', field: 'active', sortable: true},
  {name: 'id', align: 'left', label: 'ID', field: 'measurementId', sortable: true},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true}
]

// {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
// {name: 'dimensions', align: 'left', label: 'Dimensions', field: 'dimensions', sortable: true},
// {name: 'wellColumns', align: 'left', label: 'Well Columns', field: 'wellColumns', sortable: true},
// {name: 'subWellColumns', align: 'left', label: 'SubWell Columns', field: 'subWellColumns', sortable: true},
// {name: 'imageChannels', align: 'left', label: 'Image Channels', field: 'imageChannels', sortable: true},
// {
//   name: 'createdOn',
//   align: 'left',
//   label: 'Created On',
//   field: 'createdOn',
//   sortable: true,
//   format: val => `${val?.toLocaleString()}`
// },

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
    }
  },
  methods: {
    addMeasurement() {
      const activePlateMeasurement = {
        plateId: this.plate.id,
        measurementId: this.selectedMeasurement.id,
        active: true,
        linkedBy: "sasa.berberovic", //TODO: select logged in username
        linkedOn: new Date()
      };

      this.$store.dispatch('plates/addMeasurement', activePlateMeasurement);
    },
    updateActiveState() {
      console.log("Change active state");
      // this.$store.dispatch('plates/setActiveMeasurement', value);
    }
  },
  computed: {
    measurements() {
      return this.$store.getters['plates/getCurrentPlateMeasurements']();
    },
  }
}

</script>
