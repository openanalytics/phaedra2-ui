<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 60vw">

      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="playlist_add" color="primary" text-color="white"/>
        Select Plate Layout
      </q-card-section>

      <q-card-section>
        <div class="row q-pb-md">
          <span>By linking plates with a layout definition, substance and control information can be retrieved and applied to the plate(s).</span>
        </div>

        <div v-if="!quickView">
          <q-table
              :rows="experimentStore.plates"
              :columns="plateColumns"
              row-key="id"
              :pagination="{ rowsPerPage: 5, sortBy: 'barcode' }"
              selection="multiple"
              v-model:selected="selectedPlates"
              table-header-class="text-grey"
              square flat dense>
              <template v-slot:body-cell-dimensions="props">
                <q-td :props="props">
                  {{ props.row.rows }} x {{ props.row.columns }}
                </q-td>
              </template>
              <template v-slot:body-cell-link-status="props">
                <q-td :props="props">
                  <StatusFlag :object="props.row" :statusField="'linkStatus'" />
                </q-td>
              </template>
          </q-table>
          <span v-if="!checkPlateDimensions()" class="text-accent">The selected plates have different dimensions.</span><br>
        </div>

        <div>
          <div class="row justify-end">
            <q-btn v-if="!quickView" size="sm" color="primary" icon="remove_red_eye" label="Show Quick view" :disable="!isTemplateSelected()" @click="handleShowQuickView"/>
            <q-btn v-if="quickView" size="sm" color="accent" icon="remove_red_eye" label="Hide Quick view" @click="handleHideQuickView"/>
          </div>
          <q-table
              :rows="allTemplates"
              :columns="templateColumns"
              :pagination="{ rowsPerPage: 5 }"
              selection="single"
              :filter="selectedPlates"
              :filter-method="filterMethod"
              v-model:selected="selectedTemplates"
              @selection="handleTemplateSelection"
              table-header-class="text-grey"
              square flat dense>
            <template v-slot:body-cell-layout="props">
              <q-td :props="props">
                {{ props.row.rows }} x {{ props.row.columns }}
              </q-td>
            </template>
          </q-table>
          <span v-if="!checkAllDimensions()" class="text-accent">The selected template has different dimensions compared to the selected plates.</span><br>
        </div>

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
import {useRoute} from "vue-router";

import FormatUtils from "@/lib/FormatUtils";
import TemplateQuickView from "@/components/layout/TemplateQuickView";
import StatusFlag from "@/components/widgets/StatusFlag";
import {useExperimentStore} from "@/stores/experiment";
import templatesGraphQlAPI from "@/api/graphql/templates";

const props = defineProps(['show', 'plate']);
const emit = defineEmits(['update:show', "onLinkPlate"]);

const experimentStore = useExperimentStore()
const route = useRoute();

const selectedPlates = ref(experimentStore.plates.filter(p => p.id === props.plate.id));

const experimentId = parseInt(route.params.id);
const allTemplates = ref([])
const selectedTemplates = ref([])
const selectedTemplate = ref(null)
const quickView = ref(false)

const {onResult, onError} = templatesGraphQlAPI.templates()
onResult(({data}) => allTemplates.value = data.plateTemplates)

const showDialog = computed({
  get: () => props.show,
  set: (v) => emit('update:show', v)
});

const handleTemplateSelection = (selected) => {
  const {onResult, onError} = templatesGraphQlAPI.templateById(selected.rows[0].id)
  onResult(({data}) => {
    selectedTemplate.value = data.plateTemplate
  })
}

const handleShowQuickView = () => {
  quickView.value = true
}

const handleHideQuickView = () => {
  quickView.value = false
}

const plateColumns = ref([
  {name: 'id', align: 'left', label: 'Barcode', field: 'id', sortable: true},
  {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'dimensions', align: 'left', label: 'Dimensions', field: 'dimensions', sortable: true},
  {name: 'link-status', align: 'left', label: 'Link status', field: 'link-status', sortable: true}
])

const templateColumns = [
  {name: 'name', align: 'left', label: 'Template Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'layout', align: 'left', label: 'Dimensions', field: 'layout', sortable: true},
  {
    name: 'createdOn',
    align: 'left',
    label: 'Created On',
    field: 'createdOn',
    sortable: true,
    format: FormatUtils.formatDate
  },
]

const linkPlate = () => {
  const copy = JSON.parse(JSON.stringify(selectedPlates.value));
  copy.forEach(plate => {
    plate.linkStatus = 'LINKED'
    plate.linkSource = 'layout-template'
    plate.linkTemplateId = selectedTemplate.value.id
    plate.linkedOn = new Date()
    experimentStore.linkPlate(plate)
  })
}

const checkPlateDimensions = () => {
  // Count occurences of rows and columns in selected plates
  const countRows = selectedPlates.value.map(p => p.rows).filter(onlyUnique).length;
  const countColumns = selectedPlates.value.map(p => p.rows).filter(onlyUnique).length;
  return (countRows <= 1 && countColumns <= 1);
}

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

const filterMethod = (tableRows, terms) => {
  if (terms.length === 0) return tableRows;
  if (!checkPlateDimensions()) return [];
  const correctRows = tableRows.filter(row => row.rows === terms[0].rows);
  return correctRows.filter(row => row.columns === terms[0].columns);
}

const checkAllDimensions = () => {
  if (!isTemplateSelected()) return true;
  const countRows = selectedPlates.value.filter(row => row.rows === selectedTemplate.value.rows).length
  const countColumns = selectedPlates.value.filter(row => row.columns === selectedTemplate.value.columns).length
  return (countRows === selectedPlates.value.length && countColumns === selectedPlates.value.length);
}

const isTemplateSelected = () => {
  return (selectedTemplate.value);
}

const arePlatesSelected = () => {
  return selectedPlates.value.length !== 0;
}
</script>
