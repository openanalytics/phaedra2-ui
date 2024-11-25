<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el icon="list" label="Templates" :to="'/templates'" />
    <q-breadcrumbs-el label="New Template" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm" v-if="!templateStore.template">
      <oa-section title="New Template" icon="add">
        <div class="row q-pa-md">
          <div class="col-10">
            <q-input v-model="newPlateTemplate.name" label="Name: " dense />
            <q-input
              v-model="newPlateTemplate.description"
              label="Description: "
              dense
            />
            <q-input v-model="newPlateTemplate.rows" label="Rows: " dense />
            <q-input
              v-model="newPlateTemplate.columns"
              label="Columns: "
              dense
            />
          </div>
          <div class="col-2">
            <div class="row justify-end">
              <q-btn
                size="sm"
                label="Import ..."
                class="oa-action-button"
                @click="importFromFile = true"
              />
            </div>
            <div class="row justify-end">
              <q-btn
                size="sm"
                label="Save"
                class="oa-action-button"
                @click="onSubmit"
              />
            </div>
            <div class="row justify-end">
              <router-link :to="{ name: 'browseTemplates' }" class="nav-link">
                <q-btn size="sm" label="Cancel" class="oa-action-button" />
              </router-link>
            </div>
          </div>
        </div>
      </oa-section>
    </div>

    <div class="q-pa-sm" v-if="templateStore.template">
      <oa-section
        :title="templateStore.template.name"
        icon="border_outer"
        :collapsible="true"
      >
        <div class="row q-pa-md">
          <div class="col-3">
            <q-field label="Dimensions" stack-label borderless dense>
              <template v-slot:control>
                {{ templateStore.template.rows }} x
                {{ templateStore.template.columns }} ({{
                  templateStore.template.rows * templateStore.template.columns
                }}
                wells)
              </template>
            </q-field>
            <q-field label="Description" stack-label borderless dense>
              <template v-slot:control>
                <EditableField
                  :object="templateStore.template"
                  fieldName="description"
                  @valueChanged="onDescriptionChanged"
                />
              </template>
            </q-field>
          </div>

          <div class="col-3" />
          <div class="col-4" />

          <div class="col-2">
            <div class="row justify-end action-button">
              <q-btn
                size="sm"
                icon="save"
                class="oa-action-button"
                label="Save"
                @click="savePlateTemplate"
              />
            </div>
            <div class="row justify-end action-button">
              <q-btn
                size="sm"
                icon="edit"
                class="oa-action-button"
                label="Rename"
                @click="showRenameDialog = true"
              />
            </div>
          </div>
        </div>
      </oa-section>
    </div>

    <div class="q-pa-sm" v-if="templateStore.template">
      <q-tabs
        inline-label
        dense
        no-caps
        align="left"
        class="oa-section-title"
        v-model="activeTab"
      >
        <q-tab name="overview" icon="view_module" label="Overview" />
        <q-tab name="well-type" icon="text_snippet" label="Well Type" />
        <q-tab name="substance" icon="view_module" label="Substance" />
        <q-tab name="concentration" icon="view_module" label="Concentration" />
      </q-tabs>

      <div class="oa-section-body">
        <q-tab-panels v-model="activeTab" animated style="width: 100%">
          <q-tab-panel name="overview" icon="view_module" label="Overview">
            <PlateTemplateLayout
              :plate="templateStore.template"
              :tab="activeTab"
            />
          </q-tab-panel>
          <q-tab-panel name="well-type" icon="view_module" label="Well Type">
            <PlateTemplateLayout
              :plate="templateStore.template"
              :tab="activeTab"
            />
          </q-tab-panel>
          <q-tab-panel name="substance" icon="view_module" label="Substance">
            <PlateTemplateLayout
              :plate="templateStore.template"
              :tab="activeTab"
            />
          </q-tab-panel>
          <q-tab-panel
            name="concentration"
            icon="view_module"
            label="Concentration"
          >
            <PlateTemplateLayout
              :plate="templateStore.template"
              :tab="activeTab"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
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
  <rename-dialog
    v-model:show="showRenameDialog"
    objectClass="plate_template"
    fieldName="name"
    :object="templateStore.template"
    @valueChanged="onNameChanged"
  />
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

const activeTab = ref("overview");

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

const loadingHandler = useLoadingHandler();

const onSubmit = async () => {
  await loadingHandler.handleLoadingDuring(
    templateAPI.createPlateTemplate(newPlateTemplate.value).then((data) => {
      router.push("/template/" + data.id);
    })
  );
};

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

const savePlateTemplate = async () => {
  await loadingHandler.handleLoadingDuring(
    templateAPI.createPlateTemplate(templateStore.template).then((data) => {
      router.push("/template/" + data.id);
    })
  );
};

const showRenameDialog = ref(false);
const onNameChanged = async (newTemplateName) => {
  await loadingHandler.handleLoadingDuring(
    templateStore.renameTemplate(newTemplateName)
  );
};

const onDescriptionChanged = async (newDescription) => {
  await loadingHandler.handleLoadingDuring(
    templateStore.editTemplateDescription(newDescription)
  );
};
</script>
