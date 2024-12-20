<template>
  <q-dialog @hide="clearData">
    <q-card style="min-width: 30vw">
      <q-card-section style="width: 100%; padding: 4px">
        <div style="width: 100%" class="row align-center text-h5 q-mb-xs">
          <div class="row">
            <q-icon name="palette" size="md" class="q-mr-sm"/>
            <div style="align-items: baseline">
              <span> New Render Config </span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-1 row items-center">
            <q-icon name="edit" size="md" class="q-mr-sm"/>
          </div>
          <div class="col">
            <q-input v-model="newConfig.name" autofocus placeholder="Name" dense/>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="float-right">
        <q-btn flat label="Cancel" color="primary" v-close-popup/>
        <q-btn label="Create" color="primary" v-close-popup @click="saveNewConfig"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from "vue-router"

const store = useStore();
const router = useRouter();

const newConfig = ref({
  name: "",
  config: {
    channelConfigs: []
  }
});
const saveNewConfig = () => {
  store.dispatch('measurements/createRenderConfig', newConfig.value)
  .then(cfg => router.push('/datacapture/render-config/' + cfg.id));
};

const clearData = () => {
  newConfig.value.name = "";
  newConfig.value.config.channelConfigs = [];
};
</script>
