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
    <template v-slot:top-right>
      <div class="row action-button on-left">
        <q-btn size="sm" color="primary" icon="add" label="New Experiment" @click="showNewExperimentDialog = true"/>
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
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <router-link :to="'/experiment/' + props.row.id" class="nav-link">
          <div class="row items-center cursor-pointer">
            <q-icon name="science" class="icon q-pr-sm"/>
            {{ props.row.name }}
            <ExperimentContextMenu></ExperimentContextMenu>
          </div>
        </router-link>
      </q-td>
    </template>
    <template v-slot:body-cell-tags="props">
      <q-td :props="props">
        <div class="tag-icon flex inline" v-for="tag in props.row.tags" :key="tag.tag">
          <q-badge color="green">
            {{ tag.tag }}
          </q-badge>
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

  <table-config v-model:show="configdialog" v-model:columns="columns" v-model:visibleColumns="visibleColumns"></table-config>
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

  import ExperimentContextMenu from "@/components/widgets/ExperimentContextMenu.vue"
  import TableConfig from "../../components/table/TableConfig";

  import FormatUtils from "@/lib/FormatUtils.js"

  const columns = ref([
    {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
    {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
    {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
    {
      name: 'createdOn',
      align: 'left',
      label: 'Created On',
      field: 'createdOn',
      sortable: true,
      format: FormatUtils.formatDate
    },
    {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true}
  ])

  const filterMethod = function (rows, term) {
    return rows.filter(row => {
      return (row.id === term
          || row.name.toLowerCase().includes(term)
          || row.description.toLowerCase().includes(term)
          || (row.tags && row.tags.some(tag => tag.toLowerCase().includes(term))))
    })
  }

  export default {
    props: {
      projectId: Number
    },
    components: {
      ExperimentContextMenu,
      TableConfig
    },
    setup(props) {
      const store = useStore()
      const loading = ref(true)

      const experiments = computed(() => store.getters['experiments/getByProjectId'](props.projectId))
      store.dispatch('experiments/loadByProjectId', props.projectId).then(() => {
        loading.value = false
      })

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
        filterMethod,
        loading,
        experiments,
        FormatUtils,
        columns,
        visibleColumns: columns.value.map(a => a.name),
        configdialog: ref(false),
        showNewExperimentDialog,
        newExperimentName,
        doCreateNewExperiment
      }
    }
  }
</script>
