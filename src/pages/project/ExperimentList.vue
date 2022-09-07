<template>
  <div class="row text-h6 items-center q-px-md oa-section-title">
    <q-icon name="science" class="on-left"/>Experiments
  </div>
  <q-table
      :columns="columns"
      :rows="experiments"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
      :filter="filter"
      :filter-method="filterMethod"
      :visible-columns="visibleColumns"
      square
  >
    <template v-slot:top-left>
      <div class="row action-button on-left">
        <q-btn size="sm" icon="add" class="oa-button" label="New Experiment" @click="showNewExperimentDialog = true"/>
      </div>
    </template>
    <template v-slot:top-right>
      <div class="row">
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn flat round color="primary" icon="settings" class="on-right" @click="showConfigDialog=true">
          <q-tooltip>Configure Table Columns</q-tooltip>
        </q-btn>
      </div>
    </template>
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <router-link :to="'/experiment/' + props.row.id" class="nav-link">
          <div class="row items-center cursor-pointer">
            <q-icon name="science" class="icon q-pr-sm"/>
            {{ props.row.name }}
          </div>
        </router-link>
      </q-td>
    </template>
    <template v-slot:body-cell-tags="props">
      <q-td :props="props">
        <TagList :objectInfo="props.row" :objectClass="'EXPERIMENT'" :readOnly="true" />
      </q-td>
    </template>
    <template v-slot:body-cell-createdBy="props">
      <q-td :props="props">
        <UserChip :id="props.row.createdBy" />
      </q-td>
    </template>
    <template v-slot:body-cell-nrPlatesCalculated="props">
      <q-td :props="props">
        <ProgressBarField :object="props.row.summary" :valueFieldName="props.col.name" :maxValueFieldName="'nrPlates'" />
      </q-td>
    </template>
    <template v-slot:body-cell-nrPlatesValidated="props">
      <q-td :props="props">
        <ProgressBarField :object="props.row.summary" :valueFieldName="props.col.name" :maxValueFieldName="'nrPlates'" />
      </q-td>
    </template>
    <template v-slot:body-cell-nrPlatesApproved="props">
      <q-td :props="props">
        <ProgressBarField :object="props.row.summary" :valueFieldName="props.col.name" :maxValueFieldName="'nrPlates'" />
      </q-td>
    </template>
    <template v-slot:body-cell-menu="props">
      <q-td :props="props">
        <div class="row items-center cursor-pointer">
          <q-btn flat round icon="more_horiz" size="sm" >
            <ExperimentMenu :experimentId="props.row.id" />
          </q-btn>
        </div>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No experiments to show.</span>
      </div>
    </template>
  </q-table>

  <q-dialog v-model="showNewExperimentDialog">
    <q-card style="min-width: 30vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        Create New Experiment
      </q-card-section>
      <q-card-section>
        <div class="row">
            <div class="col-2 row items-center">
              <q-avatar icon="edit" color="primary" text-color="white" />
            </div>
            <div class="col-10">
              <span>New Experiment Name:</span><br/>
              <q-input dense v-model="newExperimentName" autofocus />
            </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn label="Create" color="primary" v-close-popup @click="doCreateNewExperiment"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <table-config v-model:show="showConfigDialog" v-model:columns="columns" v-model:visibleColumns="visibleColumns"></table-config>
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
  import {ref, computed} from 'vue'
  import {useStore} from 'vuex'

  import TableConfig from "@/components/table/TableConfig";
  import ProgressBarField from "@/components/widgets/ProgressBarField";
  import TagList from "@/components/tag/TagList";
  import UserChip from "@/components/widgets/UserChip";
  import ExperimentMenu from "@/components/experiment/ExperimentMenu";

  import FormatUtils from "@/lib/FormatUtils.js"
  import FilterUtils from "@/lib/FilterUtils.js"

  export default {
    props: {
      projectId: Number
    },
    components: {
      TableConfig,
      TagList,
      UserChip,
      ProgressBarField,
      ExperimentMenu
    },
    setup(props) {
      const store = useStore()
      const loading = ref(true)

      const experiments = computed(() => store.getters['experiments/getByProjectId'](props.projectId))
      store.dispatch('experiments/loadByProjectId', props.projectId).then(() => {
        loading.value = false
      })

      const columns = ref([
          {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
          {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
          {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
          {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
          {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
          {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true },

          {name: 'nrPlates', align: 'left', label: 'Plates', field: row => (row.summary ? row.summary.nrPlates : 0), sortable: true},
          {name: 'nrPlatesCalculated', align: 'left', label: 'Calculated', sortable: true},
          {name: 'nrPlatesValidated', align: 'left', label: 'Validated', sortable: true},
          {name: 'nrPlatesApproved', align: 'left', label: 'Approved', sortable: true},

          {name: 'menu', align: 'left', field: 'menu', sortable: false}
      ])
        
      const showNewExperimentDialog = ref(false)
      const newExperimentName = ref('')
      const doCreateNewExperiment = function() {
        store.dispatch('experiments/createNewExperiment', {
          projectId: props.projectId,
          name: newExperimentName.value,
          status: 'OPEN',
          createdOn: new Date()
        })
      }

      return {
        filter: ref(''),
        filterMethod: FilterUtils.defaultTableFilter(),
        loading,
        experiments,
        FormatUtils,
        columns,
        visibleColumns: columns.value.map(a => a.name),
        showConfigDialog: ref(false),
        showNewExperimentDialog,
        newExperimentName,
        doCreateNewExperiment
      }
    }
  }
</script>
