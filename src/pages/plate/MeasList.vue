<template>
    <q-table
        table-header-class="text-grey"
        flat square dense
        :rows="plateMeasurements"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
    >
        <template v-slot:top-left>
            <q-btn size="sm" icon="add" class="oa-button q-mb-md" label="Link Measurement" @click="showLinkMeasDialog = true" />
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
                <q-toggle dense :model-value="props.value" @update:model-value="val => handleSetActiveMeasurement(val, props.row)"/>
            </q-td>
        </template>
        <template v-slot:body-cell-createdBy="props">
            <q-td :props="props">
                <UserChip :id="props.row.createdBy" />
            </q-td>
        </template>
    </q-table>

    <LinkMeasurementDialog v-model:show="showLinkMeasDialog" :plate="plate" @linkPlateMeasurement="handleLinkPlateMeasurement"/>

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
    import {ref} from 'vue'
    import {useStore} from 'vuex'
    import {useRouter} from "vue-router";
    import FormatUtils from "@/lib/FormatUtils";
    import UserChip from "@/components/widgets/UserChip";
    import LinkMeasurementDialog from "@/components/measurement/LinkMeasurementDialog";
    import projectsGraphQlAPI from "@/api/graphql/projects";

    const store = useStore();
    const router = useRouter();
    const props = defineProps({ plate: Object });

    const columns = [
      {name: 'active', align: 'left', label: 'Active?', field: row => (row.active === undefined) ? false : row.active, sortable: true},
      {name: 'measurementId', align: 'left', label: 'ID', field: 'measurementId', sortable: true},
      {name: 'name', align: 'left', label: 'Measurement Name', field: 'name', sortable: true},
      {name: 'wellColumns', align: 'left', label: 'Well Columns', field: 'wellColumns', sortable: true, format: val => `${val?.length || 0}` },
      {name: 'subWellColumns', align: 'left', label: 'SubWell Columns', field: 'subWellColumns', sortable: true, format: val => `${val?.length || 0}` },
      {name: 'imageChannels', align: 'left', label: 'Image Channels', field: 'imageChannels', sortable: true, format: val => `${val?.length || 0}` },
      {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
      {name: 'linkedOn', align: 'left', label: 'Linked On', field: 'linkedOn', sortable: true, format: FormatUtils.formatDate },
      {name: 'menu', align: 'left', field: 'menu', sortable: false}
    ];

    const plateMeasurements = ref([])

    const fetchPlateMeasurements = () => {
      const {onResult, onError} = projectsGraphQlAPI.measurementsByPlateId(props.plate.id)
      onResult(({data}) => {
        plateMeasurements.value = data.plateMeasurements
      })
    }

    const showLinkMeasDialog = ref(false);
    const confirm = ref(false);

    const handleSetActiveMeasurement = (active, { plateId, measurementId}) => {
      if (active) {
        updateActiveState(plateId, measurementId)
      }
    }

    const updateActiveState = (plateId, measurementId) => {
      const { mutate:  linkPlateMeasurement, onDone} = projectsGraphQlAPI.linkPlateMeasurement(plateId, measurementId)
      linkPlateMeasurement()

      onDone(({data}) => {
          fetchPlateMeasurements()
      })
    };

    const onSelectMeasurement = (measurementId) => {
        router.push("/datacapture/meas/" + measurementId);
    }

    const handleLinkPlateMeasurement = () => {
      fetchPlateMeasurements()
    }

    fetchPlateMeasurements()
</script>
