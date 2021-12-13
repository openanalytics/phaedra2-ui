<template>
  <div>
    <div class="oa-section-title2">
      <div class="row items-center q-pa-xs">
        <q-icon name="biotech" size="24px" class="q-mr-sm"/>
        Feature Selector
      </div>
    </div>
    <div class="q-pa-xs oa-section-body">
      <q-select
          outlined square dense
          v-model="selectedProtocol" :options="protocols"
          option-label="name" option-value="id"
          @update:model-value="onProtocolSelected"
          class="selectBox" label="Protocol">
        <template v-slot:prepend>
          <q-icon name="text_snippet"/>
        </template>
      </q-select>
      <q-select
          outlined square dense
          v-model="selectedFeature" :options="filteredFeatures"
          use-input input-debounce="0" @filter="applyFeatureFilter"
          option-label="name" option-value="id"
          @update:model-value="onFeatureSelected"
          class="selectBox" label="Feature">
        <template v-slot:prepend>
          <q-icon name="biotech"/>
        </template>
      </q-select>
      <div>
        <ColorLegend></ColorLegend>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selectBox {
  margin: 5px;
}
</style>

<script>
  import {ref, watch, toRefs} from 'vue'
  import {useStore} from 'vuex'

  import ColorLegend from "@/components/widgets/ColorLegend.vue"

  export default {
    props: {
      protocols: Array
    },
    components: {
      ColorLegend
    },
    emits: [
      'featureSelection'
    ],
    setup(props, context) {
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
        context.emit('featureSelection', value)
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

      return {
        selectedProtocol,
        onProtocolSelected,

        filteredFeatures,
        selectedFeature,
        onFeatureSelected,
        applyFeatureFilter
      }
    }
  }
</script>