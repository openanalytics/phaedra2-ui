<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
    <q-breadcrumbs-el icon="list" label="Templates" :to="'/templates'" />
    <q-breadcrumbs-el label="New Template" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="New Template" icon="add">
        <div class="q-pa-sm">
          <q-form class="full-width" @submit="onSubmit" @reset="onReset">
            <div>
              <q-input v-model="newPlateTemplate.name" label="Name" lazy-rules
                       :rules="[(val) => (val && val.length > 0) || 'Template name is required']"
                       dense />
              <q-input v-model="newPlateTemplate.description" label="Description" dense/>
              <q-input v-model="newPlateTemplate.rows" label="Rows" lazy-rules
                       :rules="[(val) => (val && val.length > 0) || 'Rows must be > 0']"
                       dense />
              <q-input v-model="newPlateTemplate.columns" label="Columns" lazy-rules
                       :rules="[(val) => (val && val.length > 0) || 'Columns must be > 0']"
                       dense />
            </div>
            <div class="row justify-end">
                <q-btn label="Import..." color="primary" @click="importFromFile = true" class="q-mr-sm"/>
                <q-btn label="Create" type="submit" color="primary" class="q-mr-sm"/>
                <router-link :to="{ name: 'browseTemplates' }" class="nav-link">
                  <q-btn label="Cancel" type="reset" color="primary" flat/>
                </router-link>
            </div>
          </q-form>
        </div>
      </oa-section>
    </div>


  </q-page>

  <q-dialog v-model="importFromFile" persistent>
    <div class="q-pa-md oa-section-body">
      <q-file v-model="importFile" label="Plate template" />
      <div class="row justify-end q-pt-md">
        <q-btn
          size="sm"
          label="Update"
          class="oa-action-button"
          @click="onImportFile"
          v-close-popup
        />
        <q-btn
          size="sm"
          label="Cancel"
          class="oa-action-button"
          @click="onReset"
          v-close-popup
        />
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import OaSection from "@/components/widgets/OaSection";
import PlateUtils from "@/lib/PlateUtils";
import { useTemplateStore } from "@/stores/template";
import templateAPI from "@/api/templates.js";
import EditableField from "@/components/widgets/EditableField.vue";
import PlateTemplateLayout from "@/pages/platelayout/PlateTemplateLayout.vue";
import RenameDialog from "@/components/widgets/RenameDialog.vue";
import { useLoadingHandler } from "../../composable/loadingHandler";

const router = useRouter();
const templateStore = useTemplateStore();
templateStore.$reset();

const props = defineProps({
  plateTemplate: Object,
});

const newPlateTemplate = ref({
  name: null,
  description: null,
  rows: null,
  columns: null,
  wells: [],
});

const importFromFile = ref(false);
const importFile = ref(null);

const createPlateTemplate = async () => {
  const data = await templateAPI.createPlateTemplate(newPlateTemplate.value);
  await router.push("/template/" + data.id);
};

const loadingHandler = useLoadingHandler();
const onSubmit = async () => {
  await loadingHandler.handleLoadingDuring(createPlateTemplate());
}

const onReset = () => {
  importFile.value = null;
};

const onImportFile = async () => {
  console.log(importFile);
  const reader = new FileReader();
  reader.onload = (res) => {
    const data = res.target.result;

    const plateTemplate = JSON.parse(data);
    const plateDims = PlateUtils.getPlateDimensions(plateTemplate.wells.length);
    newPlateTemplate.value.name = plateTemplate.name
      ? plateTemplate.name
      : plateTemplate.barcode;
    newPlateTemplate.value.rows = plateDims.rows;
    newPlateTemplate.value.columns = plateDims.cols;
    newPlateTemplate.value.wells = plateTemplate.wells;

    templateStore.template = newPlateTemplate.value;
  };
  reader.readAsText(importFile.value);
};
</script>
