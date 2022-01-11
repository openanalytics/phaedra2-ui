<template>
  <q-table
      table-header-class="text-grey"
      flat
      :rows="jobs"
      :columns="columns"
      row-key="id"
      class="full-width"
      :pagination="{ rowsPerPage: 20, sortBy: 'createDate', descending: true }"
      :filter="filter"
      :filter-method="filterMethod"
  >
    <template v-slot:top-left>
      <div class="row">
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-input outlined dense v-model="fromDate">
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
        <q-input outlined dense v-model="toDate">
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
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No jobs to show.</span>
      </div>
    </template>
  </q-table>
  <q-dialog v-model="showJobDetails">
    <CaptureJobDetailsPanel :job="jobDetails"></CaptureJobDetailsPanel>
  </q-dialog>
</template>

<script>
import {ref, computed} from 'vue'
import {useStore} from 'vuex'

import CaptureJobDetailsPanel from "./CaptureJobDetailsPanel";

import FormatUtils from "@/lib/FormatUtils.js"
import ColorUtils from "@/lib/ColorUtils.js"

export default {
  components: {
    CaptureJobDetailsPanel
  },
  setup() {
    const store = useStore()

    const jobs = computed(() => store.getters['datacapture/getAllJobs']())
    store.dispatch('datacapture/loadAllJobs')

    const columns = [
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
    ]

    const refreshJobs = () => {
      store.dispatch('datacapture/loadAllJobs')
    }

    const showJobDetails = ref(false)
    const jobDetails = ref(null)
    const doShowJobDetails = (job) => {
      jobDetails.value = job
      showJobDetails.value = true
    }

    const filter = ref('')
    const filterMethod = function (rows, term) {
      return rows.filter(row => {
        return (row.id == term
            || (row.createdBy && row.createdBy.toLowerCase().includes(term))
            || (row.statusMessage && row.statusMessage.toLowerCase().includes(term))
            || (row.sourcePath && row.sourcePath.toLowerCase().includes(term))
        )
      })
    }
    const toDate = ref(new Date())
    const fromDate = ref(new Date())
    fromDate.value.setDate(toDate.value.getDate() - 14)
    return {
      jobs,
      columns,
      refreshJobs,
      showJobDetails,
      jobDetails,
      doShowJobDetails,
      filter,
      filterMethod,
      ColorUtils,
      timer: null,
      toDate,
      fromDate
    }
  },
  mounted: function () {
    this.timer = setInterval(() => {
      this.refreshJobs()
    }, 5000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>