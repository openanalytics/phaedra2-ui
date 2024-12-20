<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 30vw">
      <q-card-section style="width: 100%; padding: 4px">
        <div style="width: 100%" class="row align-center text-h5 q-mb-xs">
          <div class="row">
            <q-icon name="delete" size="md" class="q-mr-sm"/>
            <div style="align-items: baseline">
              <span> Delete Render Config </span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <span>Are you sure you want to delete the render config <b>{{ config.name }}</b>?</span>
        </div>
      </q-card-section>
      <q-card-actions class="text-primary float-right">
        <q-btn flat label="Cancel" v-close-popup/>
        <q-btn label="Delete" color="accent" v-close-popup @click="confirmDelete"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref, computed} from 'vue';
import {useMeasurementStore} from "@/stores/measurement";

const props = defineProps(['config']);

const showDialog = ref(false);

const measurementStore = useMeasurementStore()
const confirmDelete = () => {
  measurementStore.deleteRenderConfig(props.config.id)
}
</script>
