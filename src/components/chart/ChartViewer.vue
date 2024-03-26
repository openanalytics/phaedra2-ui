 <template>
   <div ref="chartViewer">
     <q-tabs v-model="activeTab" inline-label dense align="left" no-caps class="oa-section-title">
       <q-tab v-for="(tab, idx) in tabs" :key="idx" :name="tab.name">
         <div class="flex flex-center">
           <div class="q-pr-sm">{{ tab.label }}</div>
           <q-btn icon="close" size="xs" @click="closeTab(tab.chartId)" round flat/>
         </div>
       </q-tab>
     </q-tabs>
     <q-tab-panels v-model="activeTab">
       <q-tab-panel v-for="(tab, idx) in tabs" :key="idx" :name="tab.name">
         <Chart :chartId="tab.chartId" :update="update"/>
       </q-tab-panel>
     </q-tab-panels>
   </div>
</template>

<script setup>
import {computed, onUpdated, ref} from "vue"
import Chart from "./Chart"
import {useUIStore} from "@/stores/ui";

const uiStore = useUIStore()
const props = defineProps(['chartTemplate', 'update'])
const chartViewer = ref()

const activeTab = ref(uiStore.chartViews[0].type)
const tabs = computed(() => uiStore.chartViews.map(chartView => {return {name: chartView.type, label: chartView.label, chartId: chartView.id}}))
const update = ref(Date.now())

onUpdated(() => handleChartResize())

const handleChartResize = () => {
  update.value = Date.now()
}

const closeTab = (chartId) => {
  uiStore.removeChartView(chartId)
  update.value = Date.now()
}
</script>

<style>
</style>
