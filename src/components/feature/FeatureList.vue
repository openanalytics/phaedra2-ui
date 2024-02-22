<template>
  <oa-section title="Features" icon="functions" :collapsible="true">
    <q-table
        table-header-class="text-grey"
        :rows="features"
        :columns="columns"
        :visible-columns="visibleColumns"
        :filter="filter"
        :filter-method="filterMethod"
        row-key="id"
        column-key="name"
        :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
        :loading="loading"
        separator="cell"
        flat dense>

      <template v-slot:top-left>
        <div class="col action-button on-left">
          <q-btn icon="add" class="oa-button" label="Add Feature" @click="showNewFeatureView" size="sm" dense/>
          <q-btn v-if="protocolStore.isUpdated" icon="save" class="oa-action-button" label="Save" @click="confirmChanges = true" size="sm" dense/>
          <q-btn v-if="protocolStore.isUpdated" icon="restart_alt" class="oa-action-button" label="Reset" @click="protocolStore.reloadProtocol" size="sm" dense/>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
        <q-tr :props="props">
          <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
        </q-tr>
      </template>
      <template v-slot:body-cell-formulaId="props">
        <q-td :props="props">
          <div class="row items-center cursor-pointer" @click="showFormulaInfo(props.row.formulaId)">
            <q-chip square dense class="q-ma-none">
              {{ getFormulaName(props.row.formulaId) }}
            </q-chip>
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
    </q-table>
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
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {useRouter} from 'vue-router';
import FilterUtils from "@/lib/FilterUtils";

import {useFeatureStore} from "@/stores/feature";
import {useProtocolStore} from "@/stores/protocol";
import {useFormulasStore} from "@/stores/formulas";

import OaSection from "@/components/widgets/OaSection";
import EditFeature from "@/components/feature/EditFeature";
import ViewFeature from "@/components/feature/ViewFeature";
import NewFeature from "@/components/feature/NewFeature";
import ColumnFilter from "@/components/table/ColumnFilter.vue";

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'format', align: 'left', label: 'Format', field: 'format', sortable: true},
  {name: 'sequence', align: 'left', label: 'Sequence', field: 'sequence', sortable: true},
  {name: 'formulaId', align: 'left', label: 'Formula', field: 'formula.id', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
])

const protocolStore = useProtocolStore()
const featureStore = useFeatureStore()
const formulasStore = useFormulasStore()

const props = defineProps(['protocol', 'editMode'])
const emit = defineEmits(['addFeature'])

const router = useRouter()

const loading = ref(false)
const confirmChanges = ref(false)

const features = computed(() => { return protocolStore.getFeatures() })

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();
const visibleColumns = ref([])

watch(features, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  loading.value = false
})

const getFormulaName = (id) => {
  const formula = formulasStore.getFormulaById(parseInt(id))
  return (formula || {}).name;
}

const showEditFeatureSection = ref(false)
const showFeatureDetails = ref(false)
const showNewFeatureTab = ref(false)

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
  await protocolStore.saveProtocol()
}

</script>
