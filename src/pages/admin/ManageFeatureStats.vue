<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Manage Feature Stats" icon="list"/>
  </q-breadcrumbs>
  
  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Default Feature Stats" icon="functions">
        <oa-table :rows="defaultFeatureStats" :columns="featureStatColumns" :pagination="{ rowsPerPage: 50, sortBy: 'name' }">
          <template v-slot:top-left>
            <q-btn size="sm" color="primary" icon="add" label="New..." @click="createNewDefaultFeatureStat"/>
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
              <div class="col items-center cursor-pointer">
                <q-btn flat round dense icon="edit" size="sm" @click="editFeatureStat(props.row)"/>
                <q-btn flat round dense icon="delete" color="red" size="sm" @click="askDeleteFeatureStat(props.row)"/>
              </div>
            </q-td>
          </template>
        </oa-table>
      </oa-section>
    </div>
  </q-page>
  <confirm-dialog v-model:show="showDeleteDialog" title="Delete Default Feature Stat" :message="`Are you sure you want to delete this default feature stat: ${featureStatToDelete?.name}?`" @onConfirm="doDeleteFeatureStat"/>
  <edit-default-feature-stat-dialog v-model:show="showEditDialog" :featureStat="featureStatToEdit" />
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useFeatureStore} from "@/stores/feature";
import {useFormulasStore} from "@/stores/formulas";
import OaSection from "@/components/widgets/OaSection";
import OaTable from "@/components/table/OaTable.vue";
import ConfirmDialog from "@/components/widgets/ConfirmDialog";
import EditDefaultFeatureStatDialog from '@/components/featurestat/EditDefaultFeatureStatDialog.vue';

const featureStore = useFeatureStore();
const formulasStore = useFormulasStore();

onMounted(() => {
  featureStore.loadDefaultFeatureStats();
  formulasStore.loadAllFormulas();
});

const defaultFeatureStats = computed(() => featureStore.defaultFeatureStats);

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

function createNewDefaultFeatureStat() {
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

const showDeleteDialog = ref(false);
const featureStatToDelete = ref(null);
function askDeleteFeatureStat(featureStat) {
  featureStatToDelete.value = featureStat;
  showDeleteDialog.value = true;
}
async function doDeleteFeatureStat() {
  await featureStore.deleteDefaultFeatureStat(featureStatToDelete.value.id);
}

</script>
