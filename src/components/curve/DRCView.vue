<template>
  <div class="q-pa-sm">
    <div class="row oa-section-title justify-evenly">
      <div class="col-1 text-h6 q-ml-md">
        <q-icon name="show_chart" />
      </div>
      <div class="col text-h6">Dose-Response View</div>
      <div class="text-h6">
        <actions>
          <slot name="actions" class="row">
            <q-btn icon="close" @click="closeDRCView" class="q-pa-xs" size="md" flat/>
          </slot>
        </actions>
      </div>
    </div>
    <div class="oa-section-body">
      <DRCPlot :width="props.width" :height="props.height" :curves="props.curves" :update="props.update"/>
    </div>
    <q-separator class="q-pt-md oa-section-body"/>
    <div class="oa-section-body">
      <DRCProperties :curves="props.curves"/>
    </div>
  </div>
</template>

<script setup>
import DRCProperties from "@/components/curve/DRCProperties.vue";
import DRCPlot from "@/components/curve/DRCPlot.vue";
import {onUpdated, ref} from "vue";

const props = defineProps(['width', 'height', 'curves', 'update'])
const emits = defineEmits(['closeDRCView'])

const closeDRCView = () => {
  console.log("Close DRC View!")
  emits("closeDRCView")
}
</script>

<style scoped>
</style>
