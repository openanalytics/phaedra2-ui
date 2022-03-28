<template>
  <q-dialog v-model="props.show" persistent>
    <q-card style="min-width: 50vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="calculate" color="primary" text-color="white"/>
        Calculate Plate
      </q-card-section>

      <q-card-section v-if="activeMeasurement && checkDimensions()">
        <div class="row">
          <div class="col-10">
            <span>Select the protocol that will be used for the calculation.</span><br><br>
          </div>
        </div>
        <div class="q-pa-md">
          <protocol-selectable-list v-model:selected="selected"></protocol-selectable-list>
        </div>
      </q-card-section>
      <q-card-section v-if="!activeMeasurement">
        <q-icon name="warning" color="negative" class="on-left"/>
        <span class="text-accent text-weight-bold">Cannot calculate: this plate has no active measurement.</span>
      </q-card-section>
      <q-card-section v-if="!checkDimensions()">
        <q-icon name="warning" color="negative" class="on-left"/>
        <span class="text-accent text-weight-bold">Cannot calculate: the plate and measurement dimensions are different.</span>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn label="Calculate" color="primary" :disable="!activeMeasurement || selected.length == 0 || !checkDimensions()" @click="calculatePlate" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

import {computed} from "vue";
import {useStore} from "vuex";
import ProtocolSelectableList from "@/components/protocol/ProtocolSelectableList";

export default {
  components: {ProtocolSelectableList},
  methods: {
    calculatePlate() {
      this.calculation.measId = this.activeMeasurement[0].measurementId
      this.calculation.plateId = this.plateId
      this.calculation.protocolId = this.selected[0].id
      this.$store.dispatch('calculations/startCalculation', this.calculation)
      this.$emit('update:show', false)
    },
    checkDimensions() {
      if (this.activeMeasurement) {
        if (this.activeMeasurement[0]
            && this.activeMeasurement[0].rows === this.plate.rows
            && this.activeMeasurement[0].columns === this.plate.columns) {
          return true
        }
        return false
      }
      return true
    }
  },
  setup(props) {
    const store = useStore()


    const plate = computed(() => store.getters['plates/getById'](props.plateId));
    const activeMeasurement = computed(() => store.getters['measurements/getActivePlateMeasurement'](props.plateId))

    // Load plate measurements
    store.dispatch('measurements/loadByPlateId', { plateId: props.plateId }, { root: true })

    return {
      props,
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

      selected: []
    }
  },
  props: ['show', 'plateId'],
  emits: ['update:show'],
  watch: {
    plateId: function (newVal) {
      this.store.dispatch('plates/loadById', newVal)
    }
  }
}
</script>
