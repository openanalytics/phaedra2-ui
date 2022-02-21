<template>
  <q-table
      table-header-class="text-grey"
      :rows="plates"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
      :filter="filter"
      :filter-method="filterMethod"
      :loading="loading"
      :visible-columns="visibleColumns"
      flat square
  >
    <template v-slot:top-right>
      <div class="col action-button on-left">
        <q-btn size="sm" color="primary" icon="add" label="New Plate" @click="openNewPlateTab()"/>
      </div>
      <div class="row">
        <q-input outlined rounded dense debounce="300" v-model="filter" placeholder="Search">
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
    <template v-slot:body-cell-status-calculation="props">
      <q-td :props="props">
        <q-icon v-if="props.row.calculationStatus==='CALCULATION_NEEDED'" name="horizontal_rule"></q-icon>
        <q-icon v-else-if="props.row.approvalStatus==='CALCULATION_OK'" name="check_circle" color="positive"/>
        <q-icon v-else-if="props.row.approvalStatus==='CALCULATION_NOT_POSSIBLE'" name="cancel" color="negative"/>
        <q-icon v-else-if="props.row.approvalStatus==='CALCULATION_ERROR'" name="cancel" color="negative"/>
      </q-td>
    </template>
    <template v-slot:body-cell-status-validated="props">
      <q-td :props="props">
        <q-icon v-if="props.row.validationStatus==='VALIDATION_NOT_SET'" name="horizontal_rule"></q-icon>
        <q-icon v-else-if="props.row.validationStatus==='VALIDATED'" name="check_circle" color="positive"/>
        <q-icon v-else-if="props.row.validationStatus==='INVALIDATED'" name="cancel" color="negative">
          <q-tooltip>
            {{props.row.invalidatedReason}}
          </q-tooltip>
        </q-icon>
      </q-td>
    </template>
    <template v-slot:body-cell-status-approved="props">
      <q-td :props="props">
        <q-icon v-if="props.row.approvalStatus==='APPROVAL_NOT_SET'" name="horizontal_rule"></q-icon>
        <q-icon v-else-if="props.row.approvalStatus==='APPROVED'" name="check_circle" color="positive"/>
        <q-icon v-else-if="props.row.approvalStatus==='DISAPPROVED'" name="cancel" color="negative">
          <q-tooltip>
            {{props.row.disapprovedReason}}
          </q-tooltip>
        </q-icon>
      </q-td>
    </template>
    <template v-slot:body-cell-layout="props">
      <q-td :props="props">
        {{ props.row.rows }} x {{ props.row.columns }}
      </q-td>
    </template>
    <template v-slot:body-cell-tags="props">
      <q-td :props="props">
        <TagList :objectInfo="props.row" :objectClass="'PLATE'" :readOnly="true" />
      </q-td>
    </template>
    <template v-slot:body-cell-menu="props">
      <q-td :props="props">
        <div class="row items-center cursor-pointer">
          <q-btn flat round icon="more_horiz" style="border-radius: 50%;">
            <PlateMenu :plateId="props.row.id" :experimentId="props.row.experimentId"
                       :validationStatus="props.row.validationStatus" :approvalStatus="props.row.approvalStatus"/>
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
  <plate-calculate-dialog v-model:show="calculateDialog" v-model:plateId="selectedPlateId"></plate-calculate-dialog>
  <invalidate-dialog v-model:show="invalidateDialog" v-model:plateId="selectedPlateId" v-model:experimentId="experimentId"></invalidate-dialog>
  <disapprove-dialog v-model:show="disapproveDialog" v-model:plateId="selectedPlateId" v-model:experimentId="experimentId"></disapprove-dialog>
  <approve-dialog v-model:show="approveDialog" v-model:plateId="selectedPlateId" v-model:experimentId="experimentId"></approve-dialog>
  <LinkPlate v-model:show="linkDialog" v-model:plateId="selectedPlateId"></LinkPlate>
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

<script>
import {useStore} from 'vuex'
import {computed, ref} from "vue";
import TagList from "@/components/tag/TagList";
import TableConfig from "@/components/table/TableConfig";
import LinkPlate from "./LinkPlate";
import {useRoute} from "vue-router";
import FilterUtils from "../../lib/FilterUtils";
import PlateMenu from "@/components/plate/PlateMenu";

let columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'status-calculation', align: 'center', label: 'C', field: 'status-calculation'},
  {name: 'status-validated', align: 'center', label: 'V', field: 'status-validated'},
  {name: 'status-approved', align: 'center', label: 'A', field: 'status-approved'},
  {name: 'layout', align: 'left', label: 'Layout', field: 'layout', sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: val => val !== undefined ? `${val.toLocaleString()}` : ''},
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
])

export default {
  components: {TableConfig, TagList, LinkPlate, PlateMenu},

  props: ['experiment','newPlateTab'],
  emits: ['update:newPlateTab'],
  methods: {
    openNewPlateTab() {
      console.log('clicked')
      this.$emit('update:newPlateTab',true)
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const loading = ref(true)

    const experimentId = parseInt(route.params.id);
    const plates = computed(() => store.getters['plates/getByExperimentId'](experimentId))
    store.dispatch('plates/loadByExperimentId', experimentId).then(() => {
      loading.value = false
    })

    return {
      columns,
      visibleColumns: columns.value.map(a => a.name),
      filter: ref(''),
      filterMethod: FilterUtils.defaultTableFilter(),
      loading,
      plates,
      configdialog: ref(false),
      selectedPlateId: null,
      experimentId: null,
      calculateDialog: ref(false),
      linkDialog: ref(false)
    }
  }
}

</script>
