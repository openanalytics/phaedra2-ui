<template>
  <div class="col justify-center gridContainer">
    <div class="featureSelector row">
      <q-select class="col-5" v-model="selectedProtocol" :options="protocols" option-label="name" option-value="id"
                @update:model-value="onProtocolSelected" label="Protocol" dense>
      </q-select>
      <div class="col-1"/>
      <q-select class="col-6" v-model="selectedFeature" :options="filteredFeatures" input-debounce="0"
                @filter="applyFeatureFilter"
                option-label="name" option-value="id" @update:model-value="onFeatureSelected"
                label="Feature" dense>
      </q-select>
    </div>
  </div>
</template>

<style scoped>
.selectBox {
  margin: 5px;
}
.gridContainer {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
}
.featureSelector {
  grid-column: v-bind(featureSelectorStartColumn) / v-bind(featureSelectorEndColumn + 1);
}
</style>

<script setup>
import {ref, watch, toRefs, computed} from 'vue'
  import {useStore} from 'vuex'
  import ColorLegend from "@/components/widgets/ColorLegend.vue"

  // export default {
  const props = defineProps(['protocols', 'plateResults', 'plate'])

  const gridColumnStyle = computed(() => { return "repeat(" + (props.plate.columns + 1) + ", 1fr)" });
  const featureSelectorStartColumn = ref(2);
  const featureSelectorEndColumn = ref(props.plate.columns + 1)

  const emits = defineEmits(['featureSelection'])
      const store = useStore()

      watch(toRefs(props).protocols, () => {
        selectedProtocol.value = props.protocols[0]
        onProtocolSelected()
      })

      // Protocol selection
      const selectedProtocol = ref(null)
      const onProtocolSelected = () => {
        if (selectedProtocol.value) {
          store.dispatch('features/loadByProtocolId', selectedProtocol.value.id).then(() => {
            allFeatures.value = store.getters['features/getByProtocolId'](selectedProtocol.value.id)
            if (allFeatures.value && allFeatures.value.length > 0) {
              selectedFeature.value = allFeatures.value[0]
              onFeatureSelected(selectedFeature.value)
            }
          })
        }
      }

      // Feature selection
      const allFeatures = ref([])
      const filteredFeatures = ref(allFeatures.value)
      const selectedFeature = ref(null)
      const onFeatureSelected = (value) => {
        emits('featureSelection', value)
        calcRangeValues()
      }
      const applyFeatureFilter = (val, update) => {
        if (val === '') {
          update(() => {
            filteredFeatures.value = allFeatures.value
          })
          return
        }
        update(() => {
          filteredFeatures.value = allFeatures.value.filter(v => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
        })
      }

      const rangeValues = ref(null)
      const calcRangeValues = () => {
        if (!selectedFeature.value) rangeValues.value = { min: 0, mean: 50, max: 100 }
        if (Array.isArray(props.plateResults)) {
          const result = props.plateResults.filter(rs => (rs.featureId == selectedFeature.value.id));
          if (result.length > 0) {
            const min = Math.min(...result[0].values.filter(v => !isNaN(v)));
            const mean = result[0].values.reduce((x, y) => x + y, 0) / result[0].values.length;
            const max = Math.max(...result[0].values.filter(v => !isNaN(v)));
            rangeValues.value = {min: min, mean: mean, max: max}
          }
        } else {
          rangeValues.value = null
        }
      }
</script>
