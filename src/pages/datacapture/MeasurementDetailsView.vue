<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="meas">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Measurements'" icon="list" :to="'/datacapture/meas'"/>
    <q-breadcrumbs-el :label="meas.barcode" icon="text_snippet"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section v-if="!meas" title="Loading..." icon="text_snippet"/>
      <oa-section v-else :title="meas.barcode" icon="text_snippet" :collapsible="true">
        <div class="row q-pa-md">
          <div class="col-4">
            <q-field label="ID" stack-label borderless dense>
              <template v-slot:control>
                {{ meas.id }}
              </template>
            </q-field>
            <q-field label="Barcode" stack-label borderless dense>
              <template v-slot:control>
                {{ meas.barcode }}
              </template>
            </q-field>
            <q-field label="Dimensions" stack-label borderless dense>
              <template v-slot:control>
                <div class="self-center full-width no-outline">
                  {{ meas.rows }} x {{ meas.columns }} ({{ meas.rows * meas.columns }} wells)
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-4">
            <q-field label="WellData Columns" stack-label borderless dense>
              <template v-slot:control>
                {{ meas?.wellColumns?.length || 0 }}
              </template>
            </q-field>
            <q-field label="SubWellData Columns" stack-label borderless dense>
              <template v-slot:control>
                {{ meas?.subWellColumns?.length || 0 }}
              </template>
            </q-field>
            <q-field label="Image Channels" stack-label borderless dense>
              <template v-slot:control>
                {{ (meas?.imageChannels || []).join(', ') || "No image data" }}
              </template>
            </q-field>
          </div>
          <div class="col-4">
            <q-field label="Created On" stack-label dense borderless>
                <template v-slot:control>
                    {{ FormatUtils.formatDate(meas?.createdOn) }}
                </template>
            </q-field>
            <q-field label="Created By" stack-label dense borderless>
                <template v-slot:control>
                    <div class="q-pt-xs">
                        <UserChip :id="meas?.createdBy"/>
                    </div>
                </template>
            </q-field>
          </div>
        </div>
      </oa-section>

      <div class="q-pt-sm">
        <q-tabs inline-label dense no-caps class="oa-section-title" v-model="activeTab" align="left">
          <q-tab name="wellData" icon="table_rows" label="Well Data"/>
          <q-tab name="subWellData" icon="table_rows" label="SubWell Data"/>
          <q-tab name="imageData" icon="image" label="Image Data"/>
        </q-tabs>
        <div class="row oa-section-body">
          <q-tab-panels v-model="activeTab" animated class="full-width">
            <q-tab-panel name="wellData" class="q-px-none">
              <q-table
                  table-header-class="text-grey"
                  flat dense
                  :rows="wellData"
                  :columns="wellDataColumns"
                  row-key="id"
                  :pagination="{ rowsPerPage: 100 }"
                  :filter="filter"
                  :filter-method="filterMethod"
                  :loading="loading"
              >
                <template v-slot:top-left>
                  <div v-if="wellNrLimit > 0">
                    <span class="text-info">Showing first {{ wellNrLimit }} wells.</span>
                    <q-btn class="on-right" size="xs" color="info" @click="wellNrLimit = -1">Load all</q-btn>
                  </div>
                </template>
                <template v-slot:top-right>
                  <div class="row">
                    <q-input outlined dense debounce="300" v-model="filter.name.term" placeholder="Search">
                      <template v-slot:append>
                        <q-icon name="search"/>
                      </template>
                    </q-input>
                  </div>
                </template>
              </q-table>
            </q-tab-panel>
            <q-tab-panel name="subWellData" class="q-px-none">
              <div class="row q-pa-md">
                <div class="col-8">
                  <q-select :options="wellPositions" v-model="selectedWellPosition"
                            @update:model-value="loadSubWellData" label="Select well" dense/>
                  <q-select :options="subWellColumns" v-model="selectedSubWellColumns"
                            @update:model-value="loadSubWellData" label="Select sub-well column"
                            dense multiple>
                    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                      <q-item v-bind="itemProps">
                        <q-item-section>
                          <q-item-label v-html="opt" />
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
              <div>
                <q-table
                    table-header-class="text-grey"
                    flat dense
                    :rows="subWellDataRows"
                    :columns="subWellDataColumns"
                    row-key="id"
                    :pagination="{ rowsPerPage: 100 }"
                    :loading="loading">
                </q-table>
              </div>
            </q-tab-panel>
            <q-tab-panel name="imageData" class="q-px-none">
              <div class="row q-px-sm">
                <div class="col-8">
                  <WellGrid :plate="plate"
                            :wells="plate.wells"
                            :wellImageFunction="wellImageFunction"
                            @wellSelection="handleWellSelection"/>
                </div>
                <div class="col-4 q-px-sm">
                  <WellImageViewer></WellImageViewer>
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
import {computed, ref} from 'vue'
import {useStore} from "vuex";
import {useRoute} from 'vue-router'

import OaSection from "@/components/widgets/OaSection";
import UserChip from "@/components/widgets/UserChip";
import WellImageViewer from "@/components/image/WellImageViewer";
import WellGrid from "@/components/well/WellGrid";

import WellUtils from "@/lib/WellUtils";
import FilterUtils from "@/lib/FilterUtils";
import FormatUtils from "@/lib/FormatUtils";

const activeTab = ref('wellData');
const loading = ref(true);

const store = useStore();
const route = useRoute();
const measId = parseInt(route.params.id);

const meas = computed(() => store.getters['measurements/getById'](measId));
store.dispatch('measurements/loadById', measId);

const wellPositions = computed(() => WellUtils.getWellPositions(meas.value.rows, meas.value.columns))
const subWellColumns = computed(() => meas.value.subWellColumns)
const selectedWellPosition = ref(null)
const selectedSubWellColumns = ref([])

const wellNrLimit = ref(20);
const wells = computed(() => {
  if (!meas.value) return [];
  let nrs = [...Array(meas.value.rows * meas.value.columns).keys()].map(i => i + 1);
  return nrs.map(nr => {
    let pos = WellUtils.getWellPosition(nr, meas.value.columns);
    let coord = WellUtils.getWellCoordinate(pos[0], pos[1]);
    return {nr: nr, row: pos[0], columns: pos[1], coord: coord};
  });
});

const wellDataColumns = ref([
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true}
]);

const wellData = computed(() => {
  let dataMap = store.getters['measurements/getWellData'](measId) || {};
  let columns = Object.keys(dataMap).sort();
  ((wellNrLimit.value > 0) ? wells.value.slice(0, wellNrLimit.value) : wells.value).forEach(well => {
    wellDataColumns.value.push({
      name: well.coord,
      align: 'left',
      label: well.coord,
      field: row => (Math.round(row.values[well.nr - 1] * 100) / 100),
      sortable: true
    });
  });
  return columns.map(col => {
    return {name: col, values: dataMap[col]}
  });
});
store.dispatch('measurements/loadWellData', measId).then(() => loading.value = false);

const subWellDataColumns = ref([
  {name: 'wellNr', align: 'left', label: 'WellNr', field: 'wellNr', sortable: true},
])
const subWellDataRows = computed(() => store.getters['measurements/getSubWellData'](measId, WellUtils.getWellNrByWellPos(selectedWellPosition.value, meas.value.columns), selectedSubWellColumns.value))

const plate = computed(() => {
  return {
    rows: meas.value.rows,
    columns: meas.value.columns,
    wells: [...Array(meas.value.rows * meas.value.columns).keys()].map(i => {
      let pos = WellUtils.getWellPosition(i + 1, meas.value.columns);
      return { row: pos[0], column: pos[1], nr: i + 1, measId: measId };
    })
  }
});

const wellImageFunction = (well) => {
  // console.log(JSON.stringify({ measId: meas.value?.id, wellNr: well.nr }));
  // const img = store.getters['measurements/getMeasImage']({ measId: meas.value.id, wellNr: well.nr });
  // if (!img) store.dispatch('measurements/loadMeasImage', { measId: meas.value.id, wellNr: well.nr, scale: 0.01 });
  // return img;
  return "";
}

const loadSubWellData = () => {
  const wellNr = WellUtils.getWellNrByWellPos(selectedWellPosition.value, meas.value.columns)
  store.dispatch('measurements/loadSubWellData', {measId: meas.value.id, wellNr: wellNr, subWellColumns: selectedSubWellColumns.value})
  subWellDataColumns.value = [{name: 'wellNr', align: 'left', label: 'WellNr', field: 'wellNr', sortable: true}]
  for (const swColumn of selectedSubWellColumns.value) {
    subWellDataColumns.value.push({name: [swColumn], align: 'left', label: [swColumn], field: [swColumn], sortable: true})
  }
}

const handleWellSelection = (selectedWells) => {
  // console.log("handleWellSelection event: " + JSON.stringify(selectedWells))
  // selectedWells.forEach(well => {
  //   store.dispatch('measurements/loadMeasImage', { measId: meas.value.id, wellNr: well.nr, scale: 0.01 });
  // })
}

const filter = ref({
  name: {
    term: "",
    definition: wellDataColumns.value.find(col => col.name === 'name'),
    enabled: true
  }
})
const filterMethod = FilterUtils.defaultFilterMethod();

</script>
