<template>
  <div class="col justify-center">
    <div class="row">
      <q-select class="col-5"
                v-model="selectedProtocol"
                :options="protocols"
                option-value="id"
                option-label="name"
                label="Protocol"
                @update:model-value="onProtocolSelected"
                dense>
      </q-select>
      <div class="col-1"/>
      <q-select class="col-6"
                v-model="selectedFeature"
                :options="selectedProtocol?.features"
                input-debounce="0"
                option-value="id"
                option-label="name"
                label="Feature"
                @update:model-value="onFeatureSelected"
                dense>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useRoute} from "vue-router";

const route = useRoute();
const props = defineProps(['protocols'])
const protocols = computed(() => props.protocols)

const emits = defineEmits(['featureSelection'])

const selectedFeature = ref(null)
const selectedProtocol = ref(protocols.value[0])

watch(protocols, () => {
  selectedProtocol.value = protocols.value[0]
  onProtocolSelected()
})

// Protocol selection
const onProtocolSelected = () => {
  if (selectedProtocol.value) {
    selectedFeature.value = selectedProtocol.value.features[0]
    onFeatureSelected(selectedFeature.value)
  }
}

// Feature selection
const onFeatureSelected = (selectedFeature) => {
  emits('featureSelection', selectedProtocol.value, selectedFeature)
}
</script>
