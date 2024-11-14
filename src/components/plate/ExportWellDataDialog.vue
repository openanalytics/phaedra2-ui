<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 60vw">
      <q-card-section class="row text-h6 no-wrap q-pa-sm bg-primary text-secondary">
        <div class="col"> Export Well Data </div>
        <div class="col row items-center justify-end">
          <q-btn color="secondary" flat round dense icon="close" v-close-popup />
        </div>
      </q-card-section>
      <q-card-section >
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step title="Select Features" :name="1" :done="step > 1">
            <SelectFeaturesStep :features="experimentFeatures"
                                v-model:selectedFeatures="filterModel.selectedFeatures"/>
          </q-step>

          <q-step title="Filter Plates" :name="2" :done="step > 2">
            <FilterPlatesStep v-model:filterPlates="filterModel.plateFilter"/>
          </q-step>

          <q-step title="Filter Wells/Substances" :name="3">
            <FilterWellsStep v-model:wellFilter="filterModel.wellFilter"/>
          </q-step>

          <q-step title="Include Data" :name="4">
            <div class="row q-pb-md" style="font-size: 16px">
              <span>Step 4/4: Include additional well data to the export.</span>
            </div>
            <q-separator class="q-mb-md"/>
            <q-list dense>
              <div class="q-pa-xs">
                <q-checkbox v-model="filterModel.includeBasicCurveProperties"
                            label="Include Curve properties (Basic)" disable dense/>
              </div>
              <div class="q-pa-xs">
                <q-checkbox v-model="filterModel.includeAllCurveProperties"
                            label="Include Curve properties (All)" disable dense/>
              </div>
            </q-list>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation class="row no-wrap">
              <q-btn v-if="step < 4" @click="next" color="primary" label="Continue" :disable="!isValid()"/>
              <q-btn v-if="step == 4" @click="finish" color="primary" label="Finish" :disable="!isValid()"/>
              <q-btn v-if="step > 1" @click="previous" color="primary" label="Back" class="q-ml-sm" flat/>
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {computed, onUpdated, ref} from "vue";
import resultDataGraphQlAPI from "@/api/graphql/resultdata";
import {useNotification} from "@/composable/notification";
import SelectFeaturesStep from "@/components/plate/SelectFeaturesStep.vue";
import FilterPlatesStep from "@/components/plate/FilterPlatesStep.vue";
import FilterWellsStep from "@/components/plate/FilterWellsStep.vue"
import platesAPI from "@/api/plates";
import {useLoadingHandler} from "@/composable/loadingHandler";
import queriesGraphQlAPI from "@/api/graphql/queries";
import exportToExcel from "@/service/exportToExcel";
import { groupBy, map, last } from 'underscore';

const props = defineProps(['show', "experiment"])
const emits = defineEmits(['update:show']);

const experiment = computed(() => props.experiment)

const experimentProtocols = ref([])
const experimentFeatures = ref([])
const filterModel = ref({
  experimentId: experiment.value[0].id,
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
  wellFilter: {
    substances: [],
    includeRejectedWells: false,
    wellTypes: [],
  },
  includeAllCurveProperties: false,
  includeBasicCurveProperties: false
})

onUpdated(() => {
  fetchProtocolsByExperiment()
  fetchUniqueWellSubstances()
})

const useNotify = useNotification()
const fetchProtocolsByExperiment = async () => {
  experimentProtocols.value = []
  experimentFeatures.value = []
  for (let e = 0; e < experiment.value.length; e++) {
    const data = await resultDataGraphQlAPI.protocolsByExperimentId(experiment.value[e].id)
    if (data.protocols && data.protocols.length > 0) {
      experimentProtocols.value = map(
          groupBy(experimentProtocols.value.concat(data.protocols), 'id'), last);
      experimentFeatures.value = experimentProtocols.value.map(extractFeatures).flat()
    }
    // const {onResult, onError} = await resultDataGraphQlAPI.protocolsByExperimentId(experiment.value[e].id)
    // onResult(({data}) => {
    //   if (data.protocols && data.protocols.length > 0) {
    //     experimentProtocols.value = map(groupBy(experimentProtocols.value.concat(data.protocols), 'id'), last);
    //     experimentFeatures.value = experimentProtocols.value.map(extractFeatures).flat()
    //   }
    // })
    // onError((error) => useNotify.showError(error))
  }
}

const fetchUniqueWellSubstances = () => {
  platesAPI
}

const extractFeatures = (protocol) => {
  return protocol.features.map(feature => ({
    "id": feature.id,
    "name": feature.name,
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
  if (step.value >= 4) showDialog.value = false
  await loadingHandler.handleLoadingDuring(fetchPlateDataResults())
}

const fetchPlateDataResults = async () => {
  const fileName = experiment.value.length === 1 ? experiment.value[0].name : 'selectedPlatesList'
  var collectiveData = []
  var callbacks = experiment.value.length
  for (let e = 0; e < experiment.value.length; e++) {
    filterModel.value.experimentId = experiment.value[e].id
    const {onResult, onError} = queriesGraphQlAPI.exportWellData(filterModel.value)
    onResult(({data}) => {
      collectiveData = collectiveData.concat(data.wellData)
      callbacks -= 1
      if (callbacks === 0) {
        exportToExcel.exportWellDataToXLSX(collectiveData, fileName)
      }
    })
  }
}

const isValid = () => {
  if (step.value == 1)
    return filterModel.value.selectedFeatures.length > 0
  return true
}

</script>

<style scoped>
</style>
