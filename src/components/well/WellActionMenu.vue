<template>
  <q-menu>
    <q-list dense>
      <menu-item icon="image" color="primary" label="Show Well Image" @click="showWellImage"/>
      <menu-item icon="show_chart" color="primary" label="Show Dose-Response Curve" @click="showDoseResponseCurve"/>
      <q-separator/>
      <menu-item icon="check_circle" color="positive" label="Accept Well(s)" @click="acceptWells" v-close-popup/>
      <menu-item icon="cancel" color="negative" label="Reject Well(s)" @click="rejectWells" v-close-popup/>
    </q-list>
  </q-menu>
</template>

<script setup>
import MenuItem from "@/components/widgets/MenuItem.vue";
import {useUIStore} from "@/stores/ui";

const emits = defineEmits(['acceptWells', 'rejectWells', 'showDoseResponseCurve'])

const uiStore = useUIStore()

const showWellImage = () => {
  uiStore.showImageView = true
}

const rejectWells = () => {
  emits('rejectWells')
}

const acceptWells = () => {
  emits('acceptWells')
}

const showDoseResponseCurve = () => {
  emits('showDoseResponseCurve')
  uiStore.showDRCView = true
}

</script>
