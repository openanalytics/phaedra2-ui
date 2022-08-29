<template>
  <div class="q-pa-md" v-if="!showNewFeatureTab && !showEditFeatureSection">
    <oa-section-header :title="'Features'" :icon="'functions'"/>
    <div class="oa-section-body">
      <q-table
          table-header-class="text-grey"
          :rows="features"
          row-key="id"
          :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
          :columns="columns"
          :filter="filter"
          :filter-method="filterMethod"
          :loading="loading"
          :visible-columns="visibleColumns"
          dense>

        <template v-if="props.editMode" v-slot:top-left>
          <div class="col action-button on-left">
            <q-btn size="sm" icon="add" class="oa-button" label="Add Feature" @click="showNewFeatureTab=true"/>
          </div>
        </template>
        <template v-slot:top-right>
          <div class="row">
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
            <q-btn flat round color="primary" icon="settings" class="on-right" @click="configDialog=true"/>
          </div>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="row items-center cursor-pointer" @click="onViewFeature(props.row)">
              {{ props.row.name }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-formulaId="props">
          <q-td :props="props">
            {{ getFormulaName(props.row.formulaId) }}
            <q-icon name="info" size="xs" class="text-info cursor-pointer"
                    @click="showFormulaTooltip[props.rowIndex] = true">
              <q-tooltip v-model="showFormulaTooltip[props.rowIndex]" :delay="2000">
                <FormulaInspector :formulaId="props.row.formulaId"/>
              </q-tooltip>
            </q-icon>
          </q-td>
        </template>
        <template v-if="props.editMode" v-slot:body-cell-menu="props">
          <q-td :props="props">
            <div class="row items-center cursor-pointer">
              <q-btn flat round icon="edit" size="sm" @click="onEditFeature(props.row)"/>
              <q-btn flat round icon="delete" size="sm" @click="onDeleteFeature(props.row)"/>
            </div>
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row text-info">
            <span>No features to show.</span>
          </div>
        </template>
      </q-table>
    </div>
  </div>

  <new-feature v-if="showNewFeatureTab" v-model:show="showNewFeatureTab" :protocol="props.protocol" @addFeature="addNewFeature"/>
  <edit-feature v-if="showEditFeatureSection" v-model:show="showEditFeatureSection" />
  <view-feature v-if="showFeatureDetails" v-model:show="showFeatureDetails" />

  <table-config v-model:show="configDialog" v-model:visibleColumns="visibleColumns" v-model:columns="columns"/>
</template>

<script setup>

import {computed, ref} from "vue";
import FilterUtils from "@/lib/FilterUtils";

import {useFeatureStore} from "@/stores/feature";
import {useProtocolStore} from "@/stores/protocol";
import {useFormulasStore} from "@/stores/formulas";

import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import EditFeature from "@/components/feature/EditFeature";
import ViewFeature from "@/components/feature/ViewFeature";
import NewFeature from "@/components/feature/NewFeature";
import TableConfig from "@/components/table/TableConfig";
import FormulaInspector from "@/components/widgets/FormulaInspector";

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'format', align: 'left', label: 'Format', field: 'format', sortable: true},
  {name: 'type', align: 'left', label: 'Type', field: 'type', sortable: true},
  {name: 'formulaId', align: 'left', label: 'Formula', field: 'formula.id', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
])

const protocolStore = useProtocolStore()
const featureStore = useFeatureStore()
const formulasStore = useFormulasStore()

const props = defineProps(['protocol', 'editMode'])
const emit = defineEmits(['addFeature'])

const loading = ref(false)
const editMode = ref(props.editMode)

const pagination = {
  rowsPerPage: 10
}

const features = computed(() => { return protocolStore.getFeatures() })

const visibleColumns = columns.value.map(a => a.name)
const configDialog = ref(false)
const filter = ref('')
const filterMethod = FilterUtils.defaultTableFilter()

const getFormulaName = (id) => {
  const formula = formulasStore.getFormulaById(id)
  return (formula || {}).name;
}

const showFormulaTooltip = ref([])
const showEditFeatureSection = ref(false)
const showFeatureDetails = ref(false)
const showNewFeatureTab = ref(false)

const addNewFeature = (feature) => {
  emit('addFeature', feature)
}

const onViewFeature = (feature) => {
  featureStore.loadFeature(feature)
  showFeatureDetails.value = true
}

const onEditFeature = (feature) => {
  featureStore.loadFeature(feature)
  showEditFeatureSection.value = true
}

const onDeleteFeature = (feature) => {
  protocolStore.deleteFeature(feature)
}

</script>
