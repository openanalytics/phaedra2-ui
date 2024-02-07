<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Formulas'" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Calculation Formulas" icon="functions">
        <q-table
            class="full-width"
            table-header-class="text-grey"
            :rows="formulas"
            :columns="columns"
            :visible-columns="visibleColumns"
            row-key="id"
            column-key="name"
            :filter="filter"
            :filter-method="filterMethod"
            :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
            :loading="loading"
            separator="cell"
            flat square dense
        >
          <template v-slot:top-left>
            <q-btn size="sm" color="primary" icon="add" label="New Formula..." @click="createNewFormula"/>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{col.label}}
              </q-th>
            </q-tr>
            <q-tr :props="props">
              <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
            </q-tr>
          </template>
          <template v-slot:body-cell-name="props">
            <q-td :props="props" class="cursor-pointer" @click="selectFormula(props.row)">
              <q-chip square dense>
                {{ props.row.name }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-createdBy="props">
            <q-td :props="props">
              <UserChip :id="props.row.createdBy"/>
            </q-td>
          </template>
          <template v-slot:body-cell-menu="props">
            <q-td :props="props">
              <div class="row items-center cursor-pointer">
                <q-btn flat round icon="more_horiz" size="sm" style="border-radius: 50%;">
                  <q-menu fit>
                    <q-list dense style="min-width: 100px">
                      <q-item clickable :to="'/calc/formula/' + props.row.id">
                        <q-item-section>
                          <q-icon name="info"/>
                        </q-item-section>
                        <q-item-section>Details</q-item-section>
                      </q-item>
                      <q-item clickable @click="deleteFormula(props.row)">
                        <q-item-section>
                          <q-icon name="delete"/>
                        </q-item-section>
                        <q-item-section>Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </oa-section>
    </div>
  </q-page>
  <DeleteFormulaDialog :ref="el => deleteDialog = el"/>
</template>

<script setup>
import {computed, ref, watch, watchEffect} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import FormatUtils from "@/lib/FormatUtils.js"
import FilterUtils from "@/lib/FilterUtils.js"
import DeleteFormulaDialog from "@/pages/calculation/formula/DeleteFormulaDialog.vue";
import UserChip from "@/components/widgets/UserChip";
import OaSection from "@/components/widgets/OaSection";
import ColumnFilter from "@/components/table/ColumnFilter";

const loading = ref(true);

const showDeprecated = ref(true);

const store = useStore()
store.dispatch('calculations/getAllFormulas').then(() => loading.value = false);
const formulas = computed(() => store.getters['calculations/getLatestFormulas']().filter(f => showDeprecated.value || !f.deprecated));

const columns = [
    {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
    {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
    {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
    {name: 'versionNumber', align: 'left', label: 'Version', field: 'versionNumber', sortable: true},
    {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
    {name: 'scope', align: 'left', label: 'Scope', field: 'scope', sortable: true},
    {name: 'language', align: 'left', label: 'Language', field: 'language', sortable: true},
    {
        name: 'formula', align: 'left', label: 'Formula', field: 'formula', sortable: true,
        format: val => val ? FormatUtils.formatTextMaxLength(val, 50) : ''
    },
    {name: 'menu', align: 'left', field: 'menu', sortable: false}
];

const filter = FilterUtils.makeFilter(columns);
const filterMethod = FilterUtils.defaultFilterMethod();

const visibleColumns = ref([])

const router = useRouter();

const selectFormula = (row) => {
    router.push("/calc/formula/" + row.id);
}

const createNewFormula = () => {
    router.push("/calc/formula/0");
}

const deleteDialog = ref(null);
const deleteFormula = (row) => {
    deleteDialog.value.openDialog(row);
}

const updateVisibleColumns = (columns) => {
  visibleColumns.value = [...columns]
}

watch(formulas, () => {
  visibleColumns.value = [...columns.map(a => a.name)];
  loading.value = false
})
</script>
