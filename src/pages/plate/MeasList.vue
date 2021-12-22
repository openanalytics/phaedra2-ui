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
        <q-toggle :true-value="{ measId: props.row.id, active: true}" :false-value="{ measId: props.row.id, active: false}" @update:model-value="updateActiveState"/>
      </q-td>
    </template>
    <template v-slot:body-cell-dimensions="props">
      <q-td :props="props" :class="props.row.active ? 'text-dark' : 'text-grey'">
        {{ props.row.rows }} x {{ props.row.columns }}
      </q-td>
    </template>
  </q-table>
  <div class="q-mt-md">
    Active: {{ active }}
  </div>

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
import {ref, computed, onUnmounted} from 'vue'
import {useStore} from 'vuex'

const columns = [
  {name: 'active', align: 'left', label: 'Active?', field: 'active', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'dimensions', align: 'left', label: 'Dimensions', field: 'dimensions', sortable: true},
  {name: 'wellColumns', align: 'left', label: 'Well Columns', field: 'wellColumns', sortable: true},
  {name: 'subWellColumns', align: 'left', label: 'SubWell Columns', field: 'subWellColumns', sortable: true},
  {name: 'imageChannels', align: 'left', label: 'Image Channels', field: 'imageChannels', sortable: true},
  {
    name: 'createdOn',
    align: 'left',
    label: 'Created On',
    field: 'createdOn',
    sortable: true,
    format: val => `${val?.toLocaleString()}`
  },
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true}
]

export default {
  props: {
    plate: Object
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
    updateActiveState(value, evt) {
      console.log("Change active state" + evt);
      this.$store.dispatch('plates/setActiveMeasurement', this.plate.id)
    }
  },
  setup(props) {
    const store = useStore()
    const loading = ref(true)

    const availableMeasurements = computed(() => store.getters['measurements/getAll']());
    store.dispatch('measurements/loadAll');
    store.dispatch('measurements/loadPlateMeasurements', props.plate);

    const measurements = computed(() => store.getters['measurements/getPlateMeasurements'](props.plate.id))
    const activeMeasurement = measurements.value.filter(m => m.active === true);

    const unsubscribe = store.subscribe((mutation) => {
        if (mutation.type == "measurements/cacheMeasurements") {
            loading.value = false
        }
    })
    onUnmounted(() => {
        unsubscribe()
    })

    return {
      columns,
      measurements,
      availableMeasurements,
      loading,
      active: ref(activeMeasurement)
    }
  },
  data() {
    return {
      openMeasDialog: ref(false),
      selectedMeasurement: ref()
    }
  }
}

</script>
