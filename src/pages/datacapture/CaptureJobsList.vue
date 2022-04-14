<template>
  <q-table
      table-header-class="text-grey"
      dense flat
      :rows="jobs"
      :columns="columns"
      row-key="id"
      class="full-width"
      :pagination="{ rowsPerPage: 20, sortBy: 'createDate', descending: true }"
      :filter="filter"
      :filter-method="filterMethod"
      :visible-columns="visibleColumns"
  >
    <template v-slot:top-right>
      <div class="row q-gutter-sm">
        <q-input outlined dense label="From" stack-label v-model="fromDate">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="fromDate" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="fromDate" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input outlined dense label="Until" stack-label v-model="toDate">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="toDate" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="toDate" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div>
          <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </div>
        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
      </div>
    </template>

    <template v-slot:body-cell-statusCode="props">
      <q-td :props="props">
        <q-badge :color="ColorUtils.getCaptureJobStatusColor(props.row.statusCode)">{{ props.row.statusCode }}</q-badge>
      </q-td>
    </template>
    <template v-slot:body-cell-details="props">
      <q-td :props="props">
        <q-btn label="Details" icon-right="chevron_right" size="sm" @click="doShowJobDetails(props.row)"/>
      </q-td>
    </template>
    <template v-slot:body-cell-cancel="props">
      <q-td :props="props">
        <q-btn label="Cancel" icon-right="cancel" size="sm" @click="cancelJob(props.row.id)" v-if="props.row.statusCode==='Running'"/>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No jobs to show.</span>
      </div>
    </template>
  </q-table>
  <q-dialog v-model="showJobDetails">
    <CaptureJobDetailsPanel :job="jobDetails"></CaptureJobDetailsPanel>
  </q-dialog>

  <table-config v-model:show="configdialog" v-model:columns="columns" v-model:visibleColumns="visibleColumns"></table-config>

</template>

<script>
import {ref, computed} from 'vue'
import {useStore} from 'vuex'

import CaptureJobDetailsPanel from "./CaptureJobDetailsPanel";
import TableConfig from "../../components/table/TableConfig";

import FormatUtils from "@/lib/FormatUtils.js"
import ColorUtils from "../../lib/ColorUtils";
import FilterUtils from "../../lib/FilterUtils";

export default {
  components: {
    CaptureJobDetailsPanel,
    TableConfig
  },
  setup() {
    const exported = {};
    const store = useStore()

    exported.toDate = ref(new Date())
    exported.fromDate = ref(new Date())
    exported.fromDate.value.setDate(exported.toDate.value.getDate() - 14)

    exported.jobs = computed(() => store.getters['datacapture/getJobs']())
    store.dispatch('datacapture/loadJobs', {fromDate: Date.parse(exported.fromDate.value), toDate: Date.parse(exported.toDate.value)})

    exported.columns = ref([
      {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
      {
        name: 'createDate',
        align: 'left',
        label: 'Created On',
        field: 'createDate',
        sortable: true,
        format: FormatUtils.formatDate
      },
      {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
      {name: 'sourcePath', align: 'left', label: 'Source Path', field: 'sourcePath', sortable: true},
      {name: 'statusCode', label: 'Status', field: 'statusCode', sortable: true},
      {name: 'statusMessage', align: 'left', label: 'Message', field: 'statusMessage', sortable: true},
      {name: 'details'},
      {name: 'cancel'}
    ])
    exported.visibleColumns = exported.columns.value.map(a => a.name)
    exported.configdialog = ref(false)

    exported.refreshJobs = () => {
      store.dispatch('datacapture/loadJobs', {fromDate: Date.parse(exported.fromDate.value), toDate: Date.parse(exported.toDate.value)})
    }

    exported.cancelJob = (id) => {
      store.dispatch('datacapture/cancelJob', id)
    }

    exported.showJobDetails = ref(false)
    exported.jobDetails = ref(null)
    exported.doShowJobDetails = (job) => {
      exported.jobDetails.value = job
      exported.showJobDetails.value = true
    }

    exported.filter = ref('')
    exported.filterMethod = FilterUtils.defaultTableFilter()
    exported.timer = null
    exported.ColorUtils = ColorUtils

    return exported
  },
  mounted: function () {
    this.timer = setInterval(() => {
      this.refreshJobs()
    }, 60000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>