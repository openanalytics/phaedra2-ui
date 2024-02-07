<script setup>
import {ref, computed, onMounted, onBeforeUnmount, reactive, watch} from 'vue'
import {useStore} from 'vuex'

import OaSection from "@/components/widgets/OaSection";
import CaptureJobDetailsPanel from "./CaptureJobDetailsPanel";
// import TableConfig from "@/components/table/TableConfig";
import UserChip from "@/components/widgets/UserChip";
import StatusLabel from "@/components/widgets/StatusLabel";

import FormatUtils from "@/lib/FormatUtils.js"
import DateUtils from "@/lib/DateUtils";

const store = useStore();
const fromDateProxy = ref(null)
const toDateProxy = ref(null)

const now = new Date()
const fromDate = ref(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toLocaleDateString())
const toDate = ref(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toLocaleDateString())

const jobs = computed(() => store.getters['datacapture/getJobs']());
store.dispatch('datacapture/loadJobs', {fromDate: DateUtils.parseLocaleDateString(fromDate.value), toDate: DateUtils.parseLocaleDateString(toDate.value)});

const filteredJobs = ref([])
const columnFilters = ref({})
const visibleColumns = ref([])

const captureConfigList = computed(() => store.getters['datacapture/getAllCaptureConfigs']());
store.dispatch('datacapture/loadAllCaptureConfigs');
const selectedConfig = ref({});

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

const configdialog = ref(false);

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

const handleFolderSelection = (files) => {
  selectedSource.value.files = files;
  selectedSource.value.folderName = files[0].webkitRelativePath.split('/')[0];
}

const canSubmitJob = computed(() => (newJob.captureConfigName && (selectedSource.value.url || selectedSource.value.files)));
const submitJobAction = async () => {
  if (selectedSource.value.url) {
    newJob.sourcePath = selectedSource.value.url;
  } else {
    newJob.sourcePath = selectedSource.value.folderName;
    newJob.files = selectedSource.value.files;
  }

  newJob.captureConfig = selectedConfig.value?.value;
  await store.dispatch('datacapture/submitJob', newJob);
  refreshJobs();
};

const showConfig = ref(false);

const updateVisibleColumns = (columns) => {
  visibleColumns.value = [...columns]
}

const handleColumnFilter = (columnName) => {
  filteredJobs.value = jobs.value.filter(row => String(row[columnName]).includes(columnFilters.value[columnName]))
}

watch(jobs, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  filteredJobs.value = [...jobs.value.map(r => r)]

  columns.value.forEach(col => {
    columnFilters.value[col.name] = ref(null)
  })
})
</script>

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
          :rows="filteredJobs"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="id"
          column-key="name"
          :pagination="{ rowsPerPage: 20, sortBy: 'createDate', descending: true }"
          separator="cell"
          square dense flat
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
<!--            <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>-->
          </div>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{col.label}}
            </q-th>
          </q-tr>
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name">
              <q-input v-if="col.name != 'menu'" v-model="columnFilters[col.name]"
                       @update:model-value="handleColumnFilter(col.name)"
                       dense>
                <template v-slot:append>
                  <q-icon size="xs" name="search"/>
                </template>
              </q-input>
            </q-th>
          </q-tr>
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

<!--      <TableConfig v-model:show="configdialog" v-model:columns="columns" v-model:visibleColumns="visibleColumns"/>-->

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
                        v-model="newJob.captureConfigName"
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
</template>

<style scoped>
:deep(.q-field__control),
:deep(.q-field__append){
  font-size: 12px;
  height: 25px;
}
</style>
