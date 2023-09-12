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
          <q-input v-model="reason" filled type="textarea"/>
        </div>
        <span class="text-accent">WARNING: The plate and associated data can not be edited after disapproval!</span>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn flat label="Disapprove" disable v-if="reason.length===0" v-close-popup/>
        <q-btn flat label="Disapprove" v-if="reason.length>0" @click="disapprove" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {computed, ref} from "vue";

const reason = ref("")

const props = defineProps(['show', 'plate'])
const emits = defineEmits(['update:show', 'onDisapprove'])

const showDialog = computed({
  get: () => props.show,
  set: (v) => emits('update:show', v)
});

const disapprove = () => {
  emits('update:show', false)
  emits("onDisapprove", reason)
}
</script>
