<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 60vw">

      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="playlist_add" color="primary" text-color="white"/>
        Select Plate(s) Layout
      </q-card-section>

      <q-card-section>
        <div class="row q-pb-md">
          <span>By linking plate(s) with a layout definition, substance and control information can be retrieved and applied to the plate(s).</span>
        </div>

        <q-card-section>
          <div class="q-pb-md">Selected plate(s):</div>
          <q-list dense bordered>
            <q-item v-for="plate in props.plates" :key="plate.id">
              <q-item-section avatar>
                <q-icon color="primary" name="view_module" />
              </q-item-section>
              <q-item-section>{{ plate.barcode }} ({{plate.id}}) with dimensions {{ plate.rows }} x {{ plate.columns }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section>
          <div class="row justify-end q-pb-sm">
            <q-btn v-if="!quickView" size="sm" color="primary" icon="remove_red_eye" label="Show Quick view" :disable="!isTemplateSelected()" @click="handleShowQuickView"/>
            <q-btn v-if="quickView" size="sm" color="accent" icon="remove_red_eye" label="Hide Quick view" @click="handleHideQuickView"/>
          </div>
          <oa-table
              :rows="filteredTemplates"
              :columns="templateColumns"
              v-model:selected="selectedTemplates"
              selection="single"
              @selection="handleTemplateSelection">
            <template v-slot:body-cell-layout="props">
              <q-td :props="props">
                {{ props.row.rows }} x {{ props.row.columns }}
              </q-td>
            </template>
          </oa-table>
          <span v-if="!checkAllDimensions()" class="text-accent">The selected template has different dimensions compared to the selected plates.</span><br>
        </q-card-section>

        <TemplateQuickView v-if="quickView && isTemplateSelected()" :plateTemplate="selectedTemplate"></TemplateQuickView>

      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup/>
        <q-btn label="Link" :disable="!isTemplateSelected() || !arePlatesSelected() || !checkAllDimensions()" @click="linkPlate" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
/**
 * Dialog to link plate(s) to template
 * If plateId is provided, only 1 plate is selectable in list.
 * If plateId is null, all plates of the experiment are shown in list.
 */

import {computed, ref} from "vue";

import FormatUtils from "@/lib/FormatUtils";
import TemplateQuickView from "@/components/layout/TemplateQuickView";
import {useExperimentStore} from "@/stores/experiment";
import templatesGraphQlAPI from "@/api/graphql/templates";
import {useLoadingHandler} from "@/composable/loadingHandler";
import OaTable from "@/components/table/OaTable.vue";
import {useNotification} from "@/composable/notification";

const props = defineProps(['show', 'plate', "plates"]);
const emits = defineEmits(['update:show', "onLinkPlate"]);

const experimentStore = useExperimentStore()
const useNotify = useNotification()

const allTemplates = ref([])
const selectedTemplates = ref([])
const selectedTemplate = ref(null)
const quickView = ref(false)

const data = await templatesGraphQlAPI.templates()
allTemplates.value = data.plateTemplates

// const {onResult, onError} = templatesGraphQlAPI.templates()
// onResult(({data}) => allTemplates.value = data.plateTemplates)
// onError((error) => useNotify.showError(error))

const filteredTemplates = computed(() => preFilterTemplates(allTemplates.value))

const showDialog = computed({
  get: () => props.show,
  set: (v) => emits('update:show', v)
});

const handleTemplateSelection = (selected) => {
  const data = templatesGraphQlAPI.templateById(selected.rows[0].id)
  selectedTemplate.value = data.plateTemplate
  // const {onResult, onError} = templatesGraphQlAPI.templateById(selected.rows[0].id)
  // onResult(({data}) => {
  //   selectedTemplate.value = data.plateTemplate
  // })
  // onError((error) => useNotify.showError(error))
}

const handleShowQuickView = () => {
  quickView.value = true
}

const handleHideQuickView = () => {
  quickView.value = false
}

const templateColumns = [
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Template Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'layout', align: 'left', label: 'Dimensions', field: 'layout', sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
]

const loadingHandler = useLoadingHandler()
const linkPlate = async () => {
  await loadingHandler.handleLoadingDuring(experimentStore.setPlateLayout(props.plates, selectedTemplate.value.id))
  emits('onLinkPlate')
}

const checkPlateDimensions = () => {
  const countRows = props.plates.map(p => p.rows).filter(onlyUnique).length;
  const countColumns = props.plates.map(p => p.columns).filter(onlyUnique).length;
  return (countRows <= 1 && countColumns <= 1);
}

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

const preFilterTemplates = (allTemplates) => {
  if (!checkPlateDimensions()) return [];
  return allTemplates.filter(row => row.rows === props.plates[0]?.rows && row.columns === props.plates[0]?.columns);
}

const checkAllDimensions = () => {
  if (!isTemplateSelected()) return true;
  const countRows = props.plates.filter(row => row.rows === selectedTemplate.value.rows).length
  const countColumns = props.plates.filter(row => row.columns === selectedTemplate.value.columns).length
  return (countRows === props.plates.length && countColumns === props.plates.length);
}

const isTemplateSelected = () => {
  return (selectedTemplate.value);
}

const arePlatesSelected = () => {
  return props.plates.length !== 0;
}
</script>
