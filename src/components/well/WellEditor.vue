<template>
  <div class="q-pa-xs">
    <div class="q-pa-xs oa-section-body">
      <div class="col-12 q-mb-sm">
        <div v-if="tab==='overview'">
          <q-checkbox dense v-model="skipped" label="Skip Wells" @update:model-value="updateSkipped"/>
          <q-icon name="info" color="primary" class="q-pl-md">
            <q-tooltip>These wells will be skipped when applying the template to a plate</q-tooltip>
          </q-icon>
        </div>
        <div v-if="tab==='well-type'" class="row items-center">
          <q-select v-model="selectedType" :options="wellTypes" class="col-4" dense/>
          <q-btn label="Apply" @click="updateWellType" class="oa-action-button col-1" size="sm" dense/>
        </div>
        <div v-if="tab==='substance'" class="row items-center">
            <q-input v-model="substanceType" label="Substance Type" class="col-4" dense />
            <q-btn label="Apply" @click="updateSubstanceType" class="oa-action-button col-1" size="sm" dense/>
            <q-space/>
            <q-input v-model="substanceName" label="Substance Name" class="col-4" dense />
            <q-btn label="Apply" @click="updateSubstanceName" class="oa-action-button col-1" size="sm" dense/>
        </div>
        <div v-if="tab==='concentration'" class="row items-center">
            <q-input v-model="concentration" label="Concentration" class="col-4" dense />
            <q-btn label="Apply" icon="check" @click="updateConcentration" class="oa-action-button col-1" size="sm" dense/>
            <q-icon name="info" color="primary" class="q-pl-md">
              <q-tooltip>In Molar (M), for example: 1E-6.</q-tooltip>
            </q-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .legendRow {
    width: 200px;
  }
</style>

<script setup>
import {ref, watch} from "vue";
import {useTemplateStore } from "@/stores/template";
import {useUIStore} from "@/stores/ui";

const props = defineProps(['plateId', 'tab', 'update'])
const templateStore = useTemplateStore()
const uiStore = useUIStore()

const wellTypes = ["EMPTY", "SAMPLE", "LC", "HC", "NC", "PC"]
const selectedType = ref(null)
const skipped = ref(false)
const substanceName = ref(null)
const substanceType = ref(null)
const concentration = ref(null)

if (uiStore.selectedWells && uiStore.selectedWells.length > 0)
  skipped.value = uiStore.selectedWells[0].skipped
else
  skipped.value = false

const updateSkipped = () => {
  if (uiStore.selectedWells && uiStore.selectedWells.length > 0)
    templateStore.updateTemplateWells(uiStore.selectedWells, 'skipped', skipped.value)
}

const updateWellType = () => {
  if (uiStore.selectedWells && uiStore.selectedWells.length > 0)
    templateStore.updateTemplateWells(uiStore.selectedWells, 'wellType', selectedType.value)
}

const updateSubstanceType = () => {
  if (uiStore.selectedWells && uiStore.selectedWells.length > 0)
    templateStore.updateTemplateWells(uiStore.selectedWells, 'substanceType', substanceType.value)
}

const updateSubstanceName = () => {
  if (uiStore.selectedWells && uiStore.selectedWells.length > 0)
    templateStore.updateTemplateWells(uiStore.selectedWells, 'substanceName', substanceName.value)
}

const updateConcentration = () => {
  if (uiStore.selectedWells && uiStore.selectedWells.length > 0)
    templateStore.updateTemplateWells(uiStore.selectedWells, 'concentration', concentration.value)
}

const getSelectedWellValue = (property) => {
  if (!uiStore.selectedWells) return null

  const firstVal = uiStore.selectedWells[0] ? uiStore.selectedWells[0][property] : null

  if (!uiStore.selectedWells.map(w => w[property]).every(val => val === firstVal))
    return null

  return firstVal
}

watch(() => props.update, () => {
  selectedType.value = getSelectedWellValue('wellType')
  skipped.value = getSelectedWellValue('skipped')
  substanceName.value = getSelectedWellValue('substanceName')
  substanceType.value = getSelectedWellValue('substanceType')
  concentration.value = getSelectedWellValue('concentration')
})

</script>
