<template>
  <q-menu>
    <q-list dense>
      <q-item dense clickable @click="browseDoseResponseCurves">
        <q-item-section avatar>
          <q-icon name="show_chart"/>
        </q-item-section>
        <q-item-section>Browse Dose-Response Curves</q-item-section>
      </q-item>

      <q-separator/>

      <q-item dense clickable @click="openLinkPlateDialog">
        <q-item-section avatar>
          <q-icon name="playlist_add"/>
        </q-item-section>
        <q-item-section>Link Plate Template</q-item-section>
      </q-item>
      <q-item dense clickable @click="calculatePlates">
        <q-item-section avatar>
          <q-icon name="calculate"/>
        </q-item-section>
        <q-item-section>(Re)Calculate Plate(s)</q-item-section>
      </q-item>

      <q-separator/>

      <!-- Charts -->
      <q-item dense clickable>
        <q-item-section avatar>
          <q-icon name="insert_chart"/>
        </q-item-section>
        <q-item-section>Charts</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right"/>
        </q-item-section>
        <q-menu>
          <q-list>
            <q-item dense clickable @click="chart('plate_trend', props.experiment.id)" v-close-popup>
              <q-item-section avatar>
                <q-icon name="timeline"/>
              </q-item-section>
              <q-item-section>Plate Trend</q-item-section>
            </q-item>
            <q-item dense clickable @click="chart('box', props.experiment.id)" v-close-popup>
              <q-item-section avatar>
                <q-icon name="candlestick_chart"/>
              </q-item-section>
              <q-item-section>Plate Boxplot</q-item-section>
            </q-item>

            <q-separator/>

            <q-item dense clickable @click="chart('scatter', props.experiment.id)" v-close-popup>
              <q-item-section avatar>
                <q-icon name="scatter_plot"/>
              </q-item-section>
              <q-item-section>Well 2D Scatter Plot</q-item-section>
            </q-item>
            <q-item dense clickable @click="chart('histogram', props.experiment.id)">
              <q-item-section avatar>
                <q-icon name="bar_chart"/>
              </q-item-section>
              <q-item-section>Well 1D Histogram</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>

      <q-separator/>

      <q-item dense clickable>
        <q-item-section avatar>
          <q-icon name="save_alt"/>
        </q-item-section>
        <q-item-section>Export</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right"/>
        </q-item-section>
        <q-menu>
          <q-list>
            <q-item dense clickable >
              <q-item-section avatar>
                <q-icon name="save_alt"/>
              </q-item-section>
              <q-item-section>Export Plate List</q-item-section>
            </q-item>
            <q-item dense clickable >
              <q-item-section avatar>
                <q-icon name="save_alt"/>
              </q-item-section>
              <q-item-section>Export Well Data</q-item-section>
            </q-item>
            <q-item dense clickable >
              <q-item-section avatar>
                <q-icon name="save_alt"/>
              </q-item-section>
              <q-item-section>Export Subwell Data</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>

      <q-separator/>

      <q-item v-if="isOpen" dense clickable @click="handleCloseExperiment">
        <q-item-section avatar>
          <q-icon name="lock"/>
        </q-item-section>
        <q-item-section>Close Experiment</q-item-section>
      </q-item>
      <q-item v-if="!isOpen" dense clickable @click="handleOpenExperiment">
        <q-item-section avatar>
          <q-icon name="lock_open"/>
        </q-item-section>
        <q-item-section>Open Experiment</q-item-section>
      </q-item>
      <q-item dense clickable @click="openDeleteDialog">
        <q-item-section avatar>
          <q-icon name="delete"/>
        </q-item-section>
        <q-item-section>Delete Experiment</q-item-section>
      </q-item>
    </q-list>

    <DeleteDialog v-if="props.experiment" :id="props.experiment.id" :name="props.experiment.name" :objectClass="'experiment'"
                  v-model:show="showDeleteDialog" @onDeleted="onDeleted"/>
    <LinkPlateDialog v-model:show="showLinkPlateDialog" :experiment="props.experiment"/>
  </q-menu>
</template>

<script setup>
import DeleteDialog from "@/components/widgets/DeleteDialog";
import {useProjectStore} from "@/stores/project";
import {computed, ref} from "vue";
import LinkPlateDialog from "@/components/plate/LinkPlateDialog.vue";

const props = defineProps(['experiment'])
const projectStore = useProjectStore()

const isOpen = computed(() => props.experiment.status === 'OPEN' ? true : false )
const showDeleteDialog = ref(false);
const showLinkPlateDialog = ref(false)

const openDeleteDialog = () => {
  showDeleteDialog.value = true;
}

const openLinkPlateDialog = () => {
  showLinkPlateDialog.value = true
}

const handleCloseExperiment = () => {
  console.log("Close experiment " + props.experiment.name)
  projectStore.closeExperiment(props.experiment.id)
}

const handleOpenExperiment = () => {
  console.log("Open experiment " + props.experiment.name)
  projectStore.openExperiment(props.experiment.id)
}

const onDeleted = () => {
  projectStore.deleteExperiment(props.experiment.id)
}

const linkPlateLayouts = () => {
  console.log("Link plate template to all plate within experiment " + props.experiment.id)
}

//TODO
const calculatePlates = () => {
}

//TODO
const browseDoseResponseCurves = () => {

}

//TODO
const chart = (type, experimentId) => {
  // store.dispatch('ui/addChartView', {'type': type, "experimentId": experimentId})
}
</script>
