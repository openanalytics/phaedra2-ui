import { ref } from "vue";
import { defineStore } from "pinia";

export const useSelectionStore = defineStore("selection", () => {
  const experiments = ref([]);

  return { experiments };
});
