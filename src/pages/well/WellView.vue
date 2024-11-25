<template>
  <q-breadcrumbs
    class="oa-breadcrumb"
    v-if="
      wellStore.well &&
      wellStore.well.plate &&
      wellStore.well.experiment &&
      wellStore.well.project
    "
  >
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el label="Projects" icon="list" :to="'/projects'" />
    <q-breadcrumbs-el
      :label="wellStore.well.project.name"
      icon="folder"
      :to="'/project/' + wellStore.well.project.id"
    />
    <q-breadcrumbs-el
      :label="wellStore.well.experiment.name"
      icon="science"
      :to="'/experiment/' + wellStore.well.experiment.id"
    />
    <q-breadcrumbs-el
      :label="wellStore.well.plate.barcode"
      icon="view_module"
      :to="'/plate/' + wellStore.well.plate.id"
    />/>
    <q-breadcrumbs-el :label="wellStore.well.pos" icon="square" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" v-if="plateStore.plate">
    <oa-section
      v-if="!wellStore.well"
      title="Loading well..."
      icon="crop_square"
    />
    <WellDetails
      v-else
      @wellStatusChanged="onWellStatusChanged"
      :well="wellStore.well"
      @updated="wellStore.reloadWell()"
    />
    <splitpanes class="default-theme">
      <pane style="background-color: #e6e6e6">
        <WellImageViewer2
          :well="wellStore.well"
          :wellImage="wellStore.wellImage"
          :loading="wellStore.loadingImage"
        />
      </pane>
      <pane style="background-color: #e6e6e6">
        <DRCView
          :curves="wellStore.wellDRCurve"
          :height="height"
          :width="width"
          :update="Date.now()"
        >
          <template v-slot:actions>
            <div />
          </template>
        </DRCView>
      </pane>
    </splitpanes>
  </q-page>

  <!--  <calculate-plate-dialog-->
  <!--    v-model:show="showCalculateDialog"-->
  <!--    :plates="[plateStore.plate]"-->
  <!--    :protocol-id="plateStore.activeResultSet?.protocolId"-->
  <!--  />-->
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { usePlateStore } from "@/stores/plate";
import { useWellStore } from "@/stores/well";
import WellDetails from "@/pages/well/WellDetails.vue";
import { Pane, Splitpanes } from "splitpanes";
import DRCView from "@/components/curve/DRCView.vue";
import WellImageViewer2 from "@/components/image/WellImageViewer2.vue";
import { useNotification } from "@/composable/notification";
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog.vue";
import { useLoadingHandler } from "../../composable/loadingHandler";

const plateStore = usePlateStore();
const wellStore = useWellStore();

const route = useRoute();

const height = ref(500);
const width = ref(500);

const loadingHandler = useLoadingHandler();

const fetchWell = async () => {
  const wellId = parseInt(route.params.wellId);
  await loadingHandler.handleLoadingDuring(wellStore.loadWell(wellId));
};
fetchWell();

const showCalculateDialog = ref(false);
const wellStatusNotification = useNotification();
const onWellStatusChanged = () => {
  wellStatusNotification.showInfo(
    "Well's status has changed! Recalculate plate?",
    () => {
      showCalculateDialog.value = true;
    },
    () => {}
  );
};
</script>

<style scoped></style>
