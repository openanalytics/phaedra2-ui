<template>
  <oa-table :rows="featureStats" :columns="featureStatColumns" :pagination="{ rowsPerPage: 50, sortBy: 'name' }">
    <template v-slot:top-left v-if="editable">
      <q-btn size="sm" color="primary" icon="add" label="New..." @click="createNewFeatureStat" />
    </template>
    <template v-slot:body-cell-isPlateStat="props">
      <q-td :props="props">
        <div>
          <q-icon v-if="props.value" name="check" color="green" size="xs" />
          <q-icon v-else name="close" color="red" size="xs" />
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-isWellTypeStat="props">
      <q-td :props="props">
        <div>
          <q-icon v-if="props.value" name="check" color="positive" size="xs" />
          <q-icon v-else name="close" color="negative" size="xs" />
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-formula="props">
      <q-td :props="props">
        <div>
          <q-chip square dense class="q-ma-none">{{ props.value }}</q-chip>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-formulaVersion="props">
      <q-td :props="props">
        <div>
          <q-chip square dense class="q-ma-none">{{ props.value }}</q-chip>
          <span v-if="getHigherVersionFormula(props.row.formulaId)" class="on-right">
            <q-icon name="warning" color="warning" size="xs">
              <q-tooltip>A newer version is available for this formula: {{ getHigherVersionFormula(props.row.formulaId).versionNumber }}</q-tooltip>
            </q-icon>
          </span>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-menu="props">
      <q-td :props="props">
        <div class="col items-center cursor-pointer" v-if="editable">
          <q-btn flat round dense icon="edit" size="sm" @click="editFeatureStat(props.row)"/>
          <q-btn flat round dense icon="delete" color="red" size="sm" @click="askDeleteFeatureStat(props.row)"/>
        </div>
      </q-td>
    </template>
  </oa-table>

  <confirm-dialog v-model:show="showDeleteDialog" title="Delete Feature Stat" :message="`Are you sure you want to delete this feature stat: ${featureStatToDelete?.name}?`" @onConfirm="doDeleteFeatureStat"/>
  <edit-feature-stat-dialog v-model:show="showEditDialog" :featureStat="featureStatToEdit" @onSaveStat="doSaveStat" />
</template>

<script setup>
import {ref} from 'vue';
import {useFormulasStore} from "@/stores/formulas";
import OaTable from "@/components/table/OaTable.vue";
import ConfirmDialog from "@/components/widgets/ConfirmDialog";
import EditFeatureStatDialog from '@/components/featurestat/EditFeatureStatDialog.vue';

const formulasStore = useFormulasStore();

const props = defineProps(['featureStats', 'editable']);
const emits = defineEmits(['onSaveStat', 'onDeleteStat']);

const featureStatColumns = [
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true, style: 'width: 80px;'},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'isPlateStat', align: 'left', label: 'Is Plate Stat?', field: 'plateStat', sortable: true},
  {name: 'isWellTypeStat', align: 'left', label: 'Is WellType Stat?', field: 'welltypeStat', sortable: true},
  {
    name: 'formula', align: 'left', label: 'Formula', sortable: true,
    field: row => formulasStore.getFormulaById(row.formulaId)?.name
  },
  {
    name: 'formulaVersion', align: 'left', label: 'Formula Version', sortable: true,
    field: row => formulasStore.getFormulaById(row.formulaId)?.versionNumber
  },
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
];

function getHigherVersionFormula(id) {
  return formulasStore.getHigherVersionFormula(id);
}

function createNewFeatureStat() {
  featureStatToEdit.value = {
    name: "New Feature Stat",
    plateStat: true,
    welltypeStat: true
  };
  showEditDialog.value = true;
}

const showEditDialog = ref(false);
const featureStatToEdit = ref(null);
function editFeatureStat(featureStat) {
  featureStatToEdit.value = featureStat;
  showEditDialog.value = true;
}

function doSaveStat(stat) {
  emits('onSaveStat', stat);
}

const showDeleteDialog = ref(false);
const featureStatToDelete = ref(null);
function askDeleteFeatureStat(featureStat) {
  featureStatToDelete.value = featureStat;
  showDeleteDialog.value = true;
}

function doDeleteFeatureStat() {
  emits('onDeleteStat', featureStatToDelete.value.id);
}

</script>