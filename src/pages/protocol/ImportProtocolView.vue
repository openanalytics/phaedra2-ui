<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
    <q-breadcrumbs-el :label="'Import Protocol'" />
  </q-breadcrumbs>

  <q-page class="oa-root-div q-pa-sm">
    <oa-section-header :title="'Import Protocol'" :icon="'ballot'" />
    <div class="q-pa-md oa-section-body">
      <span class=""
        >Create a new Protocol by importing it from a JSON file:</span
      >
      <div class="row q-pt-md">
        <q-file
          class="full-width"
          v-model="jsonFiles"
          dense
          label="Protocol File"
          multiple
          accept=".json"
        />
      </div>
      <span class="text-accent">{{ jsonStatusMessage }}</span>

      <div class="row justify-end q-pt-md">
        <router-link :to="{ name: 'newProtocol' }" class="nav-link">
          <q-btn
            label="Cancel"
            type="reset"
            color="primary"
            flat
            class="a-ml-sm on-right"
          ></q-btn>
        </router-link>
        <q-btn
          label="Import"
          type="submit"
          color="primary"
          @click="importFromJson"
        ></q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import OaSectionHeader from "../../components/widgets/OaSectionHeader";
import { useProtocolStore } from "@/stores/protocol";
import { useRouter } from "vue-router";

const jsonFiles = ref([]);
const jsonStatusMessage = ref("");

const router = useRouter();
const protocolStore = useProtocolStore();

const importFromJson = () => {
  if (jsonFiles.value.length === 0) {
    jsonStatusMessage.value = "No json files selected.";
    return;
  }
  //Loop over all json files, parse, and commit them.
  jsonFiles.value.forEach((f) => {
    const fr = new FileReader();
    fr.onload = (e) => {
      const result = JSON.parse(e.target.result);
      protocolStore.importFromJson(result).then((protocol) => {
        router.push("/protocol/" + protocol.id);
      });
    };
    fr.readAsText(f);
  });
};
</script>
