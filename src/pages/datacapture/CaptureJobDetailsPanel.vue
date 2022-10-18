<template>
    <q-card style="width: 1000px; max-width: 80vw;">
        <q-card-section class="bg-primary text-white">
            <div class="text-h6">
                <q-icon name="scanner" class="on-left"/>
                DataCapture Job Details
            </div>
        </q-card-section>

        <q-card-section class="q-pa-md q-gutter-sm">
            <div class="row">
                <div class="col-3">Job ID:</div>
                <div class="col-9">{{ job.id }}</div>
            </div>
            <div class="row">
                <div class="col-3">Created On:</div>
                <div class="col-9">{{ FormatUtils.formatDate(job.createDate) }}</div>
            </div>
            <div class="row">
                <div class="col-3">Created By:</div>
                <div class="col-9"><UserChip :id="job.createdBy" /></div>
            </div>
            <div class="row">
                <div class="col-3">Source Path:</div>
                <div class="col-9">{{ job.sourcePath }}</div>
            </div>
            <div class="row">
                <div class="col-3">Status:</div>
                <StatusLabel :status="job.statusCode" />
            </div>
            <div class="row">
                <div class="col-3">Message:</div>
                <div class="col-9">{{ job.statusMessage }}</div>
            </div>
            <div class="row">
                <div class="col-3">Events:</div>
                <div class="col-9">
                    <q-table
                        table-header-class="text-grey"
                        flat dense
                        :rows="job.events"
                        :columns="columns"
                    >
                        <template v-slot:body-cell-eventType="props">
                            <q-td :props="props">
                                <q-badge :color="ColorUtils.getCaptureJobEventTypeColor(props.row.eventType)">{{ props.row.eventType }}</q-badge>
                            </q-td>
                        </template>
                    </q-table>
                </div>
            </div>
            <div class="row">
                <div class="col-3">Capture Configuration:</div>
                <div class="col-9">
                    <q-card square v-if="showConfig" class="bg-grey-3">
                        <pre class="q-ma-none q-pa-sm">{{ FormatUtils.formatJSON(config) }}</pre>
                    </q-card>
                    <q-btn v-if="!showConfig" label="Show" @click="fetchConfig(job.id); showConfig=true" size="sm" color="primary" icon="remove_red_eye"/>
                    <q-btn v-if="showConfig" label="Hide " @click="showConfig=false" class="q-mt-sm" size="sm" color="primary" icon="remove_red_eye"/>
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup>
    import {computed, ref} from "vue";
    import {useStore} from "vuex";

    import FormatUtils from "@/lib/FormatUtils.js";
    import ColorUtils from "@/lib/ColorUtils.js";

    import UserChip from "@/components/widgets/UserChip";
    import StatusLabel from "@/components/widgets/StatusLabel"; 

    const props = defineProps({
        job: Object
    });

    const store = useStore();
    
    const columns = ref([
        {name: 'eventType', align: 'left', label: '', field: 'eventType', sortable: true},
        {name: 'eventDate', align: 'left', label: 'Event Date', field: 'eventDate', sortable: true, format: FormatUtils.formatDate},
        {name: 'eventDetails', align: 'left', label: 'Event Details', field: 'eventDetails', sortable: true},
    ]);

    const config = computed(() => store.getters['datacapture/getConfig']());
    const showConfig = ref(false);
    const fetchConfig = (id) => {
        store.dispatch('datacapture/loadCaptureJobConfig',id);
    };
</script>