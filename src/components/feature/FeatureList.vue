<template>
  <div v-if="!showNewFeatureTab && !showEditFeatureSection">
    <oa-section title="Features" icon="functions" :collapsible="true">
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
          selection="single" hide-selected-banner
          v-model:selected="selectedFeature"
          flat dense>

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
        <template v-slot:body-selection>
          <div/>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="row items-center cursor-pointer" @click="editMode ? onEditFeature(props.row) : onViewFeature(props.row)">
              {{ props.row.name }}
            </div>
          </q-td>
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
        <template v-if="props.editMode" v-slot:body-cell-menu="props">
          <q-td :props="props">
            <div class="row items-center cursor-pointer">
              <q-btn flat round dense icon="delete" size="sm" @click="onDeleteFeature(props.row)"/>
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
  </div>

  <new-feature v-if="showNewFeatureTab" v-model:show="showNewFeatureTab" :protocol="props.protocol" @addFeature="addNewFeature"/>
  <edit-feature v-if="showEditFeatureSection" v-model:show="showEditFeatureSection" />

  <div class="q-pt-md">
    <view-feature v-if="showFeatureDetails" v-model:show="showFeatureDetails" :feature="featureStore.feature"/>
  </div>

  <table-config v-model:show="configDialog" v-model:visibleColumns="visibleColumns" v-model:columns="columns"/>
</template>

<script setup>

import {computed, ref} from "vue";
import {useRouter} from 'vue-router';
import FilterUtils from "@/lib/FilterUtils";

import {useFeatureStore} from "@/stores/feature";
import {useProtocolStore} from "@/stores/protocol";
import {useFormulasStore} from "@/stores/formulas";

import OaSection from "@/components/widgets/OaSection";
import EditFeature from "@/components/feature/EditFeature";
import ViewFeature from "@/components/feature/ViewFeature";
import NewFeature from "@/components/feature/NewFeature";
import TableConfig from "@/components/table/TableConfig";

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

const features = computed(() => { return protocolStore.getFeatures() })
const selectedFeature = ref([]);

const visibleColumns = columns.value.map(a => a.name)
const configDialog = ref(false)
const filter = ref('')
const filterMethod = FilterUtils.defaultFilterMethod()

const getFormulaName = (id) => {
  const formula = formulasStore.getFormulaById(parseInt(id))
  return (formula || {}).name;
}

const showEditFeatureSection = ref(false)
const showFeatureDetails = ref(false)
const showNewFeatureTab = ref(false)

const addNewFeature = (feature) => {
  emit('addFeature', feature)
}

const onViewFeature = (feature) => {
  selectedFeature.value = [feature];
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

const showFormulaInfo = (formulaId) => {
  router.push("/calc/formula/" + formulaId);
}

</script>
