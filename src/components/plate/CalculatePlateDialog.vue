<template>
  <q-dialog v-model="props.show" persistent>
    <q-card style="min-width: 50vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="calculate" color="primary" text-color="white"/>
        Start Plate Calculation
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-10">
            <span>Select the protocol that will be used for the calculation.</span><br><br>
          </div>
        </div>
        <div class="q-pa-md">
          <protocol-selectable-list v-model:selected="selected"></protocol-selectable-list>
        </div>
        <span v-if="!activeMeasurement" class="text-accent">This plate has no active measurement.</span>
        <span v-if="!checkDimensions()" class="text-accent">The plate and measurement dimensions are different.</span>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn flat label="Calculate" disable v-if="!activeMeasurement||!selected.length>0||!checkDimensions()"
               v-close-popup/>
        <q-btn flat label="Calculate" v-if="activeMeasurement&&selected.length>0&&checkDimensions()"
               @click="calculatePlate" v-close-popup/>
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
      this.calculation.measId = this.activeMeasurement.measurementId
      this.calculation.plateId = this.plateId
      this.calculation.protocolId = this.selected[0].id
      this.$store.dispatch('calculations/startCalculation', this.calculation)
      this.$emit('update:show', false)
    },
    checkDimensions() {
      if (this.activeMeasurement) {
        const meas = this.store.getters['plates/getActiveMeasurement'](this.activeMeasurement.measurementId)
        if (meas && meas.rows === this.plate.rows && meas.columns === this.plate.columns) {
          return true
        }
        return false
      }
      return true
    }
  },
  setup(props) {
    const store = useStore()

    const activeMeasurement = computed(() => store.getters['plates/getActiveMeasurement']())
    const plate = computed(() => store.getters['plates/getCurrentPlate']())
    // store.dispatch('measurements/loadAll')
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
