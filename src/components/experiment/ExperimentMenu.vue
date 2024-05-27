<template>
  <q-menu>
    <q-list dense>
      <div v-if="isOpen">
        <menu-item icon="playlist_add" label="Set Plate Layout" @click="openLinkPlateDialog"/>
        <menu-item icon="calculate" label="(Re)Calculate Plate(s)" @click="calculatePlates"/>
      </div>

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
            <menu-item icon="timeline" label="Plate Trend"
                       @click="showPlateTrendChart" v-close-popup/>
<!--            <menu-item icon="candlestick_chart" label="Plate Boxplot"-->
<!--                       @click="chart('box', props.experiment.id)" v-close-popup/>-->

<!--            <q-separator/>-->

<!--            <menu-item icon="scatter_plot" label="Well 2D Scatter Plot"-->
<!--                       @click="chart('scatter', props.experiment.id)" v-close-popup/>-->
<!--            <menu-item icon="bar_chart" label="Well 1D Histogram"-->
<!--                       @click="chart('histogram', props.experiment.id)" v-close-popup/>-->
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
<!--            <menu-item icon="save_alt" label="Export Plate List" @click="showExportPlateListDialog = true"/>-->
            <menu-item icon="save_alt" label="Export Well Data" @click="exportPlateWellData" v-close-popup/>
            <menu-item icon="save_alt" label="Export Sub-Well Data" @click="exportPlateSubWellData" v-close-popup/>
          </q-list>
        </q-menu>
      </q-item>

      <q-separator/>

      <menu-item v-if="isOpen" icon="lock" label="Close Experiment" @click="handleCloseExperiment" v-close-popup/>
      <menu-item v-if="!isOpen" icon="lock_open" label="Open Experiment" @click="handleOpenExperiment" v-close-popup/>
      <menu-item v-if="isOpen" icon="delete" label="Delete Experiment" @click="openDeleteDialog" v-close-popup/>
    </q-list>

    <delete-dialog v-if="isOpen" :id="props.experiment.id" :name="props.experiment.name" :objectClass="'experiment'"
                  v-model:show="showDeleteDialog" @onDeleted="onDeleted"/>
    <link-plate-layout-dialog v-if="isOpen" v-model:show="showLinkPlateDialog" :plates="plates"/>
<!--    <ExportPlateListDialog v-model:show="showExportPlateListDialog" :experiments="[props.experiment]"/>-->
  </q-menu>
</template>

<script setup>
import DeleteDialog from "@/components/widgets/DeleteDialog";
import {useProjectStore} from "@/stores/project";
import {computed, ref} from "vue";
import LinkPlateLayoutDialog from "@/components/plate/LinkPlateLayoutDialog.vue";
import MenuItem from "@/components/widgets/MenuItem.vue";
import {useQuasar} from "quasar";
import projectsGraphQlAPI from "@/api/graphql/projects";
// import ExportPlateListDialog from "@/components/experiment/ExportPlateListDialog.vue";

const $q = useQuasar();
const props = defineProps(['experiment'])
const projectStore = useProjectStore()

const isOpen = computed(() => props.experiment.status === 'OPEN' ? true : false )
const showDeleteDialog = ref(false);
const showLinkPlateDialog = ref(false)

const plates = ref([])

// const showExportPlateListDialog = ref(false)

const openDeleteDialog = () => {
  showDeleteDialog.value = true;
}

const openLinkPlateDialog = () =>  {
  const {onResult, onError} = projectsGraphQlAPI.experimentById(props.experiment.id)
  onResult(({data}) => {
    plates.value = [...data.plates]
  })

  onError((error) => {
    console.error(error)
  })

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

const showUnderConstructionMessage = () => {
  $q.notify({
    type: 'warning',
    message: 'Feature is under construction!',
    position: "top",
    actions: [
      { icon: 'close', color: "secondary", round: true }
    ]
  })
}

const linkPlateLayouts = showUnderConstructionMessage;
const calculatePlates = showUnderConstructionMessage;
const browseDoseResponseCurves = showUnderConstructionMessage;
const showPlateTrendChart = showUnderConstructionMessage;
const exportPlateWellData = showUnderConstructionMessage;
const exportPlateSubWellData = showUnderConstructionMessage;
</script>
