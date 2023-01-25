<template>
  <q-page class="oa-root-div q-pa-md">
    <oa-section-header title="Data Capture Jobs" icon="list_alt"/>

    <div class="row q-pa-lg oa-section-body">
      <q-table
          table-header-class="text-grey"
          class="full-width"
          square dense flat
          :rows="jobs"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 20, sortBy: 'createDate', descending: true }"
          :filter="filter"
          :filter-method="filterMethod"
          :visible-columns="visibleColumns"
      >
        <template v-slot:top-left>
          <div class="justify-end">
            <q-btn color="primary" icon="refresh" size="sm" @click="refreshJobs" class="on-left"/>
            <q-btn color="primary" icon="add" size="sm" label="Submit New Job..." @click="showSubmitJobDialog = true"/>
          </div>
        </template>
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
            <StatusLabel :status="props.row.statusCode"/>
          </q-td>
        </template>
        <template v-slot:body-cell-createdBy="props">
          <q-td :props="props">
            <UserChip :id="props.row.createdBy"/>
          </q-td>
        </template>
        <template v-slot:body-cell-details="props">
          <q-td :props="props">
            <q-btn label="Details" icon-right="chevron_right" size="sm" @click="doShowJobDetails(props.row)"/>
          </q-td>
        </template>
        <template v-slot:body-cell-cancel="props">
          <q-td :props="props">
            <q-btn label="Cancel" icon-right="cancel" size="sm" @click="cancelJob(props.row.id)"
                   v-if="props.row.statusCode==='Running'"/>
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row text-info">
            <span>No jobs to show.</span>
          </div>
        </template>
      </q-table>
      <table-config v-model:show="configdialog" v-model:columns="columns"
                    v-model:visibleColumns="visibleColumns"></table-config>

      <q-dialog v-model="showJobDetails">
        <CaptureJobDetailsPanel :job="jobDetails"></CaptureJobDetailsPanel>
      </q-dialog>

      <q-dialog v-model="showSubmitJobDialog">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              <q-icon name="scanner" class="on-left"/>
              Submit New Data Capture Job
            </div>
          </q-card-section>
          <q-card-section class="q-pa-sm q-gutter-sm">
            <q-input v-model="newJob.sourcePath" label="Source Path"/>
            <q-input v-model="newJob.captureConfig" type="textarea" autogrow label="Capture Configuration"/>
          </q-card-section>
          <q-card-section class="row q-pa-sm q-gutter-sm justify-end">
            <q-btn color="primary" label="Cancel" flat v-close-popup/>
            <q-btn color="primary" label="Submit" @click="submitJobAction" :disable="!canSubmitJob" v-close-popup/>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import {useStore} from 'vuex'

import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import CaptureJobDetailsPanel from "./CaptureJobDetailsPanel";
import TableConfig from "@/components/table/TableConfig";
import UserChip from "@/components/widgets/UserChip";
import StatusLabel from "@/components/widgets/StatusLabel";

import FormatUtils from "@/lib/FormatUtils.js"
import FilterUtils from "@/lib/FilterUtils";

const store = useStore();

const toDate = ref(new Date());
const fromDate = ref(new Date());
fromDate.value.setDate(toDate.value.getDate() - 14);

const jobs = computed(() => store.getters['datacapture/getJobs']());
store.dispatch('datacapture/loadJobs', {fromDate: Date.parse(fromDate.value), toDate: Date.parse(toDate.value)});

const columns = ref([
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
  {name: 'id', align: 'left', label: 'Job ID', field: 'id', sortable: true},
  {name: 'details'},
  {name: 'cancel'}
]);
const visibleColumns = columns.value.map(a => a.name);
const configdialog = ref(false);
const filter = ref('');
const filterMethod = FilterUtils.defaultTableFilter();

const refreshJobs = () => {
  toDate.value = new Date();
  store.dispatch('datacapture/loadJobs', {fromDate: Date.parse(fromDate.value), toDate: Date.parse(toDate.value)});
};
const cancelJob = (id) => {
  store.dispatch('datacapture/cancelJob', id);
};

// Auto-refresh
let timer = null;
onMounted(() => {
  timer = setInterval(() => {
    refreshJobs();
  }, 60000);
});
onBeforeUnmount(() => {
  clearInterval(timer);
});

// Job details dialog
const showJobDetails = ref(false);
const jobDetails = ref(null);
const doShowJobDetails = (job) => {
  jobDetails.value = job;
  showJobDetails.value = true;
};

// Submit new job
const showSubmitJobDialog = ref(false);
const newJob = ref({
  sourcePath: '',
  captureConfig: JSON.stringify({})
});
const submitJobAction = async () => {
  if (newJob.value.sourcePath == '') alert('No source path specified!')
  await store.dispatch('datacapture/submitJob', newJob.value);
  refreshJobs();
};
const canSubmitJob = computed(() => (newJob.value.sourcePath != ''));
</script>
