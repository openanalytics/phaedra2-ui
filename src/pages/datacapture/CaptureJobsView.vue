<template>
    <q-page>
        <div class="q-pa-md">
            <div class="row text-h6 items-center q-px-md oa-section-title">
                <q-icon name="scanner" class="q-mr-sm"/>
                DataCapture Jobs
            </div>
            <div class="row q-pa-lg oa-section-body">
                <div class="row col-12 q-pb-md justify-end">
                    <q-btn color="primary" label="Submit New Job..." @click="submitNewJob = true"/>
                </div>
                <CaptureJobsList ref="jobList"></CaptureJobsList>
                <q-dialog v-model="submitNewJob">
                    <q-card style="width: 700px; max-width: 80vw;">
                        <q-card-section class="bg-primary text-white">
                            <div class="text-h6">Submit New DataCapture Job</div>
                        </q-card-section>
                        <q-card-section class="q-pa-sm q-gutter-sm">
                            <q-input v-model="newJob.sourcePath" label="Source Path" />
                            <q-input v-model="newJob.captureConfig" type="textarea" label="Capture Configuration" />
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
    import { ref } from 'vue'
    import datacaptureAPI from "@/api/datacapture";
    import CaptureJobsList from "./CaptureJobsList";

    export default {
        components: {
            CaptureJobsList
        },
        setup() {
            const submitNewJob = ref(false);
            const newJob = {
                sourcePath: '',
                captureConfig: JSON.stringify({})
            };
            const submitJobAction = async () => {
                if (newJob.sourcePath == '') alert('No source path specified!')
                //TODO error handling
                await datacaptureAPI.postJob(newJob);
                submitNewJob.value = false;
                jobList.value.refreshJobs();
            };
            const jobList = ref(null);

            return {
                submitNewJob,
                newJob,
                submitJobAction,
                jobList
            }
        }
    }
</script>