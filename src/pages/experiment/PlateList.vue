<template>
  <q-table
      table-header-class="text-grey"
      :rows="plates"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10, sortBy: 'barcode' }"
      :filter="filter"
      :filter-method="filterMethod"
      :loading="loading"
      :visible-columns="visibleColumns"
      flat square dense
      @row-contextmenu="selectPlate"
  >
    <template v-slot:top-left>
        <q-btn size="sm" icon="add" label="New Plate" @click="openNewPlateTab" class="oa-button"/>
    </template>
    <template v-slot:top-right>
      <div class="row">
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
      </div>
    </template>
    <template v-slot:body-cell-barcode="props">
      <q-td :props="props">
        <router-link :to="'/plate/' + props.row.id" class="nav-link">
          <div class="row items-center cursor-pointer">
            <q-icon name="view_module" class="icon q-pr-sm"/>
            {{ props.row.barcode }}
          </div>
        </router-link>
      </q-td>
    </template>
    <template v-slot:body-cell-link-status="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{'Linked with: ' + props.row.linkSource}}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'linkStatus'" />
      </q-td>
    </template>
    <template v-slot:body-cell-status-calculation="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{'Calculated on: ' + FormatUtils.formatDate(props.row.calculatedOn)}}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'calculationStatus'" />
      </q-td>
    </template>
    <template v-slot:body-cell-status-validated="props">
      <q-td :props="props">
        <StatusFlag :object="props.row" :statusField="'validationStatus'" />
      </q-td>
    </template>
    <template v-slot:body-cell-status-approved="props">
      <q-td :props="props">
        <StatusFlag :object="props.row" :statusField="'approvalStatus'" />
      </q-td>
    </template>
    <template v-slot:body-cell-dimensions="props">
      <q-td :props="props">
        {{ props.row.rows }} x {{ props.row.columns }}
      </q-td>
    </template>
    <template v-slot:body-cell-tags="props">
      <q-td :props="props">
        <q-badge v-for="tag in props.row.tags" :key="tag" color="green">{{tag}}</q-badge>
      </q-td>
    </template>
    <template v-slot:body-cell-createdBy="props">
      <q-td :props="props">
        <UserChip :id="props.row.createdBy" />
      </q-td>
    </template>
    <template v-slot:body-cell-menu="props">
      <q-td :props="props">
        <div class="row items-center cursor-pointer">
          <q-btn flat round icon="more_horiz" size="sm" >
            <PlateActionMenu :plate="props.row" @showPlateInspector="openPlateInspector(props.row)" />
          </q-btn>
        </div>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No plates to show.</span>
      </div>
    </template>
  </q-table>
  <table-config v-model:show="configdialog" v-model:visibleColumns="visibleColumns" v-model:columns="columns"></table-config>

  <PlateActionMenu v-show="showPlateContextMenu" :plate="selectedPlate" touch-position context-menu />

</template>

<style scoped>
.tag-icon {
  margin-right: 5px;
}

.nav-link {
  color: black;
  text-decoration: none;
}
</style>

<script setup>
import {computed, ref} from "vue";
import {useStore} from 'vuex'
import {useRoute} from "vue-router";

import UserChip from "@/components/widgets/UserChip";
import TableConfig from "@/components/table/TableConfig";
import PlateActionMenu from "@/components/plate/PlateActionMenu";
import StatusFlag from "@/components/widgets/StatusFlag";
import FilterUtils from "@/lib/FilterUtils";
import FormatUtils from "@/lib/FormatUtils";

const props = defineProps(['plates', 'experiment', 'newPlateTab'])
const emit = defineEmits(['update:newPlateTab', 'showPlateInspector'])

const store = useStore()
const route = useRoute()

const loading = ref()
const plates = computed( () => props.plates ? props.plates : [])

// const experimentId = parseInt(route.params.id);
// const plates = computed(() => store.getters['plates/getByExperimentId'](experimentId))
// store.dispatch('plates/loadByExperimentId', experimentId).then(() => {
//   loading.value = false
// })

let columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'link-status', align: 'center', label: 'L', field: 'link-status'},
  {name: 'status-calculation', align: 'center', label: 'C', field: 'status-calculation'},
  {name: 'status-validated', align: 'center', label: 'V', field: 'status-validated'},
  {name: 'status-approved', align: 'center', label: 'A', field: 'status-approved'},
  {name: 'dimensions', align: 'left', label: 'Dimensions', field: 'dimensions', sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
])

const selectedPlate = ref({});
const showPlateContextMenu = ref(false);
const selectPlate = (event, row) => {
  selectedPlate.value = row;
  showPlateContextMenu.value = true;
}

let visibleColumns = columns.value.map(a => a.name)
const filter = ref('')
const filterMethod = FilterUtils.defaultTableFilter()
const configdialog = ref(false)

const openNewPlateTab = () => {
  emit('update:newPlateTab', true)
}

const openPlateInspector = (plate) => {
  emit('showPlateInspector', plate)
}
</script>
