<template>
  <q-breadcrumbs class="oa-breadcrumb"
                 v-if="plateStore.plate && experimentStore.experiment && projectStore.project && wellStore.well">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Projects" icon="list" :to="'/projects'"/>
    <q-breadcrumbs-el :label="projectStore.project.name" icon="folder"
                      :to="'/project/' + projectStore.project.id"/>
    <q-breadcrumbs-el :label="experimentStore.experiment.name" icon="science"
                      :to="'/experiment/' + experimentStore.experiment.id"/>
    <q-breadcrumbs-el :label="plateStore.plate.barcode" icon="view_module"
                      :to="'/plate/' + plateStore.plate.id"/>/>
    <q-breadcrumbs-el :label="wellStore.well.pos" icon="square"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" v-if="plateStore.plate">
    <WellDetails @wellStatusChanged="onWellStatusChanged"/>
    <splitpanes class="default-theme">
      <pane style="background-color: #E6E6E6">
        <WellImageViewer2 :well="wellStore.well" :wellImage="wellStore.wellImage" :loading="wellStore.loadingImage"/>
      </pane>
      <pane style="background-color: #E6E6E6">
        <DRCView :curves="wellStore.wellDRCurve" :height="height" :width="width" :update="Date.now()">
          <template v-slot:actions>
            <div/>
          </template>
        </DRCView>
      </pane>
    </splitpanes>
  </q-page>

  <calculate-plate-dialog v-model:show="showCalculateDialog" :plates="[plateStore.plate]" :protocol-id="plateStore.activeResultSet?.protocolId"/>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {usePlateStore} from "@/stores/plate";
import {useExperimentStore} from "@/stores/experiment";
import {useProjectStore} from "@/stores/project";
import {useWellStore} from "@/stores/well";
import WellDetails from "@/pages/well/WellDetails.vue";
import {Pane, Splitpanes} from "splitpanes";
import DRCView from "@/components/curve/DRCView.vue";
import WellImageViewer2 from "@/components/image/WellImageViewer2.vue";
import {useNotification} from "@/composable/notification";
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog.vue";

const projectStore = useProjectStore()
const experimentStore = useExperimentStore()
const plateStore = usePlateStore()
const wellStore = useWellStore()

const route = useRoute()
const wellId = parseInt(route.params.wellId)

const height = ref(500)
const width = ref(500)

onMounted(() => {
  wellStore.loadWell(wellId)
})

const showCalculateDialog = ref(false);
const wellStatusNotification = useNotification()
const onWellStatusChanged = () => {
  wellStatusNotification.showInfo(
      "Well's status has changed! Recalculate plate?",
      () => { showCalculateDialog.value = true },
      () => { }
  )
}

</script>

<style scoped>

</style>
