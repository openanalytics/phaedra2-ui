<template>
  <div class="q-pa-xs">
    <div class="oa-section-title2">
      <div class="row items-center">
        <q-icon name="edit" size="24px" class="q-mr-sm"/>
        Well Editor
      </div>
    </div>
    <div class="q-pa-xs oa-section-body">
      <div class="col-12 q-mb-sm">
        <q-checkbox v-if="tab==='overview'" v-model="skipped" label="Skip Wells" @click="updateWells('skipped', skipped)"/>
        <q-select dense v-if="tab==='well-type'" v-model="selectedType" :label="previousType" :options="wellTypes" @update:model-value="updateWells('wellType', selectedType)"></q-select>
        <q-input dense v-if="tab==='substance'" v-model="substanceType" square autofocus label="Substance Type" @change="updateWells('substanceType', substanceType)"></q-input>
        <q-input dense v-if="tab==='substance'" v-model="name" square autofocus label="Substance Name" @change="updateWells('substanceName', name)"></q-input>
        <q-input dense v-if="tab==='substance'" v-model="concentration" square autofocus label="Concentration" @change="updateWells('concentration', concentration)"></q-input>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .legendRow {
    width: 200px;
  }
</style>

<script setup>
import {computed, ref} from "vue";
import {useTemplateStore } from "@/stores/template";
import {useUIStore} from "@/stores/ui";
import {useStore} from 'vuex'

const props = defineProps(['wells', 'plateId', 'tab'])
const store = useStore()
const templateStore = useTemplateStore()
const uiStore = useUIStore()

const wellTypes = ["EMPTY", "SAMPLE", "LC", "HC", "NC", "PC"]
const selectedType = ref(null)
const skipped = ref(false)
const name = ref(null)
const substanceType = ref(null)
const concentration = ref(null)

if (uiStore.selectedWells && uiStore.selectedWells.length > 0)
  skipped.value = uiStore.selectedWells[0].skipped
else
  skipped.value = false

const updateWells = (field, newValue) => {
  console.log(field + ": " + newValue)
  const selectedWells = JSON.parse(JSON.stringify(props.wells));
  templateStore.updateTemplateWells(selectedWells, field, newValue)
  // store.dispatch('templates/updateWellTemplates', {wells: selectedWells, field: field, entry: newValue})
}

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

const getWellType = () => {
  const countTypes = props.wells.map(w => w.wellType).filter(onlyUnique)
  return (countTypes?.length === 1) ? props.wells[0].wellType : ""
}

const previousType = computed(() => {
  if (props.wells.length < 1) return "Well Type"
  return getWellType(props.wells)
})

</script>
