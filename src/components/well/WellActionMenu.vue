<template>
  <q-menu v-if="well && well != undefined">
    <q-list dense>
      <menu-item
        icon="info"
        color="primary"
        label="Well Details"
        @click="openWellDetails"
      />
      <q-separator />
      <menu-item
        icon="image"
        color="primary"
        label="Show Well Image"
        @click="showWellImage"
        v-close-popup
      />
      <menu-item
        icon="show_chart"
        color="primary"
        label="Show Dose-Response Curve"
        @click="showDoseResponseCurve"
        v-close-popup
      />
      <q-separator />
      <menu-item
        icon="check_circle"
        color="positive"
        label="Accept Well(s)"
        @click="acceptWells"
        v-close-popup
      />
      <menu-item
        icon="cancel"
        color="negative"
        label="Reject Well(s)"
        @click="rejectWells"
        v-close-popup
      />
    </q-list>
  </q-menu>
</template>

<script setup>
import MenuItem from "@/components/widgets/MenuItem.vue";
import { useUIStore } from "@/stores/ui";
import { useRoute, useRouter } from "vue-router";

const props = defineProps(["well"]);
const emits = defineEmits([
  "acceptWells",
  "rejectWells",
  "showDoseResponseCurve",
  "open",
]);

const uiStore = useUIStore();

const router = useRouter();
const route = useRoute();

const showWellImage = () => {
  uiStore.showImageView = true;
};

const rejectWells = () => {
  emits("rejectWells");
};

const acceptWells = () => {
  emits("acceptWells");
};

const showDoseResponseCurve = () => {
  emits("showDoseResponseCurve");
  uiStore.showDRCView = true;
};
const openWellDetails = () => {
  emits("open", "well-details-pane");
};
</script>
