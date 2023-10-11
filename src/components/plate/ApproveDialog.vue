<template>
  <q-dialog v-model="showDialog" persistent>
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

<script setup>
import {computed, ref} from "vue";

const props = defineProps(['show', 'plate'])
const emits = defineEmits(['update:show', 'onApprove'])

const plateName = ref('')

const showDialog = computed({
  get: () => props.show,
  set: (v) => emits('update:show', v)
})

const plate = computed(() => props.plate)
const approve = () => {
  emits('update:show', false)
  emits('onApprove')
}
</script>
