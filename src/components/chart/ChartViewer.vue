 <template>
   <div class="row oa-section-title justify-evenly">
     <div class="col text-h6 q-pl-md">{{ uiStore.selectedPlate.barcode }}</div>
     <div class="text-h6">
       <slot name="actions" class="row">
         <q-btn v-if="horizontal" icon="view_stream" @click="changeOrientation" class="q-pa-xs" size="md" flat>
           <q-tooltip>Show vertical view</q-tooltip>
         </q-btn>
         <q-btn v-if="!horizontal" icon="view_column" @click="changeOrientation" class="q-pa-xs" size="md" flat>
           <q-tooltip>Show horizontal view</q-tooltip>
         </q-btn>
       </slot>
     </div>
   </div>
   <div ref="chartViewer">
     <q-tabs v-model="activeTab" inline-label dense align="left" no-caps class="oa-section-title">
       <q-tab v-for="chart in uiStore.chartViews" :key="chart.id" :name="chart.id">
         <div class="flex flex-center">
           <div class="q-pr-sm">{{ chart.label }}</div>
           <q-btn icon="close" size="xs" @click="closeTab(chart.id)" round flat/>
         </div>
       </q-tab>
     </q-tabs>
     <div class="oa-section-body">
       <q-tab-panels v-model="activeTab">
         <q-tab-panel v-for="chart in uiStore.chartViews" :key="chart.id" :name="chart.id">
           <Chart :chartId="chart.id" :update="update"/>
         </q-tab-panel>
       </q-tab-panels>
     </div>
   </div>
 </template>

<script setup>
import {computed, onUpdated, ref} from "vue"
import Chart from "./Chart"
import {useUIStore} from "@/stores/ui";

const uiStore = useUIStore()
const props = defineProps(['chartTemplate', 'update'])
const emits = defineEmits(['changeOrientation'])

const activeTab = ref(uiStore.chartViews[0].id)
const update = ref(Date.now())

onUpdated(() => handleChartResize())

const handleChartResize = () => {
  update.value = Date.now()
}

const closeTab = (chartId) => {
  uiStore.removeChartView(chartId)
  if (uiStore.chartViews.length > 0)
    activeTab.value = uiStore.chartViews[0].id
  update.value = Date.now()
}

const horizontal = ref(true)
const changeOrientation = () => {
  horizontal.value = !horizontal.value
  emits('changeOrientation')
}
</script>

<style>
</style>
