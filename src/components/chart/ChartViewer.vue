 <template>
     <Splitpanes @resized="handleChartResize" ref="splitPane" class="q-pb-sm">
       <Chart v-for="chart in charts" :key="chart.id" :chartId="chart.id" :update="update"/>
     </Splitpanes>
</template>

<script setup>
import {useStore} from 'vuex'
import {computed, ref} from "vue"
import {Splitpanes} from 'splitpanes'
import Chart from "./Chart"

const store = useStore();
const props = defineProps(['chartTemplate'])

const charts = computed(() => store.getters['ui/getChartViews']())
const update = ref(Date.now())
const splitPane = ref()

const handleChartResize = (event) => {
  const maxWidth = splitPane.value.$el.clientWidth
  const chartWidths = event.map(e => maxWidth * (e.size / 100))

  store.dispatch('ui/updateChartViewWidth', chartWidths)
  update.value = Date.now()
}
</script>

<style>
</style>
