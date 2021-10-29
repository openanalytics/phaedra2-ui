<template>
    <q-table
        table-header-class="text-grey"
        flat
        :rows="jobs"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 20, sortBy: 'createDate', descending: true }"
        class="full-width"
    >
        <template v-slot:body-cell-statusCode="props">
            <q-td :props="props">
                <q-badge :color="ColorUtils.getCaptureJobStatusColor(props.row.statusCode)">{{props.row.statusCode}}</q-badge>
            </q-td>
        </template>
        <template v-slot:body-cell-details="props">
            <q-td :props="props">
                <q-btn label="Details" icon-right="chevron_right" size="sm" @click="doShowJobDetails(props.row)" />
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
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'

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
                { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
                { name: 'createDate', align: 'left', label: 'Created On', field: 'createDate', sortable: true, format: FormatUtils.formatDate },
                { name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true },
                { name: 'sourcePath', align: 'left', label: 'Source Path', field: 'sourcePath', sortable: true },
                { name: 'statusCode', label: 'Status', field: 'statusCode', sortable: true },
                { name: 'statusMessage', align: 'left', label: 'Message', field: 'statusMessage', sortable: true },
                { name: 'details' },
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

            return {
                jobs,
                columns,
                refreshJobs,
                showJobDetails,
                jobDetails,
                doShowJobDetails,
                ColorUtils
            }
        }
    }
</script>