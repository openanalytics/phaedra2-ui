<template>
    <q-table
        table-header-class="text-grey"
        flat square dense
        :rows="plateMeasurements"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 10, sortBy: 'active', descending: true }"
    >
        <template v-slot:top-left>
            <q-btn size="sm" icon="add" class="oa-button q-mb-md" label="Link Measurement" @click="addMeasDialog" />
        </template>
        <template v-slot:body-cell="props">
            <q-td :props="props" :class="props.row.active ? 'text-dark' : 'text-grey'">
                {{ props.value }}
            </q-td>
        </template>
        <template v-slot:body-cell-name="props">
            <q-td :props="props">
                <div @click="onSelectMeasurement(props.row.measurementId)" class="cursor-pointer" :class="props.row.active ? 'text-dark' : 'text-grey'">
                    {{ props.row.name }}
                </div>
            </q-td>
        </template>
        <template v-slot:body-cell-active="props">
            <q-td :props="props">
                <q-toggle
                :model-value="props.value"
                @update:model-value="val => openConfirmDialog(val, props.row)"/>
            </q-td>
        </template>
        <template v-slot:body-cell-createdBy="props">
            <q-td :props="props">
                <UserChip :id="props.row.createdBy" />
            </q-td>
        </template>
    </q-table>

    <q-dialog v-model="openMeasDialog" square persistent class="q-gutter-sm">
        <q-card>
            <q-card-section style="min-width: 350px">
                <div class="text-h6">Select measurements:</div>
            </q-card-section>
            
            <q-card-section class="row">
                <div class="col col-12">
                    <q-select v-model="selectedMeasurement" :options="availableMeasurements"
                    option-label="barcode"
                    option-value="id"/>
                </div>
            </q-card-section>
            
            <q-card-actions align="right">
                <q-btn label="Cancel" color="primary" flat v-close-popup/>
                <q-btn label="Save" color="primary" v-close-popup @click="addMeasurement"/>
            </q-card-actions>
        </q-card>
    </q-dialog>

    <q-dialog v-model="confirm" persistent>
        <q-card>
            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-avatar icon="sync" color="primary" text-color="white"/>
                Change Active Measurement
            </q-card-section>
            
            <q-card-section class="row items-center">
                <span class="q-ml-sm">Are you sure you want to change the active measurement for this plate?</span>
            </q-card-section>
            
            <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup/>
                <q-btn label="Yes" color="primary" v-close-popup @click="updateActiveState"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
    import {ref, computed} from 'vue'
    import {useStore} from 'vuex'
    import {useRouter} from "vue-router";
    import FormatUtils from "@/lib/FormatUtils";
    import UserChip from "@/components/widgets/UserChip";

    const store = useStore();
    const router = useRouter();

    const props = defineProps({ plate: Object });

    const plateMeasurements = computed(() => store.getters['measurements/getPlateMeasurements'](props.plate.id) || []);
    const availableMeasurements = computed(() => store.getters['measurements/getAll']() || []);
    store.dispatch('measurements/loadByPlateId', props.plate.id);

    const columns = [
        {name: 'active', align: 'left', label: 'Active?', field: row => (row.active === undefined) ? false : row.active, sortable: true},
        {name: 'measurementId', align: 'left', label: 'ID', field: 'measurementId', sortable: true},
        {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
        {name: 'dimensions', align: 'left', label: 'Dimensions', field: row => `${row.rows} x ${row.columns}`, sortable: false },
        {name: 'wellColumns', align: 'left', label: 'Well Columns', field: 'wellColumns', sortable: true, format: val => `${val?.length || 0}` },
        {name: 'subWellColumns', align: 'left', label: 'SubWell Columns', field: 'subWellColumns', sortable: true, format: val => `${val?.length || 0}` },
        {name: 'imageChannels', align: 'left', label: 'Image Channels', field: 'imageChannels', sortable: true, format: val => `${val?.length || 0}` },
        {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
        {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true}
    ];

    const openMeasDialog = ref(false);
    const confirm = ref(false);
    const selectedMeasurement = ref();
    const newActiveMeas = ref();

    const addMeasDialog = () => {
        store.dispatch("measurements/loadAvailableMeasurements", props.plate);
        openMeasDialog.value = true;
    };

    const addMeasurement = () => {
        const activePlateMeasurement = {
            plateId: props.plate.id,
            measurementId: selectedMeasurement.value.id,
            active: true,
            ...selectedMeasurement.value
        };
        store.dispatch('measurements/addMeasurement', activePlateMeasurement);
    };

    const openConfirmDialog = (active, { plateId, measurementId}) => {
        const current = store.getters['measurements/getActivePlateMeasurement'](plateId);
        newActiveMeas.value = {active, plateId, measurementId};
        if (current && active) {
            confirm.value = true;
        } else {
            updateActiveState();
        }
    };

    const updateActiveState = () => {
        if (newActiveMeas.value) store.dispatch('measurements/setActiveMeasurement',  newActiveMeas.value);
    };

    const onSelectMeasurement = (measurementId) => {
        router.push("/datacapture/meas/" + measurementId);
    }
</script>
