<template>
  <q-dialog persistent>
    <q-card style="min-width: 30vw">
      <q-card-section style="width: 100%; padding: 4px">
        <div style="width: 100%" class="row align-center text-h5 q-mb-xs">
          <div class="row">
            <q-icon name="delete" size="md" class="q-mr-sm"/>
            <div style="align-items: baseline">
              <span> Delete Channel </span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <span>Are you sure you want to delete the channel <b>{{ channel.name }}</b>?</span>
        </div>
      </q-card-section>
      <q-card-actions class="text-primary float-right">
        <q-btn label="Cancel" icon="cancel" flat v-close-popup/>
        <q-btn label="Delete" icon="delete" color="accent" v-close-popup @click="confirmDelete"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useMeasurementStore} from "@/stores/measurement";

const props = defineProps({
  configId: Number,
  channelNr: Number
});

const measurementStore = useMeasurementStore()
const channel = ref({})
onMounted(() => {
  channel.value = measurementStore.renderConfig?.config.channelConfigs[props.channelNr - 1] ?? {}
})

const confirmDelete = () => {
  measurementStore.renderConfig?.config.channelConfigs.splice(props.channelNr - 1, 1);
  measurementStore.updateRenderConfig()
};
</script>
