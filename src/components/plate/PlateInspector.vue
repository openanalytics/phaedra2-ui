<template>
  <div class="q-pa-md">
    <oa-section-header :title="'Plate Inspector: ' + props.plate" icon="info"/>
    <div class="col q-pa-md oa-section-body">
      Under construction!!!
      <br/>
      This information about the plate will be shown here!!!

      <div class="row justify-end">
        <q-btn flat label="Cancel" color="primary" @click="closePlateInspector()"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import OaSectionHeader from "@/components/widgets/OaSectionHeader"

const props = defineProps(['plate'])
const emit = defineEmits(['hidePlateInspector'])

const closePlateInspector = () => {
  emit('hidePlateInspector')
}
</script>

<style scoped>

</style>
