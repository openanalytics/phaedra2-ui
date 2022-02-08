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
        <q-select v-if="tab==='well-type'" v-model="selectedType" :label="previousType" :options="wellTypes" @update:model-value="updateWells('wellType', selectedType)"></q-select>
        <q-input v-if="tab==='substance'" v-model="name" square autofocus label="Substance Name" @change="updateWells('substanceName', name)"></q-input>
        <q-input v-if="tab==='substance'" v-model="substanceType" square autofocus label="Substance Type" @change="updateWells('substanceType', substanceType)"></q-input>
        <q-input v-if="tab==='substance'" v-model="concentration" square autofocus label="Concentration" @change="updateWells('concentration', concentration)"></q-input>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .legendRow {
    width: 200px;
  }
</style>

<script>
  import {computed, ref} from "vue";
  import {useStore} from 'vuex'

  export default {
    props: {
      wells: Array,
      plateId: Number,
      tab: String
    },
    setup(props) {
      const store = useStore()

      const wellTypes = ["EMPTY", "LC", "HC", "SAMPLE"]
      const selectedType = ref(null)
      const skipped = ref(true)

      const updateWells = function(field, newValue) {
        const selectedWells = JSON.parse(JSON.stringify(props.wells));
        store.dispatch('templates/updateWellTemplates', {wells: selectedWells, field: field, entry: newValue});
      }

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      const getWellType = function () {
        const countTypes = props.wells.map(w => w.wellType).filter(onlyUnique)
        return (countTypes?.length === 1) ? props.wells[0].wellType : ""
      }

      const previousType = computed(() => {
        if (props.wells.length < 1) return ""
        return getWellType(props.wells)
      })

      const templateId = computed(() => {
        return props.plateId
      })

      return {
        updateWells,
        wellTypes,
        selectedType,
        previousType,
        skipped,
        templateId,
        name: ref(null),
        substanceType: ref(null),
        concentration: ref(null)
      }
    }
  }
</script>
