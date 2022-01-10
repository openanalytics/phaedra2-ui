<template>
  <q-dialog v-model="props.show" persistent>
    <q-card v-if="plate" style="min-width: 30vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="check_circle" color="primary" text-color="white"/>
        Approve Plate
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-10">
            <span>Are you sure you want to approve the plate <b>{{plate.barcode}}</b>?</span><br/>
            <span>Type <span
                style="font-weight: bold">{{ plate.barcode }}</span> and press the button to confirm:</span><br/>
            <q-input dense v-model="plateName" autofocus/><br>
            <span class="text-accent">WARNING: The plate and associated data can not be edited after approval!</span>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn flat label="Approve" disable v-if="plate.barcode!==plateName"
               v-close-popup/>
        <q-btn flat label="Approve" v-if="plate.barcode===plateName"
               @click="approve" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

import {computed} from "vue";
import {useStore} from "vuex";

export default {
  name: 'ApproveDialog',
  methods: {
    approve() {
      this.editedPlate.id = this.props.plateId
      this.editedPlate.approvalStatus = 'APPROVED'
      this.editedPlate.experimentId = this.props.experimentId
      this.$store.dispatch('plates/editPlate', this.editedPlate)
      this.$emit('update:show', false)
    }
  },
  setup(props) {
    const store = useStore()
    const plate= computed(()=> store.getters['plates/getById'](props.plateId))
    return {
      props,
      plate
    }
  },
  data() {
    return {
      editedPlate: {
        id: null,
        approvalStatus: null,
        experimentId: null
      },
      plateName: ''
    }
  },
  props: ['show', 'plateId', 'experimentId'],
  emits: ['update:show']

}
</script>