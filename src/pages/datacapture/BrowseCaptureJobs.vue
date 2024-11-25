<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Data Capture Jobs" icon="cloud_upload"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div q-pa-sm">
    <oa-section title="Data Capture Jobs" icon="cloud_upload" :collapsible="true">
      <oa-table :rows="jobs" :columns="columns" :pagination="{ rowsPerPage: 20, sortBy: 'createDate', descending: true }">
        <template v-slot:top-left>
          <div class="justify-end">
            <q-btn color="primary" icon="refresh" size="sm" @click="refreshList" class="on-left"/>
            <q-btn color="primary" icon="add" size="sm" label="Submit New Job..." @click="showSubmitJobDialog = true"/>
          </div>
        </template>
        <template v-slot:top-right>
          <date-range-selector v-model:from="fromDate" v-model:to="toDate" @rangeChanged="refreshList"/>
        </template>
        <template v-slot:body-cell-details="props">
          <q-td :props="props">
            <q-btn label="Details" icon-right="chevron_right" size="sm" @click="doShowJobDetails(props.row)"/>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn v-if="canCancelJob(props.row)" label="Cancel" icon-right="cancel" size="sm" @click="cancelJob(props.row.id)" />
            <q-btn v-if="canResubmitJob(props.row)" label="Re-submit" icon-right="restart_alt" size="sm" @click="jobToResubmit = props.row; showResubmitConfirmation = true" />
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row text-info">
            <span>No jobs to show.</span>
          </div>
        </template>
      </oa-table>

      <q-dialog v-model="showJobDetails">
        <CaptureJobDetailsPanel :job="jobDetails"></CaptureJobDetailsPanel>
      </q-dialog>

      <q-dialog @hide="clearData" v-model="showSubmitJobDialog">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              <q-icon name="scanner" class="on-left"/>
              Submit New Data Capture Job
            </div>
          </q-card-section>
          <q-card-section class="q-pa-sm q-gutter-sm">
            <div class="col">
              <q-card square>
                <q-card-section class="q-pa-sm">
                  <div class="text-h6">Source</div>
                  <div class="row">
                    <q-radio v-model="sourceType" val="folder" label="Folder" dense size="sm" class="col-2" />

                    <q-file
                        :display-value="selectedSource.folderName" @update:model-value="handleFolderSelection"
                        :disable="sourceType != 'folder'"
                        multiple dense stack-label webkitdirectory class="col-10">
                      <template v-slot:append>
                        <q-icon name="folder"/>
                      </template>
                    </q-file>

                    <q-radio v-model="sourceType" val="url" label="URL" dense size="sm" class="col-2" />

                    <q-input v-model="selectedSource.url" :disable="sourceType != 'url'" dense class="col-10" />
                  </div>
                </q-card-section>
              </q-card>
              <q-card square class="q-mt-md">
                <q-card-section class="q-pa-sm">
                  <div class="text-h6">Capture Configuration</div>
                  <div class="row">
                    <div class="col-2" />
                    <q-select
                        v-model="captureJobConfig.captureConfigName"
                        :options="captureConfigList" option-value="id" option-label="name"
                        @update:model-value="value => selectedConfig = value"
                        dense stack-label class="col-10"/>
                    <div class="col-2" />
                    <div class="col-10">
                      <q-btn :label="showConfig ? 'Hide':'Show'" @click="showConfig=!showConfig" class="q-mt-sm" size="sm" color="primary" icon="remove_red_eye"/>
                      <q-card square v-if="showConfig" class="bg-grey-3 q-mt-sm">
                        <pre class="q-ma-none q-pa-sm">{{ FormatUtils.formatJSON(selectedConfig.value) }}</pre>
                      </q-card>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
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

  <confirm-dialog title="Re-submit Job" :message="'Are you sure you want to re-submit this capture job? ' + jobToResubmit?.sourcePath" v-model:show="showResubmitConfirmation" @onConfirm="resubmitJob"/>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount, reactive} from 'vue'
import {useStore} from 'vuex'
import {date} from 'quasar'
import FormatUtils from "@/lib/FormatUtils.js"
import OaSection from "@/components/widgets/OaSection";
import CaptureJobDetailsPanel from "./CaptureJobDetailsPanel";
import DateRangeSelector from "@/components/widgets/DateRangeSelector";
import OaTable from "@/components/table/OaTable.vue";
import ConfirmDialog from "@/components/widgets/ConfirmDialog"

const store = useStore();

const now = new Date();
const fromDate = ref(date.subtractFromDate(now, { days: 7 }));
const toDate = ref(date.addToDate(now, { days: 1 }));

const jobs = computed(() => store.getters['datacapture/getJobs']());

const refreshList = () => store.dispatch('datacapture/loadJobs', {
  fromDate: fromDate.value.getTime(),
  toDate: toDate.value.getTime()
});
refreshList();

const captureConfigList = computed(() => store.getters['datacapture/getAllCaptureConfigs']());
store.dispatch('datacapture/loadAllCaptureConfigs');
const selectedConfig = ref({});

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'createDate', align: 'left', label: 'Created On', field: 'createDate', sortable: true, format: FormatUtils.formatDate },
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
  {name: 'sourcePath', align: 'left', label: 'Source Path', field: 'sourcePath', sortable: true, format: t => FormatUtils.formatTextMaxLength(t, 100) },
  {name: 'status', align: 'left', label: 'Status', field: 'statusCode', sortable: true},
  {name: 'statusMessage', align: 'left', label: 'Message', field: 'statusMessage', sortable: true, format: t => FormatUtils.formatTextMaxLength(t, 50) },
  {name: 'details', align: 'center' },
  {name: 'actions', align: 'center' }
]);

// Auto-refresh
let timer = null;
onMounted(() => {
  timer = setInterval(() => {
    refreshList();
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
const captureJobConfig = reactive({
  captureConfigName: null,
  captureConfig: null,
  sourcePath: ''
});
const sourceType = ref("folder");
const selectedSource = ref({
  url: null,
  folderName: '',
  files: null
});
const showConfig = ref(false);

const handleFolderSelection = (files) => {
  selectedSource.value.files = files;
  selectedSource.value.folderName = files[0].webkitRelativePath.split('/')[0];
}

const canCancelJob = job => job.statusCode == 'Submitted' || job.statusCode == 'Running'
const cancelJob = (id) => {
  store.dispatch('datacapture/cancelJob', id);
};

const canResubmitJob = job => job.statusCode != 'Submitted' && job.statusCode != 'Running'
const showResubmitConfirmation = ref(false);
const jobToResubmit = ref(null);
const resubmitJob = () => {
  if (!jobToResubmit.value) return;
  const newJob = {
    captureConfig: jobToResubmit.value.captureConfig,
    sourcePath: jobToResubmit.value.sourcePath
  };
  if (jobToResubmit.value.files) newJob.files = jobToResubmit.value.files;
  store.dispatch('datacapture/submitJob', newJob);
  refreshList();
};

const captureJobs = []
const canSubmitJob = computed(() => (captureJobConfig.captureConfigName && (selectedSource.value.url || selectedSource.value.files)));
const submitJobAction = async () => {
  captureJobConfig.captureConfig = selectedConfig.value?.value;

  if (selectedSource.value.url) {
    const urlCaptureJob = {...captureJobConfig}
    urlCaptureJob.sourcePath = selectedSource.value.url
    captureJobs.push(urlCaptureJob)
  } else {
    if (selectedSource.value.files) {
      for (let i = 0; i < selectedSource.value.files.length; i++) {
        const fileCaptureJob = {...captureJobConfig}
        fileCaptureJob.sourcePath = selectedSource.value.folderName + "/" + selectedSource.value.files[i].name;
        fileCaptureJob.files = [selectedSource.value.files[i]];
        captureJobs.push(fileCaptureJob)
      }
    }
  }

  captureJobs.forEach(job => {
    store.dispatch('datacapture/submitJob', job);
  })
  refreshList();
}

const clearData = () => {
  sourceType.value = "folder";
  selectedSource.value = {
    url: null,
    folderName: '',
    files: null
  };
  captureJobConfig.captureConfigName = null
  selectedConfig.value = {};
  showConfig.value = false;
}
</script>
