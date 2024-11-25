<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="measurementStore.measurement">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el
      :label="'Measurements'"
      icon="list"
      :to="'/datacapture/meas'"
    />
    <q-breadcrumbs-el
      :label="measurementStore.measurement.barcode"
      icon="text_snippet"
    />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section
        v-if="!measurementStore.measurement"
        title="Loading..."
        icon="text_snippet"
      />
      <oa-section
        v-else
        :title="measurementStore.measurement.barcode"
        icon="text_snippet"
        :collapsible="true"
      >
        <div class="row q-pa-md">
          <div class="col-4">
            <q-field label="ID" stack-label borderless dense>
              <template v-slot:control>
                {{ measurementStore.measurement.id }}
              </template>
            </q-field>
            <q-field label="Barcode" stack-label borderless dense>
              <template v-slot:control>
                {{ measurementStore.measurement.barcode }}
              </template>
            </q-field>
            <q-field label="Dimensions" stack-label borderless dense>
              <template v-slot:control>
                <div class="self-center full-width no-outline">
                  {{ measurementStore.measurement.rows }} x
                  {{ measurementStore.measurement.columns }} ({{
                    measurementStore.measurement.rows *
                    measurementStore.measurement.columns
                  }}
                  wells)
                </div>
              </template>
            </q-field>
            <!--            <q-field label="Tags" stack-label dense borderless>-->
            <!--              <template v-slot:control>-->
            <!--                <tag-list :tags="[]" :read-only="true"-->
            <!--                          @addTag="onAddTag" @removeTag="onRemoveTag"-->
            <!--                          class="q-pt-xs"/>-->
            <!--              </template>-->
            <!--            </q-field>-->
          </div>
          <div class="col-4">
            <q-field label="WellData Columns" stack-label borderless dense>
              <template v-slot:control>
                {{ measurementStore.measurement?.wellColumns?.length || 0 }}
              </template>
            </q-field>
            <q-field label="SubWellData Columns" stack-label borderless dense>
              <template v-slot:control>
                {{ measurementStore.measurement?.subWellColumns?.length || 0 }}
              </template>
            </q-field>
            <q-field label="Image Channels" stack-label borderless dense>
              <template v-slot:control>
                {{
                  (measurementStore.measurement?.imageChannels || []).join(
                    ", "
                  ) || "No image data"
                }}
              </template>
            </q-field>
          </div>
          <div class="col-4">
            <q-field label="Created On" stack-label dense borderless>
              <template v-slot:control>
                {{
                  FormatUtils.formatDate(
                    measurementStore.measurement?.createdOn
                  )
                }}
              </template>
            </q-field>
            <q-field label="Created By" stack-label dense borderless>
              <template v-slot:control>
                <div class="q-pt-xs">
                  <UserChip :id="measurementStore.measurement?.createdBy" />
                </div>
              </template>
            </q-field>
          </div>
        </div>
      </oa-section>

      <div class="q-pt-sm">
        <q-tabs
          inline-label
          dense
          no-caps
          class="oa-section-title"
          v-model="activeTab"
          align="left"
        >
          <q-tab name="wellData" icon="table_rows" label="Well Data" />
          <q-tab name="subWellData" icon="table_rows" label="SubWell Data" />
          <q-tab name="imageData" icon="image" label="Image Data" />
        </q-tabs>
        <div class="row oa-section-body">
          <q-tab-panels v-model="activeTab" animated class="full-width">
            <q-tab-panel name="wellData" class="q-px-none">
              <q-table
                table-header-class="text-grey"
                flat
                dense
                :rows="wellData"
                :columns="wellDataColumns"
                row-key="id"
                :pagination="{ rowsPerPage: 100 }"
                :filter="filter"
                :filter-method="filterMethod"
                :loading="loading"
                separator="cell"
                bordered
              >
                <template v-slot:top-left>
                  <div v-if="wellNrLimit > 0">
                    <span class="text-info"
                      >Showing first {{ wellNrLimit }} wells.</span
                    >
                    <q-btn
                      class="on-right"
                      size="xs"
                      color="info"
                      @click="wellNrLimit = -1"
                      >Load all</q-btn
                    >
                  </div>
                </template>
                <template v-slot:top-right>
                  <div class="row">
                    <q-input
                      outlined
                      dense
                      debounce="300"
                      v-model="filter.name.term"
                      placeholder="Search"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </template>
              </q-table>
            </q-tab-panel>
            <q-tab-panel name="subWellData" class="q-px-none">
              <div class="row q-pa-md">
                <div class="col-8">
                  <q-select
                    :options="
                      WellUtils.getWellPositions(
                        measurementStore.measurement.rows,
                        measurementStore.measurement.columns
                      )
                    "
                    v-model="selectedWellPosition"
                    @update:model-value="loadSubWellData"
                    label="Select well"
                    dense
                  />
                  <q-select
                    :options="measurementStore.measurement.subWellColumns"
                    v-model="selectedSubWellColumns"
                    @update:model-value="loadSubWellData"
                    label="Select sub-well column"
                    dense
                    multiple
                  >
                    <template
                      v-slot:option="{ itemProps, opt, selected, toggleOption }"
                    >
                      <q-item v-bind="itemProps">
                        <q-item-section>
                          <q-item-label v-html="opt" />
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle
                            :model-value="selected"
                            @update:model-value="toggleOption(opt)"
                          />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
              <div>
                <q-table
                  table-header-class="text-grey"
                  flat
                  dense
                  :rows="measurementStore.subWellData"
                  :columns="subWellDataColumns"
                  row-key="id"
                  :pagination="{ rowsPerPage: 100 }"
                  :loading="loading"
                  separator="cell"
                  bordered
                >
                </q-table>
              </div>
            </q-tab-panel>
            <q-tab-panel name="imageData" class="q-px-none">
              <div class="row q-px-sm">
                <div class="col-4">
                  <WellGrid
                    :plate="plate"
                    :wells="plate.wells"
                    @wellSelection="handleWellSelection"
                  />
                </div>
                <div class="col-8 q-px-sm">
                  <WellImageViewer />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import OaSection from "@/components/widgets/OaSection";
import UserChip from "@/components/widgets/UserChip";
import WellImageViewer from "@/components/image/WellImageViewer";
import WellGrid from "@/components/well/WellGrid";

import WellUtils from "@/lib/WellUtils";
import FilterUtils from "@/lib/FilterUtils";
import FormatUtils from "@/lib/FormatUtils";
import TagList from "@/components/tag/TagList.vue";
import metadataAPI from "@/api/metadata";
import { useMeasurementStore } from "@/stores/measurement";
import { useLoadingHandler } from "@/composable/loadingHandler";

const activeTab = ref("wellData");
const loading = ref(true);

const route = useRoute();
const measId = parseInt(route.params.id);

const loadingHandler = useLoadingHandler();
const measurementStore = useMeasurementStore();
onMounted(async () => {
  await loadingHandler.handleLoadingDuring(prepareView());
  loading.value = false;
});

async function prepareView() {
  await measurementStore.loadMeasurementById(measId);
  await measurementStore.loadWellData(measId);
  await measurementStore.loadAllRenderConfigs();
}

const wellNrLimit = ref(20);
const wells = computed(() => {
  if (!measurementStore.measurement) return [];
  let nrs = [
    ...Array(
      measurementStore.measurement.rows * measurementStore.measurement.columns
    ).keys(),
  ].map((i) => i + 1);
  return nrs.map((nr) => {
    let pos = WellUtils.getWellPosition(
      nr,
      measurementStore.measurement.columns
    );
    let coord = WellUtils.getWellCoordinate(pos[0], pos[1]);
    return { nr: nr, row: pos[0], columns: pos[1], coord: coord };
  });
});
const wellDataColumns = ref([
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
]);
const wellData = computed(() => {
  let dataMap = measurementStore.wellData;
  let columns = Object.keys(dataMap).sort();
  (wellNrLimit.value > 0
    ? wells.value.slice(0, wellNrLimit.value)
    : wells.value
  ).forEach((well) => {
    wellDataColumns.value.push({
      name: well.coord,
      align: "left",
      label: well.coord,
      field: (row) => Math.round(row.values[well.nr - 1] * 100) / 100,
      sortable: true,
    });
  });
  return columns.map((col) => {
    return { name: col, values: dataMap[col] };
  });
});

const selectedWellPosition = ref(null);
const selectedSubWellColumns = ref([]);
const subWellDataColumns = ref([]);
const loadSubWellData = async () => {
  const wellNr = WellUtils.getWellNrByWellPos(
    selectedWellPosition.value,
    measurementStore.measurement.columns
  );
  await loadingHandler.handleLoadingDuring(
    measurementStore.loadSubWellData({
      wellNr: wellNr,
      subWellColumns: selectedSubWellColumns.value,
    })
  );
  subWellDataColumns.value = [];
  for (const swColumn of selectedSubWellColumns.value) {
    subWellDataColumns.value.push({
      name: [swColumn],
      align: "left",
      label: [swColumn],
      field: [swColumn],
      sortable: true,
    });
  }
};

const plate = computed(() => {
  return {
    rows: measurementStore.measurement.rows,
    columns: measurementStore.measurement.columns,
    wells: [
      ...Array(
        measurementStore.measurement.rows * measurementStore.measurement.columns
      ).keys(),
    ].map((i) => {
      let pos = WellUtils.getWellPosition(
        i + 1,
        measurementStore.measurement.columns
      );
      return {
        row: pos[0],
        column: pos[1],
        nr: i + 1,
        measId: measurementStore.measurement.id,
      };
    }),
  };
});

// const wellImageFunction = async (well) => {
//   const img = measurementStore.getWellImage(1);
//   console.log(img)
//   if (!img) await measurementStore.loadMeasImage({ wellNr: 1, scale: 0.01, renderConfigId: 4, channels: [ "NucStain" ] })
//   return measurementStore.getWellImage(1);
//   return null;
// }

const handleWellSelection = (selectedWells) => {
  // console.log("handleWellSelection event: " + JSON.stringify(selectedWells))
  // selectedWells.forEach(well => {
  //   store.dispatch('measurements/loadMeasImage', { measId: meas.value.id, wellNr: well.nr, scale: 0.01 });
  // })
};

const addTag = async (newTag) => {
  // await metadataAPI.addTag({'objectId': measurement.id, 'objectClass': 'EXPERIMENT', 'tag': newTag })
  // this.loadExperiment(this.experiment.id)
};
const deleteTag = (tag) => {
  // await metadataAPI.removeTag({'objectId': this.experiment.id, 'objectClass': 'EXPERIMENT', 'tag': tag})
  // this.loadExperiment(this.experiment.id)
};

const filter = ref({
  name: {
    term: "",
    definition: wellDataColumns.value.find((col) => col.name === "name"),
    enabled: true,
  },
});
const filterMethod = FilterUtils.defaultFilterMethod();
</script>
