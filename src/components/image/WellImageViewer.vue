<template>
  <div class="">
    <div id="container">
      <div id="control-panel" class="row">
        <q-badge color="blue" rounded style="height: 24px">{{ selectedWellInfo }}</q-badge>
        <q-btn color="blue" size="xs" round class="on-right" icon="zoom_out" @click="zoomOut">
          <q-tooltip>Zoom Out</q-tooltip>
        </q-btn>
        <q-badge color="blue" rounded class="q-mx-xs" style="height: 24px">{{ (uiStore.imageRenderSettings.scale*100) + "%" }}</q-badge>
        <q-btn color="blue" size="xs" round icon="zoom_in" @click="zoomIn">
          <q-tooltip>Zoom In</q-tooltip>
        </q-btn>
        <q-badge color="blue" rounded class="on-right" style="height: 24px">
          <q-btn-dropdown dense unelevated size="sm" icon="palette">
            <q-list dense>
              <q-item clickable v-close-popup v-for="cfg in availableRenderConfigs" :key="cfg.id">
                <q-item-section avatar>
                  <q-icon color="primary" name="check" v-if="uiStore.imageRenderSettings.baseRenderConfigId == cfg.id" />
                </q-item-section>
                <q-item-section>
                  <q-item-label @click="selectRenderConfig(cfg)">{{cfg.name}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-badge>
        <q-btn color="blue" size="xs" round icon="settings" class="q-ml-sm" @click="showRenderConfigDialog = true" />
      </div>
      <div class="image-container" style="width: 100%; max-height: 70vh; overflow: auto;">
        <img :src="wellImage" />
      </div>
      <div class="absolute-center" v-if="loading">
        <q-spinner-pie color="info" size="7em"/>
      </div>
      <div class="absolute-center" v-if="selectedWell && errorMessage">
        <q-badge color="negative">{{ errorMessage }}</q-badge>
      </div>
    </div>
    <RenderConfigDialog v-model="showRenderConfigDialog" />
  </div>
</template>

<style scoped>
.canvas-container {
  overflow: scroll;
  max-height: v-bind(maxCanvasHeight);
}

#container {
  position: relative;
}

#control-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 99;
}
</style>

<script setup>
import {computed, ref, watch, onMounted} from 'vue'
import {useMeasurementStore} from "@/stores/measurement";
import {useUIStore} from "@/stores/ui";
import WellUtils from "@/lib/WellUtils.js";
import RenderConfigDialog from './RenderConfigDialog.vue';

const measurementStore = useMeasurementStore()
const uiStore = useUIStore();
const loading = ref(false);
const errorMessage = ref(null);
const scaleLimits = [0.125, 8];

const availableRenderConfigs = computed(() => [...measurementStore.renderConfigs].sort((c1, c2) => c1.name.localeCompare(c2.name)));
const showRenderConfigDialog = ref(false);

onMounted(() => {
  measurementStore.loadAllRenderConfigs()
})

const selectedWell = computed(() => {
  let wells = uiStore.selectedWells;
  if (wells && wells.length > 0) return wells[0];
  return null;
})

const selectedWellInfo = computed(() => {
  let info = '';
  if (selectedWell.value?.row && selectedWell.value?.column) {
    info += WellUtils.getWellCoordinate(selectedWell.value.row, selectedWell.value.column);
  } else if (selectedWell.value?.nr && selectedWell.value?.measId) {
    // let meas = store.getters['measurements/getById'](selectedWell.value.measId);
    let pos = WellUtils.getWellPosition(selectedWell.value.nr, measurementStore.measurement.columns);
    info += WellUtils.getWellCoordinate(pos[0], pos[1]);
  } else {
    return "No Well Selected";
  }
  return info;
})

const wellImage = ref(null);
const reloadImage = async () => {
  loading.value = true;
  errorMessage.value = null;

  try {
    await measurementStore.loadMeasImage({
      wellNr: selectedWell.value?.nr,
      renderConfigId: uiStore.imageRenderSettings.baseRenderConfigId,
      channels: uiStore.imageRenderSettings.channels.filter(ch => ch.enabled),
      scale: uiStore.imageRenderSettings.scale
    });
  } catch (error) {
    if (error?.response?.status == 404) {
      errorMessage.value = "No image available for this well";
    } else {
      errorMessage.value = error;
    }
  } finally {
    loading.value = false;
    wellImage.value = measurementStore.getWellImage(selectedWell.value?.nr);
  }
}
watch(selectedWell, reloadImage);
uiStore.$subscribe((mutation) => {
  if (mutation.events?.key == "imageRenderSettings" || mutation.events?.key == "enabled") reloadImage();
});

const selectRenderConfig = (cfg) => {
  const settings = {
    baseRenderConfigId: cfg.id,
    channels: cfg.config.channelConfigs.map(ch => { return { ...ch, enabled: true }})
  };
  uiStore.updateImageRenderSettings(settings);
}

const zoomIn = () => {
  const newScale = uiStore.imageRenderSettings.scale * 2;
  if (newScale <= scaleLimits[1]) {
    uiStore.updateImageRenderSettings({scale: newScale});
  }
}
const zoomOut = () => {
  const newScale = uiStore.imageRenderSettings.scale / 2;
  if (newScale >= scaleLimits[0]) {
    uiStore.updateImageRenderSettings({scale: newScale});
  }
}
</script>
