<template>
  <div class="q-pa-xs">
    <div class="oa-section-title2">
      <div class="row items-center">
        <q-icon name="view_module" size="24px" class="q-mr-sm"/>
        Well Editor
      </div>
    </div>
    <div class="q-pa-xs oa-section-body">
      <div class="col-12 q-mb-sm">
        <q-checkbox v-model="skipped" label="Skip Wells"/>
        <q-select v-model="selectedType" :label="previousType" :options="wellTypes"></q-select>
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
    plateId: Number
  },
  methods: {
    updateWells() {
      //Nested deep copy
      const copy = JSON.parse(JSON.stringify(this.wells));
      copy.forEach((well, idx, arr) => {
        if (this.selectedType) {
          well.wellType = this.selectedType
        }
        well.skipped = this.skipped

        //Check if it is the last well to reload state
        if (idx === arr.length - 1) {
          this.$store.dispatch('templates/updateWellTemplate', {well: well, last: true})
        } else {
          this.$store.dispatch('templates/updateWellTemplate', {well: well, last: false})
        }
      })
    }
  },
  setup(props) {

    const wellTypes = ["EMPTY", "LC", "HC", "SAMPLE"]
    const selectedType = ref(null)
    const skipped = ref(false)

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
  }
}
</script>
