import { ref } from 'vue'

const selectedRawFeature = ref(null)
const selectedCalcFeature = ref(null)

export function useSelectedFeature() {
  return {
    selectedRawFeature, selectedCalcFeature
  }
}
