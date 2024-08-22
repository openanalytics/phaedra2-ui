<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 60vw">
      <q-card-section class="row text-h6 no-wrap q-pa-sm bg-primary text-secondary">
        <div class="col"> Export Plate List </div>
        <div class="col row items-center justify-end">
          <q-btn color="secondary" flat round dense icon="close" v-close-popup />
        </div>
      </q-card-section>
      <q-card-section>
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step title="Select Features" :name="1" :done="step > 1">
            <SelectFeaturesStep :features="experimentFeatures"
                                v-model:selectedFeatures="filterModel.selectedFeatures"/>
          </q-step>

          <q-step title="Filter Plates" :name="2" :done="step > 2">
            <FilterPlatesStep v-model:filterPlates="filterModel.plateFilter"/>
          </q-step>

          <q-step title="Include stats" :name="3">
            <div class="row q-pb-sm" style="font-size: 16px">
              <span>Step 3/3: Select the plates statistic to export.</span>
            </div>
            <q-separator class="q-mb-md"/>
            <q-list dense>
              <div class="q-pa-xs">
                <q-checkbox v-model="filterModel.plateStats.summary" label="Plate Summery (#DRC, #SDP)"
                            dense disable/>
              </div>
              <div class="q-pa-xs">
                <q-checkbox v-model="filterModel.plateStats.featureStats" label="Feature Statistics" dense/>
              </div>
              <div class="q-pa-xs">
                <q-checkbox v-model="filterModel.plateStats.featureStatsByWellType"
                            label="Feature Well-Type Statistics (Mean, %CV)" dense/>
              </div>
            </q-list>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn v-if="step < 3" @click="next" color="primary" label="Continue" :disable="!isValid()" />
              <q-btn v-if="step == 3" @click="finish" color="primary" label="Finish" :disable="!isValid()" />
              <q-btn v-if="step > 1" @click="previous" color="primary" label="Back" class="q-ml-sm" flat />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import resultDataGraphQlAPI from "@/api/graphql/resultdata";
import queriesGraphQlAPI from "@/api/graphql/queries";
import {useNotification} from "@/composable/notification";
import SelectFeaturesStep from "@/components/plate/SelectFeaturesStep";
import FilterPlatesStep from "@/components/plate/FilterPlatesStep.vue";
import {useLoadingHandler} from "@/composable/loadingHandler";
import exportToExcel from "@/service/exportToExcel";

const props = defineProps(['show', "experiment"])
const emits = defineEmits(['update:show']);

const experimentProtocols = ref([])
const experimentFeatures = ref([])

const filterModel = ref({
  experimentId: props.experiment.id,
  selectedFeatures: [],
  plateFilter: {
    filterOnValidation: false,
    validationFilter: {
      username: null,
      validationDate: {
        start: null,
        end: null
      }
    },
    filterOnApproval: false,
    approvalFilter: {
      username: null,
      approvalDate: {
        start: null,
        end: null
      }
    },
    includeInvalidatedPlates: false,
    includeDisapprovedPlates: false,
  },
  plateStats: {
    summary: false,
    featureStats: true,
    featureStatsByWellType: false
  }
})

onMounted(() => {
  fetchProtocolsByExperiment()
})

const useNotify = useNotification()
const fetchProtocolsByExperiment = () => {
  const {onResult, onError} = resultDataGraphQlAPI.protocolsByExperimentId(props.experiment.id)
  onResult(({data}) => {
    experimentProtocols.value = data.protocols
    experimentFeatures.value = data.protocols.map(extractFeatures).flat()
  })
  onError((error) => useNotify.showError(error))
}

const extractFeatures = (protocol) => {
  return protocol.features.map(feature => ({
    "id": feature.id,
    "name": feature.name,
    "protocolId": protocol.id,
    "protocol": protocol.name
  }))
}

const showDialog = computed({
  get: () => props.show,
  set: (v) => emits('update:show', v)
});

const stepper = ref(null)
const step = ref(1)

const next = () => {
  step.value++
}

const previous = () => {
  if (step.value > 1) step.value--
}

const loadingHandler = useLoadingHandler()
const finish = async () => {
  if (step.value >= 3) showDialog.value = false
  await loadingHandler.handleLoadingDuring(fetchPlateDataResults())
}

const fetchPlateDataResults = async () => {
  console.log(JSON.stringify(filterModel.value))
  const {onResult, onError} = queriesGraphQlAPI.exportPlateData(filterModel.value)
  onResult(({data}) => {
    exportToExcel.exportPlateDataToXLSX(data.plateData, props.experiment.name)
    console.log(JSON.stringify(data.plateData))
  })
}

const isValid = () => {
  if (step.value == 1)
    return filterModel.value.selectedFeatures.length > 0
  return true
}

</script>

