<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="execution">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="Pipeline Executions" icon="play_circle_outline" to="/pipeline-executions"/>
        <q-breadcrumbs-el :label="FormatUtils.formatDate(execution.createdOn)" icon="play_circle_outline"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section-header v-if="!execution" title="Loading..." icon="route"/>
            <div v-else>
                <oa-section-header :title="FormatUtils.formatDate(execution.createdOn)" icon="play_circle_outline"/>
                <div class="row q-pa-md oa-section-body">
                    <div class="col-4 q-gutter-xs">
                        <div class="row">
                            <div class="col-3 text-weight-bold">ID:</div>
                            <div class="col">{{ execution.id }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Pipeline:</div>
                            <div class="col">
                                <router-link :to="'/pipeline/' + execution.pipelineId" >
                                    <div class="row items-center cursor-pointer">
                                        {{ pipeline?.name }}
                                    </div>
                                </router-link>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Current Step:</div>
                            <div class="col">{{ execution.currentStep }} / {{ pipeline?.config?.steps?.length }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Status:</div>
                            <div class="col text-grey">
                                <StatusLabel :status="execution.status" />
                            </div>
                        </div>
                    </div>
                    <div class="col-4 q-gutter-xs">
                        <div class="row">
                            <div class="col-3 text-weight-bold">Created On:</div>
                            <div class="col">{{ FormatUtils.formatDate(execution.createdOn) }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Created By:</div>
                            <div class="col"><UserChip :id="execution.createdBy" /></div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Updated On:</div>
                            <div class="col">{{ FormatUtils.formatDate(execution.updatedOn) }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Updated By:</div>
                            <div class="col"><UserChip :id="execution.updatedBy" /></div>
                        </div>
                    </div>
                    <div class="col-4 q-gutter-xs">
                        <div class="row justify-end action-button">
                            <!-- <q-btn size="sm" color="primary" icon="cancel" label="Cancel" /> -->
                        </div>
                    </div>
                </div>

                <oa-section-header title="Event Log" icon="event" class="q-mt-md" />
                <div class="row q-pa-md oa-section-body">
                    <q-table
                        table-header-class="text-grey"
                        flat dense
                        :rows="executionLog"
                        :columns="logColumns"
                    >
                        <template v-slot:body-cell-messageType="props">
                            <q-td :props="props">
                                <q-badge color="info">{{ props.row.messageType }}</q-badge>
                            </q-td>
                        </template>
                    </q-table>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
    import {computed, ref} from "vue";
    import {useStore} from "vuex";
    import {useRoute, useRouter} from 'vue-router';
    import FormatUtils from "@/lib/FormatUtils.js";
    import UserChip from "@/components/widgets/UserChip";
    import StatusLabel from "@/components/widgets/StatusLabel";
    import OaSectionHeader from "@/components/widgets/OaSectionHeader";

    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const executionId = parseInt(route.params.id);

    const execution = computed(() => store.getters['pipelines/getPipelineExecutionById'](executionId));
    const executionLog = computed(() => store.getters['pipelines/getPipelineExecutionLogById'](executionId));
    const pipeline = computed(() => execution.value ? store.getters['pipelines/getPipelineById'](execution.value.pipelineId) : {});

    store.dispatch('pipelines/loadPipelineExecutionById', executionId).then(() => {
        store.dispatch('pipelines/loadPipelineById', execution.value.pipelineId);
    });
    store.dispatch('pipelines/loadPipelineExecutionLogById', executionId);

    const logColumns = ref([
        {name: 'messageType', align: 'left', label: '', field: 'messageType', sortable: true},
        {name: 'logDate', align: 'left', label: 'Date', field: 'logDate', sortable: true, format: FormatUtils.formatDate},
        {name: 'stepNr', align: 'left', label: 'Step', field: 'stepNr', sortable: true},
        {name: 'message', align: 'left', label: 'Message', field: 'message', sortable: true},
    ]);
</script>