<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el icon="list" :label="'Templates'" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Plate Layout Templates" icon="border_outer">
        <oa-table
          :rows="templates"
          :columns="columns"
          @row-dblclick="selectTemplate"
        >
          <template v-slot:top-right>
            <div class="row action-button on-left">
              <router-link :to="{ name: 'newPlateTemplate' }" class="nav-link">
                <q-btn round size="sm" color="primary" icon="add">
                  <q-tooltip>New Plate Template</q-tooltip></q-btn
                >
              </router-link>
            </div>
          </template>
        </oa-table>
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import FormatUtils from "@/lib/FormatUtils.js";
import templatesGraphQlAPI from "@/api/graphql/templates";

import OaSection from "@/components/widgets/OaSection";
import OaTable from "@/components/table/OaTable.vue";
import { useLoadingHandler } from "@/composable/loadingHandler";

const templates = ref([]);
const loading = useLoadingHandler();
onMounted(async () => {
  await loading.handleLoadingDuring(fetchPlateTemplates());
});

const columns = ref([
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
    name: "dimensions",
    align: "left",
    label: "Dimensions",
    sortable: true,
    field: (t) => `${t.rows} x ${t.columns}`,
  },
  { name: "tags", align: "left", label: "Tags", field: "tags", sortable: true },
  {
    name: "createdOn",
    align: "left",
    label: "Created On",
    field: "createdOn",
    sortable: true,
    format: FormatUtils.formatDate,
  },
  {
    name: "createdBy",
    align: "left",
    label: "Created By",
    field: "createdBy",
    sortable: true,
  },
  {
    name: "updatedOn",
    align: "left",
    label: "Updated On",
    field: "updatedOn",
    sortable: true,
    format: FormatUtils.formatDate,
  },
  {
    name: "updatedBy",
    align: "left",
    label: "Updated By",
    field: "updatedBy",
    sortable: true,
  },
]);

const router = useRouter();
const selectTemplate = (event, row) => {
  router.push("/template/" + row.id);
};

const loadingHandler = useLoadingHandler();
const fetchPlateTemplates = async () => {
  await loadingHandler.handleLoadingDuring(
    templatesGraphQlAPI.templates().then((data) => {
      templates.value = data.plateTemplates;
    })
  );
  // const {onResult, onError} = templatesGraphQlAPI.templates()
  // onResult(({data}) => templates.value = data.plateTemplates)
  //TODO: implement onError event handling
};
</script>