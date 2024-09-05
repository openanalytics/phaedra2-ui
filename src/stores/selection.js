import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useSelectionStore = defineStore("selection", () => {
  const localProjects = ref([]);
  const localExperiments = ref([]);
  const localPlates = ref([]);
  const localWells = ref([]);

  const projectsIds = computed(() => projects.value.map((item) => item.id));
  const experimentsIds = computed(() =>
    experiments.value.map((item) => item.id)
  );
  const platesIds = computed(() => plates.value.map((item) => item.id));

  function setProjectsAndRemoveChildren(newVal) {
    projects.value = newVal;
    localExperiments.value = [];
    localPlates.value = [];
    localWells.value = [];
  }

  function setExperimentsAndRemoveChildren(newVal) {
    experiments.value = newVal;
    localPlates.value = [];
    localWells.value = [];
  }

  function setPlatesAndRemoveChildren(newVal) {
    plates.value = newVal;
    localWells.value = [];
  }

  const projects = computed({
    get: () => localProjects.value,
    set: (newVal) => {
      localProjects.value = newVal;
    },
  });

  const experiments = computed({
    get: () => localExperiments.value,
    set: async (newVal) => {
      const changes = detectChanges(
        localExperiments.value,
        newVal,
        "projectId"
      );
      if (changes.added.length || changes.removed.length) {
        let projectsToAdd = changes.added.filter(
          (id) => !projectsIds.value.includes(id)
        );

        let reducedProjects = localProjects.value.filter(
          (item) => !changes.removed.includes(item.id)
        );

        // let fetchedProjects = fetchProjectsRequest(projectsToAdd)
        // projects.value = [...reducedProjects, ...newProjects];
      }
      localExperiments.value = newVal;
    },
  });

  const plates = computed({
    get: () => localPlates.value,
    set: (newVal) => {
      const changes = detectChanges(localPlates.value, newVal, "experimentId");
      if (changes.added.length || changes.removed.length) {
        let experimentsToAdd = changes.added.filter(
          (id) => !experimentsIds.value.includes(id)
        );

        let reducedExperiments = localExperiments.value.filter(
          (project) => !changes.removed.includes(project.id)
        );

        // let fetchedExperiments = fetchExperimentsRequest(experimentsToAdd)
        // experiments.value = [...reducedExperiments, ...fetchedExperiments];
      }
      localPlates.value = newVal;
    },
  });

  const wells = computed({
    get: () => localWells.value,
    set: (newVal) => {
      const changes = detectChanges(localWells.value, newVal, "plateId");
      if (changes.added.length || changes.removed.length) {
        let platesToAdd = changes.added.filter(
          (id) => !platesIds.value.includes(id)
        );

        let reducedPlates = localPlates.value.filter(
          (item) => !changes.removed.includes(item.id)
        );

        // let fetchedPlates = fetchProjectsRequest(platesToAdd)
        // plates.value = [...reducedPlates, ...fetchedPlates];
      }
      localWells.value = newVal;
    },
  });

  function detectChanges(oldArray, newArray, nestedObjectIdName, id = "id") {
    let added = [];
    let removed = [];

    const oldMap = new Map(oldArray.map((item) => [item[id], item]));
    const newMap = new Map(newArray.map((item) => [item[id], item]));

    for (let [id, newItem] of newMap) {
      if (!oldMap.has(id)) {
        added.push(newItem[nestedObjectIdName]);
      }
    }

    for (let [id, oldItem] of oldMap) {
      if (!newMap.has(id)) {
        removed.push(oldItem[nestedObjectIdName]);
      }
    }

    added = added.filter(getUnique);
    removed = removed.filter(getUnique);

    return { added, removed };
  }

  function getUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  return {
    projects,
    experiments,
    plates,
    wells,
    setProjectsAndRemoveChildren,
    setExperimentsAndRemoveChildren,
    setPlatesAndRemoveChildren,
  };
});
