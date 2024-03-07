<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 30vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="drive_file_move" color="primary" text-color="white"/>
        Move Plate(s)
      </q-card-section>
      <q-card-section class="text-subtitle2">
        Move selected plate(s) to another experiment within the same project.
      </q-card-section>
      <q-separator inset/>
      <q-card-section>
        <q-input label="Current experiment" v-model="currentExperiment.name" readonly dense/>
        <q-select label="New experiment" :options="props.experiments" option-label="name" v-model="destinationExperiment" dense/>
      </q-card-section>
      <q-card-section>
        <div class="q-pb-md">Selected plate(s) to move:</div>
        <q-list dense bordered>
          <q-item v-for="plate in props.plates" :key="plate.id">
            <q-item-section avatar>
              <q-icon color="primary" name="view_module" />
            </q-item-section>
            <q-item-section>{{ plate.barcode }} ({{plate.id}})</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn label="Move" color="primary" v-close-popup @click="movePlates"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>

import {computed, onMounted, ref} from "vue";

const props = defineProps(['show', 'plates', 'experiment', 'experiments'])
const emits = defineEmits(['update:show', 'movePlates']);

const currentExperiment = ref(props.experiment)
const destinationExperiment = ref()

const showDialog = computed({
  get: () => props.show,
  set: (v) => emits('update:show', v)
});

const movePlates = () => {
  emits("movePlates", destinationExperiment.value)
}

</script>
