<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el :label="'New Plate Layout Template'" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">
      <oa-section-header :title="'New Template'" :icon="'add'"/>

      <div class="row q-pa-lg oa-section-body">
        <q-form class="col" @submit="onSubmit" @reset="onReset">
          <div class="row justify-end q-pt-md">
            <q-btn label="Import from file ..." size="sm" square @click="importFromFile = true"/>
          </div>

          <q-input v-model="newPlateTemplate.name" label="Name: "></q-input>
          <q-input v-model="newPlateTemplate.description" label="Description: "></q-input>
          <q-input v-model="newPlateTemplate.rows" label="Rows: "></q-input>
          <q-input v-model="newPlateTemplate.columns" label="Columns: "></q-input>

          <div class="row justify-end q-pt-md">
            <q-btn label="Submit" type="submit" color="primary" square></q-btn>
            <router-link :to="{name: 'browseTemplates'}" class="nav-link">
              <q-btn label="Cancel" type="reset" color="primary" flat class="a-ml-sm" square></q-btn>
            </router-link>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>

  <q-dialog v-model="importFromFile" persistent>
    <div class="q-pa-md oa-section-body">
        <q-form class="col" @submit="onSubmit" @reset="onReset">
          <q-file v-model="importFile" label="Plate template" @update:modelValue="onFileSelection"></q-file>

          <div class="row justify-end q-pt-md">
            <q-btn label="Update" color="primary" square @click="onImportFile" v-close-popup></q-btn>
            <q-btn label="Cancel" type="reset" color="primary" flat square class="a-ml-sm" v-close-popup></q-btn>
          </div>
        </q-form>
    </div>
  </q-dialog>
</template>

<script setup>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import OaSectionHeader from "@/components/widgets/OaSectionHeader";

const router = useRouter();
const store = useStore();

const props = defineProps({
  plateTemplate: Object
})

const newPlateTemplate = ref({
  name: null,
  description: null,
  rows: null,
  columns: null,
  createdOn: null,
  createdBy: 'smarien'
});
const wellTypeOptions = ref(['LC', 'HC', 'NC', 'PC'])
const importFromFile = ref(false)
const importFile = ref(null)
const templatePreview = ref(null)

const onSubmit = async () => {
  newPlateTemplate.value.createdOn = new Date();
  const createdTemplate = await store.dispatch('templates/createNewPlateTemplate', newPlateTemplate.value);
  router.push("/template/" + createdTemplate.id);
};
const onReset = () => {
  importFile.value = null
};

const onImportFile = async () => {
  console.log(importFile)
  const reader = new FileReader();
  reader.onload = (res) => {
    const data = res.target.result

    const plateTemplate = JSON.parse(data);
    newPlateTemplate.value.name = plateTemplate.name
    newPlateTemplate.value.rows = plateTemplate.rows
    newPlateTemplate.value.columns = plateTemplate.columns
    newPlateTemplate.value.wells = plateTemplate.wells
    console.log(plateTemplate)
  }
  reader.readAsText(importFile.value);
}
</script>
