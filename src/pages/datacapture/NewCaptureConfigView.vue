<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="newConfig">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench'}"/>
    <q-breadcrumbs-el label="Capture Configurations" icon="list" :to="'/datacapture/configs'"/>
    <q-breadcrumbs-el label="New Capture Configuration" icon="settings"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="New Capture Config" icon="settings">
        <div class="q-pa-sm">
          <q-form class="full-width" @submit="onSubmit" @reset="onReset">
            <div class="col">
              <q-input v-model="newConfig.name" label="Name" dense/>
              <q-input v-model="newConfig.description" label="Description" dense/>
              <q-input v-model="newConfig.version" label="Version" mask="#.#.#" hint="Mask: #.#.#, Example: 1.0.0" dense />
            </div>
            <div class="row justify-end">
              <q-btn label="Save" type="submit" color="primary" icon="save"/>
              <q-btn label="Cancel" type="reset" color="primary" icon="cancel" flat/>
            </div>
          </q-form>
        </div>
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>

import OaSection from "@/components/widgets/OaSection.vue";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useDataCaptureStore} from "@/stores/datacapture";

const newConfig = ref({});
onMounted(() => {
  newConfig.value = {
    id: null,
    name: null,
    description: null,
    version: null,
    value: "//Insert your data capture configuration",
  }
})

const dataCaptureStore = useDataCaptureStore();
const onSubmit = async () => {
  const created = await dataCaptureStore.createCaptureConfig(newConfig.value);
  await router.push("/datacapture/config/" + created.id);
};

const router = useRouter();
const onReset = () => {
  router.push("/datacapture/configs");
};
</script>

<style scoped>

</style>
