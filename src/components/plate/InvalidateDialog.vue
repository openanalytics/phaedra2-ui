<template>
  <q-dialog v-model="props.show" persistent>
    <q-card style="min-width: 50vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="cancel" color="primary" text-color="white"/>
        Invalidate Plate
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-10">
            <span>Provide a reason for the invalidation.</span><br><br>
          </div>
        </div>
        <div class="q-pa-md">
          <q-input
              v-model="reason"
              filled
              type="textarea"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn flat label="Invalidate" disable v-if="reason.length===0"
               v-close-popup/>
        <q-btn flat label="Invalidate" v-if="reason.length>0"
               @click="invalidate" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'InvalidateDialog',
  methods: {
    invalidate() {
      this.editedPlate.id = this.plateId
      this.editedPlate.invalidatedReason = this.reason
      this.editedPlate.validationStatus = 'INVALIDATED'
      this.editedPlate.experimentId = this.props.experimentId
      this.$store.dispatch('plates/editPlate', this.editedPlate)
      this.$emit('update:show', false)
    }
  },
  setup(props) {
    return {
      props,
    }
  },
  data() {
    return {
      editedPlate: {
        id: null,
        invalidatedReason: null,
        validationStatus: null,
        experimentId: null
      },
      reason: ''
    }
  },
  props: ['show', 'plateId', 'experimentId'],
  emits: ['update:show']

}
</script>
