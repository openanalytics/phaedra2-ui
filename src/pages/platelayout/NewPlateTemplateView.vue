<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el icon="list" label="Templates" :to="'/templates'"/>
    <q-breadcrumbs-el label="New Template" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <oa-section title="New Template" icon="add">
        <div class="row q-pa-md">
            <div class="col-10">
              <q-input v-model="newPlateTemplate.name" label="Name: " dense/>
              <q-input v-model="newPlateTemplate.description" label="Description: " dense/>
              <q-input v-model="newPlateTemplate.rows" label="Rows: " dense/>
              <q-input v-model="newPlateTemplate.columns" label="Columns: " dense/>
            </div>
            <div class="col-2">
              <div class="row justify-end">
                <q-btn size="sm" label="Import ..." class="oa-action-button" @click="importFromFile = true"/>
              </div>
              <div class="row justify-end">
                <q-btn size="sm" label="Save" class="oa-action-button" @click="onSubmit"/>
              </div>
              <div class="row justify-end">
                <router-link :to="{name: 'browseTemplates'}" class="nav-link">
                  <q-btn size="sm" label="Cancel" class="oa-action-button"/>
                </router-link>
              </div>
            </div>
        </div>
      </oa-section>
    </div>
  </q-page>

  <q-dialog v-model="importFromFile" persistent>
    <div class="q-pa-md oa-section-body">
<!--        <q-form class="col" @submit="onSubmit" @reset="onReset">-->
<!--          <q-file v-model="importFile" label="Plate template" @update:modelValue="onFileSelection"></q-file>-->
      <q-file v-model="importFile" label="Plate template"/>

          <div class="row justify-end q-pt-md">
            <q-btn size="sm" label="Update" class="oa-action-button" @click="onImportFile" v-close-popup/>
            <q-btn size="sm" label="Cancel" class="oa-action-button" @click="onReset" v-close-popup/>
          </div>
<!--        </q-form>-->
    </div>
  </q-dialog>
</template>

<script setup>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import OaSection from "@/components/widgets/OaSection"
import PlateUtils from "@/lib/PlateUtils";

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
  await router.push("/template/" + createdTemplate.id);
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
    const plateDims = PlateUtils.getPlateDimensions(plateTemplate.positions.length)
    newPlateTemplate.value.name = plateTemplate.name ? plateTemplate.name : plateTemplate.barcode
    newPlateTemplate.value.rows = plateDims.rows
    newPlateTemplate.value.columns = plateDims.cols
    newPlateTemplate.value.wells = plateTemplate.wells
    console.log(plateTemplate)
  }
  reader.readAsText(importFile.value);
}
</script>
