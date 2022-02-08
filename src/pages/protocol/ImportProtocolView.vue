<template>
  <q-breadcrumbs class="breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Import Protocol'"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div q-pa-md">
    <oa-section-header :title="'Import Protocol'" :icon="'ballot'"/>
    <div class="q-pa-md oa-section-body">
      <span class="">Create a new Protocol by importing it from a JSON file:</span>
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
        <q-btn label="Import" type="submit" color="primary" @click="importAsJson"></q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>

import {ref} from "vue";
import OaSectionHeader from "../../components/widgets/OaSectionHeader";
export default {
  name: "ImportProtocolView",
  components: {OaSectionHeader},
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