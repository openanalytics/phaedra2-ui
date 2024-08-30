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
    <well-details/>
    <splitpanes class="default-theme">
      <pane class="q-pa-sm" style="background-color: #E6E6E6">
        <WellImageViewer2 :well="wellStore.well" :wellImage="wellStore.wellImage" :loading="wellStore.loadingImage"/>
      </pane>
      <pane v-if="wellStore.wellDRCurve" class="q-pa-sm" style="background-color: #E6E6E6">
        <DRCView :curves="wellStore.wellDRCurve" :height="height" :width="width" :update="Date.now()"/>
      </pane>
    </splitpanes>
  </q-page>


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
import {useUIStore} from "@/stores/ui";

const projectStore = useProjectStore()
const experimentStore = useExperimentStore()
const plateStore = usePlateStore()
const wellStore = useWellStore()
const uiStore = useUIStore()

const route = useRoute()
const wellId = parseInt(route.params.wellId)

const height = ref(400)
const width = ref(500)

onMounted(() => {
  wellStore.loadWell(wellId)
})

</script>

<style scoped>

</style>
