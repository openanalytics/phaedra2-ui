<template>
  <q-dialog v-model="props.show" persistent>
    <q-card style="min-width: 50vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="settings" color="primary" text-color="white"/>
        Configure Columns
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-10">
            <span>Configure the displayed columns of the table.</span><br><br>
          </div>
        </div>
          <div class="q-pa-md">
            <q-table
                table-header-class="text-white bg-primary"
                :rows="protocols"
                :columns="columns"
                :pagination="{ rowsPerPage: 10 }"
                class="full-width"
                square
                flat
                dense
                selection="single"
                v-model:selected="selected"
            >
              <template v-slot:header="props">
                <q-tr :props="props" class="text-white bg-primary">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr class="cursor-pointer" :props="props" @click="props.selected = !props.selected">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <span v-if="!(col.name === 'select')">{{col.value }}</span>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
        </div>
        <span v-if="!activeMeasurement" class="text-accent">This plate has no active measurement.</span>
        <span v-if="!checkDimensions()" class="text-accent">The plate and measurement dimensions are different.</span>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn flat label="Calculate" disable v-if="!activeMeasurement||!selected.length>0||!checkDimensions()" v-close-popup/>
        <q-btn flat label="Calculate" v-if="activeMeasurement&&selected.length>0&&checkDimensions()" @click="calculatePlate" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

import {computed} from "vue";
import {useStore} from "vuex";

export default {
  name: 'PlateCalculateDialog',
  methods: {
    calculatePlate() {
      this.calculation.measId = this.activeMeasurement.measurementId
      this.calculation.plateId = this.plateId
      this.calculation.protocolId = this.selected[0].id
      this.$store.dispatch('calculations/startCalculation',this.calculation)
      this.$emit('update:show',false)
    },
    checkDimensions(){
      if (this.activeMeasurement) {
        const meas = this.store.getters['measurements/getById'](this.activeMeasurement.measurementId)
        if (meas&&meas.rows===this.plate.rows&&meas.columns===this.plate.columns){
          return true
        }
        return false
      }
      return true
    }
  },
  setup(props) {
    const store = useStore()
    const protocols = computed(() => store.getters['protocols/getAll']())
    if (!store.getters['protocols/isLoaded']()){
      store.dispatch('protocols/loadAll')
    }

    const activeMeasurement = computed(() => store.getters['plates/getActiveMeasurement']())
    const plate = computed(() => store.getters['plates/getCurrentPlate']())
    store.dispatch('measurements/loadAll')
    return {
      props,
      protocols,
      activeMeasurement,
      store,
      plate
    }
  },
  data() {
    return {
      calculation: {
        protocolId: null,
        plateId: null,
        measId: null
      },
      calculateDialog: this.props.show,
      columns: [
        {name: 'id', align: 'left',label: 'Id', field: 'id', sortable: true},
        {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
        {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
        {name: 'highWellType', align: 'left', label: 'High Well Type', field: 'highWellType', sortable: true},
        {name: 'lowWellType', align: 'left', label: 'Low Well Type', field: 'lowWellType', sortable: true},
      ],
      selected: []
    }
  },
  props: ['show', 'plateId'],
  emits: ['update:show'],
  watch: {
    plateId: function (newVal) {
      this.store.dispatch('plates/loadById',newVal)
    }
  }
}
</script>