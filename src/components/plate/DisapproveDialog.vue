<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 50vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="cancel" color="primary" text-color="white"/>
        Disapprove Plate
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-10">
            <span>Provide a reason for the disapproval.</span><br><br>
          </div>
        </div>
        <div class="q-pa-md">
          <q-input
              v-model="reason"
              filled
              type="textarea"
          />
        </div>
        <span class="text-accent">WARNING: The plate and associated data can not be edited after disapproval!</span>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn flat label="Disapprove" disable v-if="reason.length===0"
               v-close-popup/>
        <q-btn flat label="Disapprove" v-if="reason.length>0"
               @click="disapprove(reason)" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

import {computed, ref} from "vue";
import {useStore} from "vuex";

export default {
  name: 'DisapproveDialog',
  props: {
    plateId: Number,
    experimentId: Number
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const store = useStore();
    return {
      plate: computed(()=> store.getters['plates/getById'](props.plateId)),
      showDialog: ref(false),
      reason: ref(''),
      disapprove: (reason) => {
        const disapprovePlate = {
          id: props.plateId,
          disapprovedReason: reason,
          approvalStatus: 'DISAPPROVED',
          experimentId: props.experimentId
        }
        store.dispatch('plates/editPlate', disapprovePlate)
        emit('update:show', false)
      }
    }
  }
}
</script>
