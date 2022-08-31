<template>
  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">
      <oa-section-header :title="'Datacapture Jobs'" :icon="'list_alt'"/>
      <div class="row q-pa-lg oa-section-body">
        <div class="row col-12 q-pb-md justify-end">
          <q-btn color="primary" icon="refresh" @click="refreshJobListAction" class="on-left"/>
          <q-btn color="primary" label="Submit New Job..." @click="submitNewJob = true"/>
        </div>
        <CaptureJobsList ref="jobList"></CaptureJobsList>
        <q-dialog v-model="submitNewJob">
          <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section class="bg-primary text-white">
              <div class="text-h6">
                <q-icon name="scanner" class="q-mr-sm"/>
                Submit New DataCapture Job
              </div>
            </q-card-section>
            <q-card-section class="q-pa-sm q-gutter-sm">
              <q-input v-model="newJob.sourcePath" label="Source Path"/>
              <q-input v-model="newJob.captureConfig" type="textarea" autogrow label="Capture Configuration"/>
            </q-card-section>
            <q-card-section class="row q-pa-sm q-gutter-sm justify-end">
              <q-btn color="info" label="Cancel" @click="submitNewJob = false"/>
              <q-btn color="primary" label="Submit" @click="submitJobAction"/>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script>
import {ref} from 'vue'
import datacaptureAPI from "@/api/datacapture";
import CaptureJobsList from "./CaptureJobsList";
import OaSectionHeader from "../../components/widgets/OaSectionHeader";

export default {
  components: {
    CaptureJobsList,
    OaSectionHeader
  },
  setup() {
    const submitNewJob = ref(false);
    const newJob = ref({
      sourcePath: '',
      captureConfig: JSON.stringify({})
    });
    const submitJobAction = async () => {
      if (newJob.value.sourcePath == '') alert('No source path specified!')
      //TODO error handling
      await datacaptureAPI.postJob(newJob.value);
      submitNewJob.value = false;
      jobList.value.refreshJobs();
    };
    const refreshJobListAction = () => {
      jobList.value.refreshJobs();
    };
    const jobList = ref(null);

    return {
      submitNewJob,
      newJob,
      submitJobAction,
      jobList,
      refreshJobListAction
    }
  }
}
</script>
