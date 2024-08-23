<template>
  <oa-table :rows="plateMeasurements" :columns="columns"
                 @row-dblclick="onSelectMeasurement">
    <template v-slot:top-left>
      <q-btn size="sm" icon="add" class="oa-button q-mb-md" label="Link Measurement"
             @click="showLinkMeasDialog = true" v-if="!readOnly"/>
    </template>
    <template v-slot:body-cell="props">
      <q-td :props="props" :class="props.row.active ? 'text-dark' : 'text-grey'">
        {{ props.value }}
      </q-td>
    </template>
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <div :class="props.row.active ? 'text-dark' : 'text-grey'">
          {{ props.row.name }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-active="props">
      <q-td :props="props">
        <q-toggle v-if="readOnly" dense :model-value="props.value" disable/>
        <q-toggle v-else dense :model-value="props.value"
                  @update:model-value="val => handleSetActiveMeasurement(val, props.row)"/>
      </q-td>
    </template>
  </oa-table>

  <LinkMeasurementDialog v-model:show="showLinkMeasDialog" :plates="[plate]"
                         @linkPlateMeasurement="handleLinkPlateMeasurement"/>

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
import {useRouter} from "vue-router";
import FormatUtils from "@/lib/FormatUtils";
import LinkMeasurementDialog from "@/components/measurement/LinkMeasurementDialog";
import projectsGraphQlAPI from "@/api/graphql/projects";
import {usePlateStore} from "@/stores/plate";
import OaTable from "@/components/table/OaTable.vue";

const props = defineProps({ plate: Object, readOnly: Boolean });
const readOnly = ref(props.readOnly)

const columns = [
  {name: 'active', align: 'left', label: 'Active?', field: row => (row.active === undefined) ? false : row.active, sortable: true},
  {name: 'measurementId', align: 'left', label: 'ID', field: 'measurementId', sortable: true},
  {name: 'name', align: 'left', label: 'Measurement Name', field: 'name', sortable: true},
  {name: 'wellColumns', align: 'left', label: 'Well Columns', field: 'wellColumns', sortable: true, format: val => `${val?.length || 0}` },
  {name: 'subWellColumns', align: 'left', label: 'SubWell Columns', field: 'subWellColumns', sortable: true, format: val => `${val?.length || 0}` },
  {name: 'imageChannels', align: 'left', label: 'Image Channels', field: 'imageChannels', sortable: true, format: val => `${val?.length || 0}` },
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
  {name: 'linkedOn', align: 'left', label: 'Linked On', field: 'linkedOn', sortable: true, format: FormatUtils.formatDate },
];

const plateMeasurements = ref([])
const plateStore = usePlateStore()

const fetchPlateMeasurements = () => {
  const {onResult, onError} = projectsGraphQlAPI.measurementsByPlateId(props.plate.id)
  onResult(({data}) => {
    plateMeasurements.value = data.plateMeasurements
    plateStore.reloadPlate()
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

const router = useRouter();
const onSelectMeasurement = (event, row) => {
    router.push("/datacapture/meas/" + row.measurementId);
}

const handleLinkPlateMeasurement = () => {
  fetchPlateMeasurements()
}
fetchPlateMeasurements()

</script>
