<template>
  <div class="q-pa-md" v-if="!showNewFeatureTab">
    <oa-section-header :title="'Features'" :icon="'functions'"/>
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

      <template v-slot:top-left>
        <div class="col action-button on-left">
          <q-btn size="sm" icon="add" class="oa-button" label="Add Feature" @click="showNewFeatureTab = true"/>
        </div>
      </template>
      <template v-slot:top-right>
        <div class="row">
          <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
          <q-btn flat round color="primary" icon="settings" class="on-right" @click="configdialog=true"/>
        </div>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <router-link :to="'/feature/' + props.row.id" class="nav-link">
            <div class="row items-center cursor-pointer">
              {{ props.row.name }}
            </div>
          </router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-formulaId="props">
        <q-td :props="props">
          {{getFormulaName(props.row.formulaId)}}
          <q-icon name="info" size="xs" class="text-info cursor-pointer" @click="showFormulaTooltip[props.rowIndex] = true">
            <q-tooltip v-model="showFormulaTooltip[props.rowIndex]" :delay="2000">
              <FormulaInspector :formulaId="props.row.formulaId"/>
            </q-tooltip>
          </q-icon>
        </q-td>
      </template>
      <template v-slot:body-cell-menu="props">
        <q-td :props="props">
          <div class="row items-center cursor-pointer">
            <q-btn flat round icon="more_horiz" size="sm" >
              <q-menu>
                <q-list>
                  <q-item dense clickable @click="selectedFeature=props.row;showEditFeatureSection=true">
                    <q-item-section avatar><q-icon name="edit"/></q-item-section>
                    <q-item-section>Edit feature</q-item-section>
                  </q-item>
                  <q-item dense clickable @click="selectedFeature=props.row;$refs.deleteDialogFeature.showDialog = true">
                    <q-item-section avatar><q-icon name="delete"/></q-item-section>
                    <q-item-section>Delete feature</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
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

  <NewFeature v-if="showNewFeatureTab" v-model:show="showNewFeatureTab" :protocol="props.protocol" @addFeature="addNewFeature"/>
  <edit-feature v-if="showEditFeatureSection" v-model:show="showEditFeatureSection" v-model:originalFeature="selectedFeature"/>

  <delete-dialog ref="deleteDialogFeature" v-model:id="selectedFeature.id" v-model:name="selectedFeature.name" :objectClass="'feature'" />
  <table-config v-model:show="configdialog" v-model:visibleColumns="visibleColumns" v-model:columns="columns"/>
</template>

<script setup>

import {useStore} from "vuex";
import {computed, ref} from "vue";
import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import FilterUtils from "@/lib/FilterUtils";
import TableConfig from "@/components/table/TableConfig";
import EditFeature from "@/components/protocol/EditFeature";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import NewFeature from "@/components/protocol/NewFeature";
import FormulaInspector from "@/components/widgets/FormulaInspector";

const store = useStore()

const loading = ref(false);

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'format', align: 'left', label: 'Format', field: 'format', sortable: true},
  {name: 'type', align: 'left', label: 'Type', field: 'type', sortable: true},
  {name: 'formulaId', align: 'left', label: 'Formula', field: 'formula.id', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
])

const pagination = {
  rowsPerPage: 10
}

const props = defineProps(['protocol'])
const emit = defineEmits(['addFeature'])

const features = props.protocol.id ? computed(() => store.getters['features/getByProtocolId'](props.protocol?.id)) : props.protocol.features;
if (props.protocol.id)
  store.dispatch("features/loadByProtocolId", props.protocol?.id);

const visibleColumns = columns.value.map(a => a.name)
const configdialog = ref(false)
const filter = ref('')
const filterMethod = FilterUtils.defaultTableFilter()

const getFormulaName = (id) => {
  const formula = computed(() => store.getters['calculations/getFormula'](id))
  return (formula.value || {}).name;
}

const showFormulaTooltip = ref([])
const showEditProtocolDialog = ref(false)
const showEditFeatureSection = ref(false)
const showNewFeatureTab = ref(false)
const selectedFeature = ref({})

const addNewFeature = (feature) => {
  emit('addFeature', feature)
}

</script>
