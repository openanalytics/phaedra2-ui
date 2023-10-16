<template>
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 50vw">

            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-avatar icon="text_snippet" color="primary" text-color="white"/>
                Link Measurement
            </q-card-section>

            <q-card-section>
                <div>
                    Please select a measurement below to link with plate <b>{{ plate.barcode }}</b>:
                </div>
                <div class="q-pt-md">
                    <q-table
                        table-header-class="text-grey"
                        flat square dense
                        :rows="availableMeasurements"
                        :columns="columns"
                        row-key="id"
                        :pagination="{ rowsPerPage: 10, sortBy: 'createdOn', descending: true }"
                        :filter="filter"
                        :filter-method="filterMethod"
                        selection="single"
                        v-model:selected="selectedMeasurements"
                    >
                    <template v-slot:top-left>
                        <div class="row">
                            <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                                <template v-slot:append><q-icon name="search"/></template>
                            </q-input>
                        </div>
                    </template>
                    </q-table>
                </div>
            </q-card-section>

            <q-card-actions class="text-primary" align="right">
                <q-btn flat label="Cancel" v-close-popup/>
                <q-btn label="Link" color="primary" @click="doLink" :disable="selectedMeasurements.length == 0" v-close-popup/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>

import {computed, ref, watch} from "vue";
import {useStore} from "vuex";
import FormatUtils from "@/lib/FormatUtils";
import FilterUtils from "@/lib/FilterUtils";
import projectsGraphQlAPI from "@/api/graphql/projects";

const store = useStore();
const props = defineProps({ show: Boolean, plate: Object });
const emit = defineEmits([ 'update:show', 'linkPlateMeasurement' ]);

const showDialog = computed({
    get: () => props.show,
    set: (v) => emit('update:show', v)
});

watch(() => props.show, (isShown) => {
    if (isShown === true) store.dispatch("measurements/loadAll", props.plate);
});

const doLink = () => {
    const selectedMeas = selectedMeasurements.value[0];
    const { mutate: linkMeasurements } = projectsGraphQlAPI.linkPlateMeasurement(props.plate.id, selectedMeas.id)
    linkMeasurements().then(() => {
      emit('linkPlateMeasurement')
    })
};

const availableMeasurements = computed(() => (store.getters['measurements/getAll']() || []).filter(m => m.rows == props.plate.rows));
const selectedMeasurements = ref([]);

const columns = [
    {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
    {name: 'name', align: 'left', label: 'Measurement Name', field: 'name', sortable: true},
    {name: 'layout', align: 'left', label: 'Dimensions', field: 'layout', sortable: true, format: (val, row) => row.rows + " x " + row.columns},
    {name: 'wellColumns', align: 'left', label: 'Well Columns', field: 'wellColumns', sortable: true, format: val => `${val?.length || 0}` },
    {name: 'subWellColumns', align: 'left', label: 'SubWell Columns', field: 'subWellColumns', sortable: true, format: val => `${val?.length || 0}` },
    {name: 'imageChannels', align: 'left', label: 'Image Channels', field: 'imageChannels', sortable: true, format: val => `${val?.length || 0}` },
    {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
];

const filter = ref(props.plate.barcode);
const filterMethod = FilterUtils.defaultTableFilter();

</script>
