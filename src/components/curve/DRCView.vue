<template>
  <div class="q-pa-sm">
    <div class="row oa-section-title justify-evenly">
      <div class="col-1 text-h6 q-ml-md">
        <q-icon name="show_chart" />
      </div>
      <div class="col text-h6">Dose-Response View</div>
      <div class="text-h6">
        <slot name="actions" class="row">
          <q-btn v-if="horizontal" icon="view_stream" @click="changeOrientation" class="q-pa-xs" size="md" flat>
            <q-tooltip>Show vertical view</q-tooltip>
          </q-btn>
          <q-btn v-if="!horizontal" icon="view_column" @click="changeOrientation" class="q-pa-xs" size="md" flat>
            <q-tooltip>Show horizontal view</q-tooltip>
          </q-btn>
          <q-btn icon="close" @click="closeDRCView" class="q-pa-xs" size="md" flat/>
        </slot>
      </div>
    </div>
    <div class="oa-section-body" style="min-height: 30vh; max-height: 70vh; overflow: auto;">
      <DRCPlot :width="props.width" :height="props.height" :curves="props.curves"
               :update="Date.now()" :selectedWells="uiStore.selectedWells"
      @wellSelection="updateSelectedWells"/>
      <WellActionMenu touch-position context-menu @acceptWells="handleAcceptWells" @rejectWells="handleRejectWells"/>
    </div>
    <q-separator class="q-pt-md oa-section-body"/>
    <div class="oa-section-body">
      <DRCProperties :curves="props.curves"/>
    </div>
  </div>
</template>

<script setup>
import DRCProperties from "@/components/curve/DRCProperties.vue";
import DRCPlot from "@/components/curve/DRCPlot.vue";
import {ref} from "vue";
import {useUIStore} from "@/stores/ui";
import WellActionMenu from "@/components/well/WellActionMenu.vue";
import {usePlateStore} from "@/stores/plate";

const props = defineProps(['width', 'height', 'curves', 'update'])
const emits = defineEmits(['closeDRCView', 'changeOrientation', 'wellStatusChanged'])

const uiStore = useUIStore()
const closeDRCView = () => {
  uiStore.showDRCView = false
  uiStore.selectedDRCurves = []
}

const horizontal = ref(true)
const changeOrientation = () => {
  horizontal.value = !horizontal.value
  emits('changeOrientation')
}

const plateStore = usePlateStore()
const handleRejectWells = () => {
  console.log("Reject selected wells: " + JSON.stringify(uiStore.selectedWells))
  if (uiStore.selectedWells.length > 0) {
    plateStore.rejectWells(uiStore.selectedWells, 'REJECTED_PHAEDRA', 'Well rejection from chart!').then(() => {
      emits('wellStatusChanged')
    })
  }
}

const handleAcceptWells = () => {
  console.log("Accept selected wells: " + JSON.stringify(uiStore.selectedWells))
  if (uiStore.selectedWells.length > 0) {
    plateStore.acceptWells(uiStore.selectedWells).then(() => {
      emits('wellStatusChanged')
    })
  }
}

const updateSelectedWells = (selectedWells) => {
  console.log("Selected wells are: " + JSON.stringify(selectedWells))
  uiStore.selectedWells = selectedWells
}
</script>
