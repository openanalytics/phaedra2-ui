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
        <q-checkbox v-if="tab==='overview'" v-model="skipped" label="Skip Wells" @click="updateWells('skipped')"/>
        <q-select v-if="tab==='well-type'" v-model="selectedType" :label="previousType" :options="wellTypes" @update:model-value="updateWells('well-type')"></q-select>
        <q-input v-if="tab==='substance'" v-model="name" square autofocus label="Substance Name" @change="updateWells('substance_name')"></q-input>
        <q-input v-if="tab==='substance'" v-model="substanceType" square autofocus label="Substance Type" @change="updateWells('substance_type')"></q-input>
        <q-input v-if="tab==='concentration'" v-model="concentration" square autofocus label="Concentration" @change="updateWells('concentration')"></q-input>
        <router-link :to="'/template/' + templateId" class="nav-link">
          <q-btn flat icon="check" label="Apply" @click="updateWells"></q-btn>
        </router-link>
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

export default {

  props: {
    wells: Array,
    plateId: Number,
    tab: String
  },
  methods: {
    updateWells(field) {
      //Nested deep copy
      const copy = JSON.parse(JSON.stringify(this.wells));
      const list = []
      copy.forEach(well => {
        switch (field) {
          case "skipped": well.skipped = this.skipped;break;
          case "well-type": well.wellType = this.selectedType;break;
          case "substance_name": well.substanceName = this.name;break;
          case "substance_type": well.substanceType = this.substanceType;break;
          case "concentration": well.concentration = this.concentration;
        }
        list.push(well)
      })
      this.$store.dispatch('templates/updateWellTemplates', list)
    }
  },
  setup(props) {

    const wellTypes = ["EMPTY", "LC", "HC", "SAMPLE"]
    const selectedType = ref(null)
    const skipped = ref(true)

    //Give previous wellType
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    const getWellType = function () {
      const countTypes = props.wells.map(w => w.wellType).filter(onlyUnique)
      console.log(props.wells)
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
      wellTypes,
      selectedType,
      previousType,
      skipped,
      templateId
    }
  },
  data() {
    return {
      name: ref(null),
      substanceType: ref(null),
      concentration: ref(null)
    }
  }
}
</script>
