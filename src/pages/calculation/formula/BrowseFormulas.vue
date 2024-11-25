<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el :label="'Formulas'" icon="list" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Calculation Formulas" icon="functions">
        <oa-table
          :rows="formulas"
          :columns="columns"
          @row-dblclick="selectFormula"
        >
          <template v-slot:top-right>
            <div class="row action-button on-left">
              <q-btn
                round
                size="sm"
                color="primary"
                icon="add"
                @click="createNewFormula"
                ><q-tooltip>New Formula./..</q-tooltip></q-btn
              >
            </div>
          </template>
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <q-chip square dense>
                {{ props.row.name }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-menu="props">
            <q-td :props="props">
              <div class="row items-center cursor-pointer">
                <q-btn
                  flat
                  round
                  icon="more_horiz"
                  size="sm"
                  style="border-radius: 50%"
                >
                  <q-menu fit>
                    <q-list dense style="min-width: 100px">
                      <q-item clickable :to="'/calc/formula/' + props.row.id">
                        <q-item-section>
                          <q-icon name="info" />
                        </q-item-section>
                        <q-item-section>Details</q-item-section>
                      </q-item>
                      <q-item clickable @click="deleteFormula(props.row)">
                        <q-item-section>
                          <q-icon name="delete" />
                        </q-item-section>
                        <q-item-section>Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-td>
          </template>
        </oa-table>
      </oa-section>
    </div>
  </q-page>
  <DeleteFormulaDialog :ref="(el) => (deleteDialog = el)" />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import FormatUtils from "@/lib/FormatUtils.js";
import DeleteFormulaDialog from "@/pages/calculation/formula/DeleteFormulaDialog.vue";
import OaSection from "@/components/widgets/OaSection";
import OaTable from "@/components/table/OaTable.vue";

const loading = ref(true);

const showDeprecated = ref(true);

const store = useStore();
store
  .dispatch("calculations/getAllFormulas")
  .then(() => (loading.value = false));
const formulas = computed(() =>
  store.getters["calculations/getLatestFormulas"]().filter(
    (f) => showDeprecated.value || !f.deprecated
  )
);

const columns = [
  { name: "id", align: "left", label: "ID", field: "id", sortable: true },
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
  {
    name: "description",
    align: "left",
    label: "Description",
    field: "description",
    sortable: true,
  },
  {
    name: "versionNumber",
    align: "left",
    label: "Version",
    field: "versionNumber",
    sortable: true,
  },
  {
    name: "createdBy",
    align: "left",
    label: "Created By",
    field: "createdBy",
    sortable: true,
  },
  {
    name: "scope",
    align: "left",
    label: "Scope",
    field: "scope",
    sortable: true,
  },
  {
    name: "language",
    align: "left",
    label: "Language",
    field: "language",
    sortable: true,
  },
  {
    name: "formula",
    align: "left",
    label: "Formula",
    field: "formula",
    sortable: true,
    format: (val) => (val ? FormatUtils.formatTextMaxLength(val, 50) : ""),
  },
  { name: "menu", align: "left", field: "menu", sortable: false },
];

const visibleColumns = ref([]);
const router = useRouter();
const selectFormula = (e, row) => {
  router.push("/calc/formula/" + row.id);
};
const createNewFormula = () => {
  router.push("/calc/formula/0");
};

const deleteDialog = ref(null);
const deleteFormula = (row) => {
  deleteDialog.value.openDialog(row);
};

watch(formulas, () => {
  visibleColumns.value = [...columns.map((a) => a.name)];
  loading.value = false;
});
</script>
