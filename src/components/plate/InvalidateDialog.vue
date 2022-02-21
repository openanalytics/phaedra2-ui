<template>
  <q-dialog v-model="showDialog" persistent>
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
          <q-input v-model="reason" filled type="textarea"/>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn flat label="Invalidate" disable v-if="reason.length===0"
               v-close-popup/>
        <q-btn flat label="Invalidate" v-if="reason.length>0"
               @click="invalidate(reason)" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

import {ref} from "vue";
import {useStore} from "vuex";

export default {
  name: 'InvalidateDialog',
  props: {
    plateId: Number,
    experimentId: Number
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const store = useStore();
    return {
      showDialog: ref(false),
      reason: ref(''),
      invalidate: (reason) => {
        const invalidatePlate = {
          id: props.plateId,
          invalidatedReason: reason,
          validationStatus: 'INVALIDATED',
          experimentId: props.experimentId
        }
        store.dispatch('plates/editPlate', invalidatePlate)
        emit('update:show', false)
      }
    }
  }
}
</script>
