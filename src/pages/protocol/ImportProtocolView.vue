<template>
  <q-breadcrumbs class="breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Import protocol'"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">
      <div class="q-px-sm oa-section-title">
        <div class="text-h6">Import protocols</div>
      </div>
      <div class="col q-pa-lg oa-section-body">
        <span class="text-bold">Import protocols as json</span>
        <div class="row justify-start q-pt-md">
          <q-file
              style="min-width: 300px; margin-right: 10px"
              v-model="jsonFiles"
              dense
              label="Pick protocol json files"
              multiple
              accept=".json"
          />
          <q-btn label="Import" type="submit" color="primary" @click="importAsJson"></q-btn>
        </div>
        <span class="text-accent">{{ jsonStatusMessage }}</span>
      </div>
    </div>
  </q-page>
</template>

<script>

import {ref} from "vue";

export default {
  name: "ImportProtocolView",
  methods: {
    importAsJson() {
      console.log('importing')
      if (this.jsonFiles.length === 0){
        this.jsonStatusMessage = "No json files selected."
        return
      }
      //Loop over all json files, parse, and commit them.
      this.jsonFiles.forEach(f => {
        const fr = new FileReader();
        fr.onload = e => {
          const result = JSON.parse(e.target.result)
          this.$store.dispatch('protocols/importAsJson', result)
        }
        fr.readAsText(f)
      })
    }
  },
  setup() {
    const exported = {}
    exported.jsonFiles = ref([])
    exported.jsonStatusMessage = ref("")
    return exported
  }
}
</script>

<style lang="scss">
@import "src/css/oa.global";
</style>