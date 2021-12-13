<template>
  <q-table
      table-header-class="text-grey"
      :rows="plates"
      :columns="getColumns()"
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
        <q-btn size="sm" color="primary" icon="add" label="New Plate" @click="openNewPlateTab"/>
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
    <template v-slot:body-cell-status-validated="props">
      <q-td :props="props">
        <q-icon v-if="props.row.validationStatus==='VALIDATION_NOT_SET'" name="horizontal_rule"></q-icon>
        <q-icon v-else-if="props.row.validationStatus==='VALIDATED'" name="check_circle" color="positive"/>
        <q-icon v-else-if="props.row.validationStatus==='INVALIDATED'" name="cancel" color="negative"/>
      </q-td>
    </template>
    <template v-slot:body-cell-status-approved="props">
      <q-td :props="props">
        <q-icon v-if="props.row.approvalStatus==='APPROVAL_NOT_SET'" name="horizontal_rule"></q-icon>
        <q-icon v-else-if="props.row.approvalStatus==='APPROVED'" name="check_circle" color="positive"/>
        <q-icon v-else-if="props.row.approvalStatus==='DISAPPROVED'" name="cancel" color="negative"/>
      </q-td>
    </template>
    <template v-slot:body-cell-layout="props">
      <q-td :props="props">
        {{ props.row.rows }} x {{ props.row.columns }}
      </q-td>
    </template>
    <template v-slot:body-cell-tags="props">
      <q-td :props="props">
        <div class="tag-icon flex inline" v-for="tag in props.row.tags" :key="tag.value">
          <q-badge color="green">
            {{ tag }}
          </q-badge>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-menu="props">
      <q-td :props="props">
        <div class="row items-center cursor-pointer">
          <q-btn flat round icon="more_horiz" style="border-radius: 50%;">
            <q-menu fit>
              <q-list style="min-width: 100px">
                <q-item clickable
                        v-if="props.row.approvalStatus==='APPROVAL_NOT_SET'">
                  <q-item-section>Validation</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right"/>
                  </q-item-section>

                  <q-menu anchor="top end" self="top start">
                    <q-list>
                      <q-item clickable v-if="props.row.validationStatus==='VALIDATION_NOT_SET'" @click="validate(props.row.id, props.row.experimentId)">
                        <q-item-section>Validate</q-item-section>
                      </q-item>
                      <q-item clickable v-if="props.row.validationStatus==='VALIDATION_NOT_SET'" @click="invalidate(props.row.id, props.row.experimentId)">
                        <q-item-section>Invalidate</q-item-section>
                      </q-item>
                      <q-item clickable v-if="props.row.validationStatus!=='VALIDATION_NOT_SET'" @click="resetValidation(props.row.id, props.row.experimentId)">
                        <q-item-section>Reset Validation</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
                <q-item clickable v-if="props.row.validationStatus!=='INVALIDATED' || props.row.approvalStatus!=='APPROVAL_NOT_SET'" >
                  <q-item-section>Approval</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right"/>
                  </q-item-section>

                  <q-menu anchor="top end" self="top start">
                    <q-list>
                      <q-item clickable v-if="props.row.approvalStatus==='APPROVAL_NOT_SET'" @click="approve(props.row.id, props.row.experimentId)">
                        <q-item-section>Approve</q-item-section>
                      </q-item>
                      <q-item clickable v-if="props.row.approvalStatus==='APPROVAL_NOT_SET'" @click="disapprove(props.row.id, props.row.experimentId)">
                        <q-item-section>Disapprove</q-item-section>
                      </q-item>
                      <q-item clickable v-if="props.row.approvalStatus!=='APPROVAL_NOT_SET'" @click="resetApproval(props.row.id, props.row.experimentId)">
                        <q-item-section>Reset Approval</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>

                </q-item>
              </q-list>
            </q-menu>
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
  <table-config v-model:show="configdialog" v-model:visibleColumns="visibleColumns" v-model:columnsList="columnsList" v-model:columnOrder="columnOrder"></table-config>
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
import TableConfig from "../../components/table/TableConfig";
import {useRoute} from "vue-router";

const columns = {
  barcode:{name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
  id:{name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  description:{name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  'status-validated':{name: 'status-validated', align: 'left', label: 'Validated', field: 'status-validated', sortable: true},
  'status-approved':{name: 'status-approved', align: 'left', label: 'Approved', field: 'status-approved', sortable: true},
  layout:{name: 'layout', align: 'left', label: 'Layout', field: 'layout', sortable: true},
  createdOn:{
    name: 'createdOn',
    align: 'left',
    label: 'Created On',
    field: 'createdOn',
    sortable: true,
    format: val => val !== undefined ? `${val.toLocaleString()}` : ''
  },
  tags:{name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
  menu:{name: 'menu', align: 'left', field: 'menu', sortable: false}
}

const filterMethod = function (rows, term) {
  return rows.filter(row => {
    return (row.id == term
        || row.barcode.toLowerCase().includes(term)
        || row.description.toLowerCase().includes(term)
        || (row.tags && row.tags.some(tag => tag.toLowerCase().includes(term))))
  })
}

export default {
  components: {TableConfig},

  props: {
    experiment: Object
  },
  methods: {
    openNewPlateTab() {
      this.$emit("message")
    },
    validate(id, experimentId) {
      //put validationStatus: VALIDATED
      console.log('VALIDATED')
      this.$store.dispatch('plates/editPlate', {id: id, experimentId: experimentId, validationStatus: 'VALIDATED'})
    },
    invalidate(id, experimentId) {
      //put validationStatus: INVALIDATED
      this.$store.dispatch('plates/editPlate', {id: id, experimentId: experimentId, validationStatus: 'INVALIDATED'})
    },
    resetValidation(id, experimentId) {
      this.$store.dispatch('plates/editPlate', {id: id, experimentId: experimentId, validationStatus: 'VALIDATION_NOT_SET'})
    },
    approve(id, experimentId) {
      //put approvalStatus: APPROVED
      this.$store.dispatch('plates/editPlate', {id: id, experimentId: experimentId, approvalStatus: 'APPROVED'})
    },
    disapprove(id, experimentId) {
      //put approvalStatus: DISAPPROVED
      this.$store.dispatch('plates/editPlate', {id: id, experimentId: experimentId, approvalStatus: 'DISAPPROVED'})
    },
    resetApproval(id, experimentId) {
      this.$store.dispatch('plates/editPlate', {id: id, experimentId: experimentId, approvalStatus: 'APPROVAL_NOT_SET'})
    },
    getColumns(){
      let newOrder = []
      let tempList = this.columnOrder.slice()
      while (tempList.length>0){
        const shift = tempList.shift()
        newOrder.push(this.columns[shift])
      }
      return newOrder
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

    let columnOrder = ['barcode','id','description','status-validated','status-approved','layout','createdOn','tags','menu']
    let columnsList = []
    columnOrder.forEach(function (col) {
      columnsList.push({column: col})
    })
    columnsList.forEach(function (col) {
      //Dummy data
      col.dataType = (Math.random() + 1).toString(36).substring(7)
      col.description = (Math.random() + 1).toString(36).substring(2)
    })

    return {
      columns,
      filter: ref(''),
      filterMethod,
      loading,
      plates,
      visibleColumns: ['barcode','id','description','status-validated','status-approved','layout','createdOn','tags','menu'],
      columnsList,
      configdialog: ref(false),
      columnOrder
    }
  }
}

</script>