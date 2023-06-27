<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="execution">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="Pipeline Executions" icon="list" to="/pipeline-executions"/>
        <q-breadcrumbs-el :label="FormatUtils.formatDate(execution.createdOn)" icon="play_circle_outline"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section v-if="!execution" title="Loading..." icon="play_circle_outline"/>
            <oa-section v-else :title="FormatUtils.formatDate(execution.createdOn)" icon="play_circle_outline">
                <div class="row q-pa-md">
                    <div class="col-2">
                        <q-field label="ID" stack-label dense borderless>
                            <template v-slot:control>
                                {{ execution.id }}
                            </template>
                        </q-field>
                        <q-field label="Pipeline" stack-label dense borderless>
                            <template v-slot:control>
                                <router-link :to="'/pipeline/' + execution.pipelineId" >
                                    <div class="row items-center cursor-pointer">
                                        {{ pipeline?.name }}
                                    </div>
                                </router-link>
                            </template>
                        </q-field>
                    </div>
                    <div class="col-2">
                        <q-field label="Current Step" stack-label dense borderless>
                            <template v-slot:control>
                                {{ execution.currentStep }} / {{ pipeline?.config?.steps?.length }}
                            </template>
                        </q-field>
                        <q-field label="Status" stack-label dense borderless>
                            <template v-slot:control>
                                <StatusLabel :status="execution.status" />
                            </template>
                        </q-field>
                    </div>
                    <div class="col-3">
                        <q-field label="Created On" stack-label dense borderless>
                            <template v-slot:control>
                                {{ FormatUtils.formatDate(execution.createdOn) }}
                            </template>
                        </q-field>
                        <q-field label="Created By" stack-label dense borderless>
                            <template v-slot:control>
                                <div class="q-pt-xs">
                                    <UserChip :id="execution.createdBy"/>
                                </div>
                            </template>
                        </q-field>
                    </div>
                    <div class="col-3">
                        <q-field label="Updated On" stack-label dense borderless>
                            <template v-slot:control>
                                {{ FormatUtils.formatDate(execution.updatedOn) }}
                            </template>
                        </q-field>
                        <q-field label="Updated By" stack-label dense borderless>
                            <template v-slot:control>
                                <div class="q-pt-xs">
                                    <UserChip :id="execution.updatedBy"/>
                                </div>
                            </template>
                        </q-field>
                    </div>
                    <div class="col-2">
                        <div class="row justify-end action-button">
                            <q-btn size="sm" color="negative" icon="cancel" label="Abort" v-if="canCancel" @click="showCancelDialog = true" />
                        </div>
                    </div>
                </div>
            </oa-section>

            <oa-section title="Event Log" icon="event" class="q-mt-md">
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
            </oa-section>
        </div>
    </q-page>

    <confirm-dialog title="Abort Pipeline Execution" message="Are you sure you want to abort the execution of this pipeline?" v-model:show="showCancelDialog" @onConfirm="confirmCancel" />
</template>

<script setup>
    import {computed, ref} from "vue";
    import {useStore} from "vuex";
    import {useRoute, useRouter} from 'vue-router';
    import FormatUtils from "@/lib/FormatUtils.js";
    import UserChip from "@/components/widgets/UserChip";
    import ConfirmDialog from "@/components/widgets/ConfirmDialog";
    import StatusLabel from "@/components/widgets/StatusLabel";
    import OaSection from "@/components/widgets/OaSection";

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

    const canCancel = computed(() => execution.value?.status == 'RUNNING');
    const showCancelDialog = ref(false);
    const confirmCancel = () => {
        store.dispatch('pipelines/cancelPipelineExecution', executionId);
    };

    const logColumns = ref([
        {name: 'messageType', align: 'left', label: '', field: 'messageType', sortable: true},
        {name: 'logDate', align: 'left', label: 'Date', field: 'logDate', sortable: true, format: FormatUtils.formatDate},
        {name: 'stepNr', align: 'left', label: 'Step', field: 'stepNr', sortable: true},
        {name: 'message', align: 'left', label: 'Message', field: 'message', sortable: true},
    ]);
</script>