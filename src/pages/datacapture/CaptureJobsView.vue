<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Data Capture Jobs" icon="cloud_upload"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div q-pa-md">
    <oa-section title="Data Capture Jobs" icon="cloud_upload" :collapsible="true">
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
            <q-input dense label="From" stack-label v-model="fromDate">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="fromDateProxy">
                    <q-date v-model="fromDate" mask="DD-MM-YYYY" @update:model-value="refreshJobs"/>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input dense label="Until" stack-label v-model="toDate">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="toDateProxy">
                    <q-date v-model="toDate" mask="DD-MM-YYYY" @update:model-value="refreshJobs"/>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <div>
              <q-input dense v-model="filter" placeholder="Search">
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
<!--            <q-select v-model="newJob.inputType" label="Measurement source type"-->
<!--                      :options="inputTypes" dense stack-label/>-->
            <div v-if="newJob.inputType === 'FolderScanner'">
              <q-file label="Select source location" :display-value="newJob.sourcePath" @update:model-value="handleSelection"
                      multiple dense stack-label webkitdirectory>
                <template v-slot:append>
                  <q-icon name="folder"/>
                </template>
              </q-file>
              <q-select v-model="newJob.captureConfigName" label="Select capture configuration"
                        :options="captureConfigList" @update:model-value="fetchConfig()" dense stack-label/>
            </div>
            <div class="row">
              <div class="col">
                <q-card square v-if="showConfig" class="bg-grey-3">
                  <pre class="q-ma-none q-pa-sm">{{ FormatUtils.formatJSON(config) }}</pre>
                </q-card>
                <q-btn v-if="!showConfig" label="Show" @click="showConfig=true" size="sm" color="primary" icon="remove_red_eye"/>
                <q-btn v-if="showConfig" label="Hide " @click="showConfig=false" class="q-mt-sm" size="sm" color="primary" icon="remove_red_eye"/>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="row q-pa-sm q-gutter-sm justify-end">
            <q-btn color="primary" label="Cancel" flat v-close-popup/>
            <q-btn color="primary" label="Submit" @click="submitJobAction" :disable="!canSubmitJob" v-close-popup/>
          </q-card-section>
        </q-card>
      </q-dialog>
    </oa-section>
  </q-page>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount, reactive} from 'vue'
import {useStore} from 'vuex'

import OaSection from "@/components/widgets/OaSection";
import CaptureJobDetailsPanel from "./CaptureJobDetailsPanel";
import TableConfig from "@/components/table/TableConfig";
import UserChip from "@/components/widgets/UserChip";
import StatusLabel from "@/components/widgets/StatusLabel";

import FormatUtils from "@/lib/FormatUtils.js"
import FilterUtils from "@/lib/FilterUtils";
import DateUtils from "@/lib/DateUtils";

const store = useStore();
const directoryItems = ref([]);
const fromDateProxy = ref(null)
const toDateProxy = ref(null)

const now = new Date()
const fromDate = ref(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toLocaleDateString())
const toDate = ref(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toLocaleDateString())

const jobs = computed(() => store.getters['datacapture/getJobs']());
store.dispatch('datacapture/loadJobs', {fromDate: DateUtils.parseLocaleDateString(fromDate.value), toDate: DateUtils.parseLocaleDateString(toDate.value)});

const captureConfigList = computed(() => store.getters['datacapture/getAllCaptureConfigs']());
store.dispatch('datacapture/loadCaptureConfigs');

const columns = ref([
  {name: 'createDate', align: 'left', label: 'Created On', field: 'createDate', sortable: true, format: FormatUtils.formatDate },
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

const inputTypes = ref(['FolderScanner', 'S3 Bucket', 'Colombus'])

const refreshJobs = () => {
  fromDateProxy.value.hide()
  toDateProxy.value.hide()
  store.dispatch('datacapture/loadJobs', {fromDate: DateUtils.parseLocaleDateString(fromDate.value), toDate: DateUtils.parseLocaleDateString(toDate.value)});
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
const newJob = reactive({
  inputType: 'FolderScanner',
  captureConfigName: null,
  captureConfig: null,
  sourcePath: '',
  files: null,
});

const handleSelection = (value) => {
  console.log(value)
  newJob.files = value
  newJob.sourcePath = value[0].webkitRelativePath.split('/')[0]
}

const submitJobAction = async () => {
  // if (newJob.sourcePath === '') alert('No source path specified!')
  if (!newJob.files) alert('No files specified')
  await store.dispatch('datacapture/submitJob', newJob);
  refreshJobs();
};
// const canSubmitJob = computed(() => (newJob.sourcePath !== '' || newJob.files !== null) && newJob.captureConfig !== null);
const canSubmitJob = computed(() => (newJob.sourcePath !== '' || newJob.files !== null));

const config = computed(() => store.getters['datacapture/getConfig']());
const showConfig = ref(false);
const fetchConfig = () => {
  newJob.captureConfig = computed(() => store.getters['datacapture/getConfig']())
  store.dispatch('datacapture/loadCaptureConfigByName', newJob.captureConfigName)
};
</script>
