<template>
  <oa-section title="Features" icon="functions" :collapsible="true">
    <oa-table :rows="features" :columns="columns" :pagination="{ rowsPerPage: 10, sortBy: 'name' }">
      <template v-slot:top-right>
        <div class="col action-button on-left">
          <q-btn icon="add" color="primary" @click="showNewFeatureView" size="sm" round>
            <q-tooltip>Add a new feature</q-tooltip>
          </q-btn>
          <q-btn v-if="protocolStore.isUpdated" icon="save" class="oa-action-button" label="Save" @click="confirmChanges = true" size="sm" dense/>
          <q-btn v-if="protocolStore.isUpdated" icon="restart_alt" class="oa-action-button" label="Reset" @click="protocolStore.reloadProtocol" size="sm" dense/>
        </div>
      </template>
      <template v-slot:body-cell-formulaId="props">
        <q-td :props="props">
          <div class="row items-center cursor-pointer" @click="showFormulaInfo(props.row.formulaId)">
            <q-chip square dense class="q-ma-none">
              {{ getFormula(props.row.formulaId).name }}
            </q-chip>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-formulaVersion="props">
        <q-td :props="props">
          <div class="row items-center cursor-pointer">
            <q-chip square dense class="q-ma-none">
              {{ getFormula(props.row.formulaId).versionNumber }}
            </q-chip>
            <span v-if="getHigherVersionFormula(props.row.formulaId)" class="on-right">
              <q-icon name="warning" color="warning" size="xs" @click="updateFeatureFormula(props.row)">
                <q-tooltip>A newer version is available for this formula: {{ getHigherVersionFormula(props.row.formulaId).versionNumber }}<br/>Click here to update this formula to the latest version.</q-tooltip>
              </q-icon>
            </span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-menu="props">
        <q-td :props="props">
          <div class="col items-center cursor-pointer">
            <q-btn flat round dense icon="visibility" size="sm" @click="showFeatureView(props.row)"/>
            <q-btn flat round dense icon="edit" size="sm" @click="showEditFeatureView(props.row)"/>
            <q-btn flat round dense icon="delete" size="sm" @click="deleteFeature(props.row)"/>
          </div>
        </q-td>
      </template>
      <template v-slot:no-data>
        <div class="full-width row text-info">
          <span>No features to show.</span>
        </div>
      </template>
    </oa-table>
  </oa-section>

  <div class="q-pt-md">
    <new-feature v-if="showNewFeatureTab" @createFeature="handleAddNewFeature" @cancel="handleCancel"/>
    <edit-feature v-if="showEditFeatureSection" @updateFeature="handleEditFeature" @cancel="handleCancel"/>
    <view-feature v-if="showFeatureDetails" @cancel="handleCancel"/>
  </div>

  <q-dialog v-model="confirmChanges" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="save" color="primary" text-color="white" />
        <span class="q-ml-sm">Are you sure you want to save the feature changes?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup @click="protocolStore.reloadProtocol"/>
        <q-btn flat label="Save" color="primary" v-close-popup @click="saveProtocol"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <update-feature-formula-dialog v-model:show="showUpdateFormulaDialog" :feature="featureToUpdateFormula"/>
</template>

<script setup>
import {computed, ref} from "vue";
import {useRouter} from 'vue-router';

import {useFeatureStore} from "@/stores/feature";
import {useProtocolStore} from "@/stores/protocol";
import {useFormulasStore} from "@/stores/formulas";

import OaSection from "@/components/widgets/OaSection";
import EditFeature from "@/components/feature/EditFeature";
import ViewFeature from "@/components/feature/ViewFeature";
import NewFeature from "@/components/feature/NewFeature";
import OaTable from "@/components/table/OaTable.vue";
import UpdateFeatureFormulaDialog from "@/components/feature/UpdateFeatureFormulaDialog.vue";

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true, style: 'width: 80px;'},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'format', align: 'left', label: 'Format', field: 'format', sortable: true},
  {name: 'sequence', align: 'left', label: 'Sequence', field: 'sequence', sortable: true},
  {name: 'formulaId', align: 'left', label: 'Formula', sortable: true},
  {name: 'formulaVersion', align: 'left', label: 'Formula Version', field: 'formula.version', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
])

const protocolStore = useProtocolStore()
const featureStore = useFeatureStore()
const formulasStore = useFormulasStore()

const props = defineProps(['protocol', 'editMode'])
const emit = defineEmits(['addFeature'])

const router = useRouter()

const confirmChanges = ref(false)

const features = computed(() => { return protocolStore.getFeatures() })

const getFormula = (id) => {
  return formulasStore.getFormulaById(parseInt(id)) || {};
}
const getHigherVersionFormula = (id) => {
  return formulasStore.getHigherVersionFormula(parseInt(id));
}

const showEditFeatureSection = ref(false)
const showFeatureDetails = ref(false)
const showNewFeatureTab = ref(false)

const featureToUpdateFormula = ref(null)
const showUpdateFormulaDialog = ref(false)
function updateFeatureFormula(feature) {
  featureToUpdateFormula.value = feature;
  showUpdateFormulaDialog.value = true;
}

const handleAddNewFeature = (feature) => {
  protocolStore.addFeature(feature)
  showNewFeatureTab.value = false
  showEditFeatureSection.value = false
  showFeatureDetails.value = false
}

const handleEditFeature = (feature) => {
  protocolStore.editFeature(feature)
  showNewFeatureTab.value = false
  showEditFeatureSection.value = false
  showFeatureDetails.value = false
}

const handleCancel = () => {
  featureStore.reset()
  protocolStore.reloadProtocol()
  showNewFeatureTab.value = false
  showEditFeatureSection.value = false
  showFeatureDetails.value = false
}

const showFeatureView = (feature) => {
  featureStore.loadFeature(feature)
  showFeatureDetails.value = true
  showNewFeatureTab.value = false
  showEditFeatureSection.value = false
}

const showEditFeatureView = (feature) => {
  featureStore.loadFeature(feature)
  showEditFeatureSection.value = true
  showFeatureDetails.value = false
  showNewFeatureTab.value = false
}

const showNewFeatureView = () => {
  showNewFeatureTab.value = true
  showEditFeatureSection.value = false
  showFeatureDetails.value = false
}

const deleteFeature = (feature) => {
  protocolStore.deleteFeature(feature)
}

const showFormulaInfo = (formulaId) => {
  router.push("/calc/formula/" + formulaId);
}

const saveProtocol = async () => {
  for (let f of protocolStore.protocol.features) {
    await featureStore.saveFeatureStats(f);
  }
  await protocolStore.saveProtocol()
}

</script>
